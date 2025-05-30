"use client"

import Link from "next/link"
import { MoreHorizontal, Pencil, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Episode } from "@/lib/types"

interface EpisodesTableProps {
  episodes: Episode[]
  podcastId: string
}

export default function EpisodesTable({ episodes, podcastId }: EpisodesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Episode</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {episodes.map((episode) => (
            <TableRow key={episode.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{episode.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Episode {episode.episodeNumber}
                    {episode.seasonNumber && ` • Season ${episode.seasonNumber}`}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDuration(episode.duration)}</TableCell>
              <TableCell>{episode.publishedAt ? formatDate(episode.publishedAt) : "Draft"}</TableCell>
              <TableCell>
                <Badge variant={episode.publishedAt ? "default" : "outline"}>
                  {episode.publishedAt ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/podcasts/${podcastId}/episodes/${episode.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={episode.audioUrl} target="_blank">
                        <Play className="mr-2 h-4 w-4" />
                        Play Audio
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {episodes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No episodes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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

