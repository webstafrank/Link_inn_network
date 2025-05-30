import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react"

import { getPodcastBySlug } from "@/lib/actions/podcast-actions"
import { getEpisodeBySlug } from "@/lib/actions/episode-actions"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import PodcastSubscribeLinks from "@/components/podcasts/podcast-subscribe-links"
import PodcastPlayer from "@/components/podcasts/podcast-player"

export async function generateMetadata({
  params,
}: { params: { slug: string; episodeSlug: string } }): Promise<Metadata> {
  const podcast = await getPodcastBySlug(params.slug)

  if (!podcast) {
    return {
      title: "Podcast Not Found | FORGE",
    }
  }

  const episode = await getEpisodeBySlug(podcast.id, params.episodeSlug)

  if (!episode) {
    return {
      title: "Episode Not Found | FORGE",
    }
  }

  return {
    title: `${episode.title} - ${podcast.title} | FORGE Podcasts`,
    description: episode.description,
  }
}

export default async function EpisodePage({ params }: { params: { slug: string; episodeSlug: string } }) {
  const podcast = await getPodcastBySlug(params.slug)

  if (!podcast) {
    notFound()
  }

  const episode = await getEpisodeBySlug(podcast.id, params.episodeSlug)

  if (!episode) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <Link
        href={`/podcasts/${podcast.slug}`}
        className="flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {podcast.title}
      </Link>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-square relative mb-6">
              <Image
                src={podcast.coverImage || "/placeholder.svg?height=400&width=400&text=Podcast"}
                alt={podcast.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <h2 className="text-xl font-heading mb-2">{podcast.title}</h2>
            <p className="text-muted-foreground mb-6">Hosted by {podcast.author?.name || "FORGE"}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Subscribe:</h3>
              <PodcastSubscribeLinks podcast={podcast} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              Episode {episode.episodeNumber}
              {episode.seasonNumber && ` • Season ${episode.seasonNumber}`}
            </Badge>
            <h1 className="text-3xl font-heading mb-2">{episode.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>{formatDate(episode.publishedAt || episode.createdAt)}</span>
              <span className="mx-2">•</span>
              <Clock className="mr-1 h-4 w-4" />
              <span>{formatDuration(episode.duration)}</span>
            </div>
          </div>

          <PodcastPlayer episode={episode} />

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Episode Notes</h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{episode.description}</p>

              {/* If you have show notes in HTML/Markdown format, render them here */}
              {/* <div dangerouslySetInnerHTML={{ __html: episode.showNotes }} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} hr ${minutes} min`
  }

  return `${minutes} min`
}

