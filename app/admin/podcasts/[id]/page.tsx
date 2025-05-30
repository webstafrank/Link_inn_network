import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPodcastById } from "@/lib/actions/podcast-actions"
import { getEpisodesByPodcastId } from "@/lib/actions/episode-actions"
import PodcastDetails from "@/components/podcasts/podcast-details"
import EpisodesTable from "@/components/podcasts/episodes-table"
import PodcastSettings from "@/components/podcasts/podcast-settings"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const podcast = await getPodcastById(params.id)

  if (!podcast) {
    return {
      title: "Podcast Not Found | FORGE Admin",
    }
  }

  return {
    title: `${podcast.title} | FORGE Admin`,
    description: `Manage ${podcast.title} podcast`,
  }
}

export default async function PodcastDetailPage({ params }: { params: { id: string } }) {
  const podcast = await getPodcastById(params.id)

  if (!podcast) {
    notFound()
  }

  const episodes = await getEpisodesByPodcastId(params.id)

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter mb-2">{podcast.title}</h1>
          <p className="text-xl text-muted-foreground">Manage your podcast show and episodes</p>
        </div>
        <Link href={`/admin/podcasts/${params.id}/episodes/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Episode
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="episodes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="episodes" className="text-base font-bold">
            Episodes
          </TabsTrigger>
          <TabsTrigger value="details" className="text-base font-bold">
            Podcast Details
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-base font-bold">
            Settings & Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="episodes">
          <EpisodesTable episodes={episodes} podcastId={params.id} />
        </TabsContent>

        <TabsContent value="details">
          <PodcastDetails podcast={podcast} />
        </TabsContent>

        <TabsContent value="settings">
          <PodcastSettings podcast={podcast} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

