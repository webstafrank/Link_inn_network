import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { createPodcast } from "@/lib/actions/podcast-actions"
import PodcastForm from "@/components/podcasts/podcast-form"

export const metadata: Metadata = {
  title: "Create Podcast | FORGE Admin",
  description: "Create a new podcast show",
}

export default function NewPodcastPage() {
  async function handleCreatePodcast(formData: FormData) {
    "use server"

    const podcast = await createPodcast(formData)
    redirect(`/admin/podcasts/${podcast.id}`)
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-heading tracking-tighter mb-2">CREATE PODCAST</h1>
        <p className="text-xl text-muted-foreground">Set up a new podcast show</p>
      </div>

      <div className="max-w-2xl">
        <PodcastForm action={handleCreatePodcast} />
      </div>
    </div>
  )
}

