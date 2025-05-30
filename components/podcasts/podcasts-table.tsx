"use client"

import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Pencil } from "lucide-react"

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
import { formatDate } from "@/lib/utils"
import type { Podcast } from "@/lib/types"

interface PodcastsTableProps {
  podcasts: Podcast[]
}

export default function PodcastsTable({ podcasts }: PodcastsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Podcast</TableHead>
            <TableHead>Episodes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {podcasts.map((podcast) => (
            <TableRow key={podcast.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 relative rounded overflow-hidden">
                    <Image
                      src={podcast.coverImage || "/placeholder.svg?height=48&width=48"}
                      alt={podcast.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{podcast.title}</div>
                    <div className="text-sm text-muted-foreground">{podcast.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{podcast._count?.episodes || 0}</TableCell>
              <TableCell>{formatDate(podcast.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${podcast._count?.episodes ? "bg-green-500" : "bg-amber-500"}`}
                  />
                  <span>{podcast._count?.episodes ? "Active" : "No Episodes"}</span>
                </div>
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
                      <Link href={`/admin/podcasts/${podcast.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/api/podcasts/${podcast.id}/rss`} target="_blank">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M19 20.001C19 11.729 12.271 5 4 5" />
                          <path d="M4 15c3.866 0 7 3.134 7 7" />
                          <circle cx="5" cy="20" r="1" />
                        </svg>
                        RSS Feed
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {podcasts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No podcasts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

