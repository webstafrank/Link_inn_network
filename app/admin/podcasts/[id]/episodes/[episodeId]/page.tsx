import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { redirect } from "next/navigation"

import { getPodcastById } from "@/lib/actions/podcast-actions"
import { getEpisodeById, updateEpisode, deleteEpisode } from "@/lib/actions/episode-actions"
import EpisodeForm from "@/components/podcasts/episode-form"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export async function generateMetadata({ params }: { params: { id: string; episodeId: string } }): Promise<Metadata> {
  const episode = await getEpisodeById(params.episodeId)

  if (!episode) {
    return {
      title: "Episode Not Found | FORGE Admin",
    }
  }

  return {
    title: `Edit ${episode.title} | FORGE Admin`,
    description: `Edit episode details for ${episode.title}`,
  }
}

export default async function EditEpisodePage({ params }: { params: { id: string; episodeId: string } }) {
  const podcast = await getPodcastById(params.id)
  const episode = await getEpisodeById(params.episodeId)

  if (!podcast || !episode || episode.podcastId !== params.id) {
    notFound()
  }

  async function handleUpdateEpisode(formData: FormData) {
    "use server"

    await updateEpisode(params.episodeId, formData)
    redirect(`/admin/podcasts/${params.id}`)
  }

  async function handleDeleteEpisode() {
    "use server"

    await deleteEpisode(params.episodeId)
    redirect(`/admin/podcasts/${params.id}`)
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter mb-2">EDIT EPISODE</h1>
          <p className="text-xl text-muted-foreground">Update details for {episode.title}</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Episode</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the episode and remove the audio file from
                storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action={handleDeleteEpisode}>
                <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="max-w-2xl">
        <EpisodeForm action={handleUpdateEpisode} podcastId={params.id} episode={episode} isEditing={true} />
      </div>
    </div>
  )
}

