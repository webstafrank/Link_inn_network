"use server"

import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/blob"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Podcast } from "@/lib/types"

// Get all podcasts
export async function getPodcasts(): Promise<Podcast[]> {
  try {
    const podcasts = await prisma.podcast.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return podcasts
  } catch (error) {
    console.error("Error fetching podcasts:", error)
    throw new Error("Failed to fetch podcasts")
  }
}

// Get podcast by ID
export async function getPodcastById(id: string): Promise<Podcast | null> {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })

    return podcast
  } catch (error) {
    console.error("Error fetching podcast:", error)
    throw new Error("Failed to fetch podcast")
  }
}

// Get podcast by slug
export async function getPodcastBySlug(slug: string): Promise<Podcast | null> {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })

    return podcast
  } catch (error) {
    console.error("Error fetching podcast:", error)
    throw new Error("Failed to fetch podcast")
  }
}

// Create a new podcast
export async function createPodcast(formData: FormData): Promise<Podcast> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const language = (formData.get("language") as string) || "en"
    const copyright = (formData.get("copyright") as string) || `Copyright ${new Date().getFullYear()} FORGE`
    const explicit = formData.has("explicit")

    // Handle cover image upload
    const coverImageFile = formData.get("coverImage") as File
    let coverImage = null

    if (coverImageFile && coverImageFile.size > 0) {
      const { url } = await uploadFile(coverImageFile, "podcast-covers")
      coverImage = url
    }

    // Create podcast
    const podcast = await prisma.podcast.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        language,
        copyright,
        explicit,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    revalidatePath("/admin/podcasts")
    revalidatePath("/podcasts")

    return podcast
  } catch (error) {
    console.error("Error creating podcast:", error)
    throw new Error("Failed to create podcast")
  }
}

// Update a podcast
export async function updatePodcast(id: string, formData: FormData): Promise<Podcast> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const podcast = await prisma.podcast.findUnique({
      where: { id },
    })

    if (!podcast) {
      throw new Error("Podcast not found")
    }

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const language = (formData.get("language") as string) || "en"
    const copyright = (formData.get("copyright") as string) || `Copyright ${new Date().getFullYear()} FORGE`
    const explicit = formData.has("explicit")

    // Handle cover image upload
    const coverImageFile = formData.get("coverImage") as File
    let coverImage = podcast.coverImage

    if (coverImageFile && coverImageFile.size > 0) {
      const { url } = await uploadFile(coverImageFile, "podcast-covers")
      coverImage = url
    }

    // Update podcast
    const updatedPodcast = await prisma.podcast.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        coverImage,
        language,
        copyright,
        explicit,
      },
    })

    revalidatePath("/admin/podcasts")
    revalidatePath("/podcasts")
    revalidatePath(`/podcasts/${slug}`)

    return updatedPodcast
  } catch (error) {
    console.error("Error updating podcast:", error)
    throw new Error("Failed to update podcast")
  }
}

// Delete a podcast
export async function deletePodcast(id: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const podcast = await prisma.podcast.findUnique({
      where: { id },
    })

    if (!podcast) {
      throw new Error("Podcast not found")
    }

    // Delete podcast (cascade will handle episodes)
    await prisma.podcast.delete({
      where: { id },
    })

    revalidatePath("/admin/podcasts")
    revalidatePath("/podcasts")
  } catch (error) {
    console.error("Error deleting podcast:", error)
    throw new Error("Failed to delete podcast")
  }
}

