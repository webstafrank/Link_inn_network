import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { getPodcasts } from "@/lib/actions/podcast-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Podcasts | FORGE",
  description: "Listen to our podcasts on strength, masculinity, and self-improvement",
}

export default async function PodcastsPage() {
  const podcasts = await getPodcasts()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter md:text-5xl">FORGE PODCASTS</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            Hard-hitting conversations on strength, masculinity, and self-improvement
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square relative">
                <Image
                  src={podcast.coverImage || "/placeholder.svg?height=400&width=400&text=Podcast"}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{podcast.title}</CardTitle>
                <CardDescription>{podcast.author?.name || "FORGE"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{podcast.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href={`/podcasts/${podcast.slug}`} className="w-full">
                  <Button className="w-full">View Episodes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          {podcasts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-bold mb-2">No podcasts available yet</h3>
              <p className="text-muted-foreground">Check back soon for our upcoming podcast series.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

