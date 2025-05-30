"use client"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import type { Podcast } from "@/lib/types"

interface PodcastSettingsProps {
  podcast: Podcast
}

export default function PodcastSettings({ podcast }: PodcastSettingsProps) {
  const router = useRouter()
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const rssFeedUrl = `${baseUrl}/api/podcasts/${podcast.id}/rss`

  function copyToClipboard(text: string, message: string) {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: message,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed</CardTitle>
          <CardDescription>
            Use this RSS feed URL to submit your podcast to directories like Apple Podcasts, Spotify, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={rssFeedUrl} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(rssFeedUrl, "RSS feed URL copied to clipboard")}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={rssFeedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Podcast Directories</CardTitle>
          <CardDescription>Submit your podcast to these directories to reach more listeners.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Apple Podcasts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your podcast to Apple Podcasts Connect to reach listeners on Apple Podcasts, iTunes, and more.
              </p>
              <Button variant="outline" asChild>
                <a href="https://podcastsconnect.apple.com/login" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Submit to Apple Podcasts
                </a>
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Spotify</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your podcast to Spotify for Podcasters to reach listeners on Spotify.
              </p>
              <Button variant="outline" asChild>
                <a href="https://podcasters.spotify.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Submit to Spotify
                </a>
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Google Podcasts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your podcast to Google Podcasts Manager to reach listeners on Google Podcasts and Google Search.
              </p>
              <Button variant="outline" asChild>
                <a href="https://podcastsmanager.google.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Submit to Google Podcasts
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Player</CardTitle>
          <CardDescription>Use this code to embed your podcast player on other websites.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="embedCode">Embed Code</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="embedCode"
                  value={`<iframe src="${baseUrl}/podcasts/${podcast.slug}/embed" width="100%" height="180" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(
                      `<iframe src="${baseUrl}/podcasts/${podcast.slug}/embed" width="100%" height="180" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`,
                      "Embed code copied to clipboard",
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

