import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Clock, ListMusic } from "lucide-react"

import { getPodcastBySlug } from "@/lib/actions/podcast-actions"
import { getEpisodesByPodcastId } from "@/lib/actions/episode-actions"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PodcastSubscribeLinks from "@/components/podcasts/podcast-subscribe-links"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const podcast = await getPodcastBySlug(params.slug)

  if (!podcast) {
    return {
      title: "Podcast Not Found | FORGE",
    }
  }

  return {
    title: `${podcast.title} | FORGE Podcasts`,
    description: podcast.description,
  }
}

export default async function PodcastPage({ params }: { params: { slug: string } }) {
  const podcast = await getPodcastBySlug(params.slug)

  if (!podcast) {
    notFound()
  }

  const episodes = await getEpisodesByPodcastId(podcast.id)

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
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

            <h1 className="text-3xl font-heading mb-2">{podcast.title}</h1>
            <p className="text-muted-foreground mb-4">Hosted by {podcast.author?.name || "FORGE"}</p>

            <p className="mb-6">{podcast.description}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Subscribe:</h3>
              <PodcastSubscribeLinks podcast={podcast} />
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <ListMusic className="mr-1 h-4 w-4" />
              <span>{episodes.length} episodes</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-heading mb-6">All Episodes</h2>

          <div className="space-y-6">
            {episodes.map((episode) => (
              <Card key={episode.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Episode {episode.episodeNumber}
                      {episode.seasonNumber && ` • Season ${episode.seasonNumber}`}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>{formatDate(episode.publishedAt || episode.createdAt)}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{episode.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{episode.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{formatDuration(episode.duration)}</span>
                  </div>
                  <audio src={episode.audioUrl} controls className="w-full" preload="none" />
                </CardContent>
                <CardFooter>
                  <Link href={`/podcasts/${podcast.slug}/${episode.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Episode Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

            {episodes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">No episodes available yet</h3>
                <p className="text-muted-foreground">Check back soon for new episodes.</p>
              </div>
            )}
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

