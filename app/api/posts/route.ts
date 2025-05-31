import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET all published posts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorySlug = searchParams.get("category")
    const tagSlug = searchParams.get("tag")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = { published: true }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (tagSlug) {
      where.tags = { some: { tag: { slug: tagSlug } } }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST a new post (protected)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const postSchema = z.object({
      title: z.string().min(3),
      content: z.string().min(10),
      excerpt: z.string().optional(),
      slug: z.string().min(3),
      categoryId: z.string().optional(),
      featuredImage: z.string().optional(),
      published: z.boolean().default(false),
      tagIds: z.array(z.string()).optional(),
    })

    const { title, content, excerpt, slug, categoryId, featuredImage, published, tagIds } = postSchema.parse(body)

    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published,
        featuredImage,
        author: { connect: { id: session.user.id } },
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      },
    })

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map((tagId) =>
          prisma.tagsOnPosts.create({
            data: {
              post: { connect: { id: post.id } },
              tag: { connect: { id: tagId } },
            },
          }),
        ),
      )
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
