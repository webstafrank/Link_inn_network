"use server"

import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/blob"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Episode } from "@/lib/types"

// Get episodes by podcast ID
export async function getEpisodesByPodcastId(podcastId: string): Promise<Episode[]> {
  try {
    const episodes = await prisma.podcastEpisode.findMany({
      where: {
        podcastId,
        // Only show published episodes on the public site
        ...(process.env.NODE_ENV === "production" && {
          publishedAt: { not: null },
        }),
      },
      orderBy: [{ seasonNumber: "desc" }, { episodeNumber: "desc" }],
    })

    return episodes
  } catch (error) {
    console.error("Error fetching episodes:", error)
    throw new Error("Failed to fetch episodes")
  }
}

// Get episode by ID
export async function getEpisodeById(id: string): Promise<Episode | null> {
  try {
    const episode = await prisma.podcastEpisode.findUnique({
      where: { id },
    })

    return episode
  } catch (error) {
    console.error("Error fetching episode:", error)
    throw new Error("Failed to fetch episode")
  }
}

// Get episode by slug
export async function getEpisodeBySlug(podcastId: string, slug: string): Promise<Episode | null> {
  try {
    const episode = await prisma.podcastEpisode.findFirst({
      where: {
        podcastId,
        slug,
      },
    })

    return episode
  } catch (error) {
    console.error("Error fetching episode:", error)
    throw new Error("Failed to fetch episode")
  }
}

// Create a new episode
export async function createEpisode(podcastId: string, formData: FormData): Promise<Episode> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const podcast = await prisma.podcast.findUnique({
      where: { id: podcastId },
    })

    if (!podcast) {
      throw new Error("Podcast not found")
    }

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const episodeNumber = Number.parseInt(formData.get("episodeNumber") as string)
    const seasonNumber = formData.get("seasonNumber") ? Number.parseInt(formData.get("seasonNumber") as string) : null
    const publishedAt = formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null
    const explicit = formData.has("explicit")
    const duration = Number.parseInt((formData.get("duration") as string) || "0")

    // Handle audio file upload
    const audioFile = formData.get("audioFile") as File

    if (!audioFile || audioFile.size === 0) {
      throw new Error("Audio file is required")
    }

    const { url, filename } = await uploadFile(audioFile, "podcast-audio")

    // Create episode
    const episode = await prisma.podcastEpisode.create({
      data: {
        title,
        slug,
        description,
        audioUrl: url,
        audioSize: audioFile.size,
        duration,
        episodeNumber,
        seasonNumber,
        publishedAt,
        explicit,
        podcast: {
          connect: {
            id: podcastId,
          },
        },
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    revalidatePath(`/admin/podcasts/${podcastId}`)
    revalidatePath(`/podcasts/${podcast.slug}`)

    return episode
  } catch (error) {
    console.error("Error creating episode:", error)
    throw new Error("Failed to create episode")
  }
}

// Update an episode
export async function updateEpisode(id: string, formData: FormData): Promise<Episode> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const episode = await prisma.podcastEpisode.findUnique({
      where: { id },
      include: {
        podcast: true,
      },
    })

    if (!episode) {
      throw new Error("Episode not found")
    }

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const episodeNumber = Number.parseInt(formData.get("episodeNumber") as string)
    const seasonNumber = formData.get("seasonNumber") ? Number.parseInt(formData.get("seasonNumber") as string) : null
    const publishedAt = formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : null
    const explicit = formData.has("explicit")
    const duration = Number.parseInt((formData.get("duration") as string) || String(episode.duration))

    // Handle audio file upload
    const audioFile = formData.get("audioFile") as File
    let audioUrl = episode.audioUrl
    let audioSize = episode.audioSize

    if (audioFile && audioFile.size > 0) {
      const { url, filename } = await uploadFile(audioFile, "podcast-audio")
      audioUrl = url
      audioSize = audioFile.size
    }

    // Update episode
    const updatedEpisode = await prisma.podcastEpisode.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        audioUrl,
        audioSize,
        duration,
        episodeNumber,
        seasonNumber,
        publishedAt,
        explicit,
      },
    })

    revalidatePath(`/admin/podcasts/${episode.podcastId}`)
    revalidatePath(`/podcasts/${episode.podcast.slug}`)
    revalidatePath(`/podcasts/${episode.podcast.slug}/${slug}`)

    return updatedEpisode
  } catch (error) {
    console.error("Error updating episode:", error)
    throw new Error("Failed to update episode")
  }
}

// Delete an episode
export async function deleteEpisode(id: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const episode = await prisma.podcastEpisode.findUnique({
      where: { id },
      include: {
        podcast: true,
      },
    })

    if (!episode) {
      throw new Error("Episode not found")
    }

    // Delete episode
    await prisma.podcastEpisode.delete({
      where: { id },
    })

    revalidatePath(`/admin/podcasts/${episode.podcastId}`)
    revalidatePath(`/podcasts/${episode.podcast.slug}`)
  } catch (error) {
    console.error("Error deleting episode:", error)
    throw new Error("Failed to delete episode")
  }
}

