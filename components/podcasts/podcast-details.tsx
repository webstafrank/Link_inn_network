"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updatePodcast } from "@/lib/actions/podcast-actions"
import PodcastForm from "./podcast-form"
import type { Podcast } from "@/lib/types"

interface PodcastDetailsProps {
  podcast: Podcast
}

export default function PodcastDetails({ podcast }: PodcastDetailsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleUpdatePodcast(formData: FormData) {
    setIsSubmitting(true)

    try {
      await updatePodcast(podcast.id, formData)
      router.refresh()
    } catch (error) {
      console.error("Error updating podcast:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PodcastForm action={handleUpdatePodcast} podcast={podcast} isEditing={true} />
    </div>
  )
}

