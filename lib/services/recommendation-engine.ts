import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Types for recommendations
export type RecommendationItem = {
  id: string
  title: string
  description: string
  type: "post" | "product" | "podcast" | "episode"
  imageUrl?: string
  url: string
  score: number
}

export type RecommendationResponse = {
  articles: RecommendationItem[]
  products: RecommendationItem[]
  podcasts: RecommendationItem[]
}

// Main recommendation function
export async function getRecommendations(userId?: string, limit = 5): Promise<RecommendationResponse> {
  // If no userId provided, try to get from session
  if (!userId) {
    const session = await getServerSession(authOptions)
    userId = session?.user?.id
  }

  // If still no userId, return empty recommendations
  if (!userId) {
    return {
      articles: [],
      products: [],
      podcasts: [],
    }
  }

  // Get user preferences
  const userPreferences = await prisma.userPreference.findUnique({
    where: { userId },
  })

  // Get user recent activity
  const recentActivity = await prisma.userActivity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  // Get recommendation history to avoid repeating recommendations
  const recommendationHistory = await prisma.recommendationHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const historyIds = recommendationHistory.map((h) => h.itemId)

  // Get content based on user preferences and activity
  const [articles, products, podcasts] = await Promise.all([
    getArticleRecommendations(userId, userPreferences, recentActivity, historyIds, limit),
    getProductRecommendations(userId, userPreferences, recentActivity, historyIds, limit),
    getPodcastRecommendations(userId, userPreferences, recentActivity, historyIds, limit),
  ])

  return {
    articles,
    products,
    podcasts,
  }
}

// Helper function to get article recommendations
async function getArticleRecommendations(
  userId: string,
  preferences: any,
  recentActivity: any[],
  historyIds: string[],
  limit: number,
): Promise<RecommendationItem[]> {
  // Extract categories and tags from preferences
  const categories = preferences?.categories || []
  const tags = preferences?.tags || []

  // Extract content IDs from recent activity
  const viewedPostIds = recentActivity
    .filter((a) => a.itemType === "post" && a.activityType === "view")
    .map((a) => a.itemId)

  // Get posts based on preferences and exclude already viewed/recommended
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        { published: true },
        {
          OR: [{ categoryId: { in: categories } }, { tags: { some: { tag: { id: { in: tags } } } } }],
        },
        { id: { notIn: [...viewedPostIds, ...historyIds] } },
      ],
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    take: limit * 2, // Get more than needed to allow for scoring and filtering
  })

  // If not enough posts from preferences, get popular posts
  if (posts.length < limit) {
    const additionalPosts = await prisma.post.findMany({
      where: {
        published: true,
        id: { notIn: [...posts.map((p) => p.id), ...viewedPostIds, ...historyIds] },
      },
      orderBy: { viewCount: "desc" },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      take: limit - posts.length,
    })
    posts.push(...additionalPosts)
  }

  // Score and format posts
  const scoredPosts = posts.map((post) => {
    // Calculate score based on various factors
    let score = 1.0

    // Boost score for posts in preferred categories
    if (categories.includes(post.categoryId)) {
      score += 0.5
    }

    // Boost score for posts with preferred tags
    const postTagIds = post.tags.map((t) => t.tag.id)
    const matchingTags = tags.filter((t) => postTagIds.includes(t))
    score += matchingTags.length * 0.2

    // Recency boost
    const daysSincePublished = post.publishedAt
      ? Math.max(0, (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30
    score += Math.max(0, 1 - daysSincePublished / 30) // Boost for posts less than 30 days old

    return {
      id: post.id,
      title: post.title,
      description: post.excerpt || post.content.substring(0, 120) + "...",
      type: "post" as const,
      imageUrl: post.featuredImage,
      url: `/blog/${post.slug}`,
      score,
    }
  })

  // Sort by score and take the top 'limit' items
  return scoredPosts.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Helper function to get product recommendations
async function getProductRecommendations(
  userId: string,
  preferences: any,
  recentActivity: any[],
  historyIds: string[],
  limit: number,
): Promise<RecommendationItem[]> {
  // Extract categories, tags, and fitness goals from preferences
  const categories = preferences?.categories || []
  const tags = preferences?.tags || []
  const fitnessGoals = preferences?.fitnessGoals || []
  const fitnessLevel = preferences?.fitnessLevel

  // Extract product IDs from recent activity
  const viewedProductIds = recentActivity
    .filter((a) => a.itemType === "product" && a.activityType === "view")
    .map((a) => a.itemId)

  // Get products based on preferences and exclude already viewed/recommended
  const products = await prisma.product.findMany({
    where: {
      AND: [
        { published: true },
        {
          OR: [
            { categoryId: { in: categories } },
            { tags: { some: { tag: { id: { in: tags } } } } },
            { difficulty: fitnessLevel },
          ],
        },
        { id: { notIn: [...viewedProductIds, ...historyIds] } },
      ],
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    take: limit * 2,
  })

  // If not enough products from preferences, get popular products
  if (products.length < limit) {
    const additionalProducts = await prisma.product.findMany({
      where: {
        published: true,
        id: { notIn: [...products.map((p) => p.id), ...viewedProductIds, ...historyIds] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      take: limit - products.length,
    })
    products.push(...additionalProducts)
  }

  // Score and format products
  const scoredProducts = products.map((product) => {
    let score = 1.0

    // Boost score for products in preferred categories
    if (categories.includes(product.categoryId)) {
      score += 0.5
    }

    // Boost score for products with preferred tags
    const productTagIds = product.tags.map((t) => t.tag.id)
    const matchingTags = tags.filter((t) => productTagIds.includes(t))
    score += matchingTags.length * 0.2

    // Boost for matching fitness level
    if (fitnessLevel && product.difficulty === fitnessLevel) {
      score += 0.5
    }

    return {
      id: product.id,
      title: product.title,
      description: product.shortDescription || product.description.substring(0, 120) + "...",
      type: "product" as const,
      imageUrl: product.featuredImage,
      url: `/shop/product/${product.slug}`,
      score,
    }
  })

  // Sort by score and take the top 'limit' items
  return scoredProducts.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Helper function to get podcast recommendations
async function getPodcastRecommendations(
  userId: string,
  preferences: any,
  recentActivity: any[],
  historyIds: string[],
  limit: number,
): Promise<RecommendationItem[]> {
  // Extract categories and tags from preferences
  const categories = preferences?.categories || []
  const tags = preferences?.tags || []

  // Extract podcast and episode IDs from recent activity
  const viewedPodcastIds = recentActivity
    .filter((a) => a.itemType === "podcast" && a.activityType === "view")
    .map((a) => a.itemId)

  const viewedEpisodeIds = recentActivity
    .filter((a) => a.itemType === "episode" && a.activityType === "view")
    .map((a) => a.itemId)

  // Get episodes based on preferences and exclude already viewed/recommended
  const episodes = await prisma.podcastEpisode.findMany({
    where: {
      AND: [
        { publishedAt: { not: null } },
        {
          OR: [{ podcast: { categoryId: { in: categories } } }, { tags: { some: { tag: { id: { in: tags } } } } }],
        },
        { id: { notIn: [...viewedEpisodeIds, ...historyIds] } },
      ],
    },
    include: {
      podcast: true,
      tags: { include: { tag: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit * 2,
  })

  // If not enough episodes from preferences, get recent episodes
  if (episodes.length < limit) {
    const additionalEpisodes = await prisma.podcastEpisode.findMany({
      where: {
        publishedAt: { not: null },
        id: { notIn: [...episodes.map((e) => e.id), ...viewedEpisodeIds, ...historyIds] },
      },
      include: {
        podcast: true,
      },
      orderBy: { publishedAt: "desc" },
      take: limit - episodes.length,
    })
    episodes.push(...additionalEpisodes)
  }

  // Score and format episodes
  const scoredEpisodes = episodes.map((episode) => {
    let score = 1.0

    // Boost score for episodes in preferred categories
    if (categories.includes(episode.podcast.categoryId)) {
      score += 0.5
    }

    // Boost score for episodes with preferred tags
    if (episode.tags) {
      const episodeTagIds = episode.tags.map((t) => t.tag.id)
      const matchingTags = tags.filter((t) => episodeTagIds.includes(t))
      score += matchingTags.length * 0.2
    }

    // Recency boost
    const daysSincePublished = episode.publishedAt
      ? Math.max(0, (Date.now() - new Date(episode.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30
    score += Math.max(0, 1 - daysSincePublished / 30) // Boost for episodes less than 30 days old

    return {
      id: episode.id,
      title: episode.title,
      description: episode.description.substring(0, 120) + "...",
      type: "episode" as const,
      imageUrl: episode.podcast.coverImage,
      url: `/podcasts/${episode.podcast.slug}/${episode.slug}`,
      score,
    }
  })

  // Sort by score and take the top 'limit' items
  return scoredEpisodes.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Function to track user activity
export async function trackUserActivity(userId: string, itemType: string, itemId: string, activityType: string) {
  return prisma.userActivity.create({
    data: {
      userId,
      itemType,
      itemId,
      activityType,
    },
  })
}

// Function to update user preferences
export async function updateUserPreferences(
  userId: string,
  preferences: {
    categories?: string[]
    tags?: string[]
    fitnessLevel?: string
    fitnessGoals?: string[]
  },
) {
  return prisma.userPreference.upsert({
    where: { userId },
    update: preferences,
    create: {
      userId,
      ...preferences,
      categories: preferences.categories || [],
      tags: preferences.tags || [],
      fitnessGoals: preferences.fitnessGoals || [],
    },
  })
}

// Function to record recommendation history
export async function recordRecommendation(userId: string, itemType: string, itemId: string) {
  return prisma.recommendationHistory.create({
    data: {
      userId,
      itemType,
      itemId,
    },
  })
}

