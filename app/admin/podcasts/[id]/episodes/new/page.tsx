import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

import { getPodcastById } from "@/lib/actions/podcast-actions"
import { createEpisode } from "@/lib/actions/episode-actions"
import EpisodeForm from "@/components/podcasts/episode-form"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const podcast = await getPodcastById(params.id)

  if (!podcast) {
    return {
      title: "Podcast Not Found | FORGE Admin",
    }
  }

  return {
    title: `New Episode - ${podcast.title} | FORGE Admin`,
    description: `Create a new episode for ${podcast.title}`,
  }
}

export default async function NewEpisodePage({ params }: { params: { id: string } }) {
  const podcast = await getPodcastById(params.id)

  if (!podcast) {
    notFound()
  }

  async function handleCreateEpisode(formData: FormData) {
    "use server"

    const episode = await createEpisode(params.id, formData)
    redirect(`/admin/podcasts/${params.id}/episodes/${episode.id}`)
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-heading tracking-tighter mb-2">NEW EPISODE</h1>
        <p className="text-xl text-muted-foreground">Create a new episode for {podcast.title}</p>
      </div>

      <div className="max-w-2xl">
        <EpisodeForm action={handleCreateEpisode} podcastId={params.id} />
      </div>
    </div>
  )
}

