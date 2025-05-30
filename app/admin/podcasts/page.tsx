import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getPodcasts } from "@/lib/actions/podcast-actions"
import PodcastsTable from "@/components/podcasts/podcasts-table"

export const metadata: Metadata = {
  title: "Manage Podcasts | FORGE Admin",
  description: "Manage your podcast shows and episodes",
}

export default async function PodcastsAdminPage() {
  const podcasts = await getPodcasts()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter mb-2">PODCASTS</h1>
          <p className="text-xl text-muted-foreground">Manage your podcast shows and episodes</p>
        </div>
        <Link href="/admin/podcasts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Podcast
          </Button>
        </Link>
      </div>

      <PodcastsTable podcasts={podcasts} />
    </div>
  )
}

