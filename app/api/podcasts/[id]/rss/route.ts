import { NextResponse } from "next/server"
import RSS from "rss"

import { getPodcastById } from "@/lib/actions/podcast-actions"
import { getEpisodesByPodcastId } from "@/lib/actions/episode-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const podcast = await getPodcastById(params.id)

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
    }

    const episodes = await getEpisodesByPodcastId(params.id)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://forge-blog.com"

    // Create RSS feed
    const feed = new RSS({
      title: podcast.title,
      description: podcast.description,
      feed_url: `${baseUrl}/api/podcasts/${podcast.id}/rss`,
      site_url: `${baseUrl}/podcasts/${podcast.slug}`,
      image_url: podcast.coverImage,
      language: podcast.language || "en",
      copyright: podcast.copyright || `Copyright ${new Date().getFullYear()} FORGE`,
      pubDate: new Date(),
      ttl: 60, // Time to live in minutes
      custom_namespaces: {
        itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
        googleplay: "http://www.google.com/schemas/play-podcasts/1.0",
      },
      custom_elements: [
        { "itunes:subtitle": podcast.description.substring(0, 255) },
        { "itunes:author": podcast.author?.name || "FORGE" },
        { "itunes:summary": podcast.description },
        {
          "itunes:owner": [
            { "itunes:name": podcast.author?.name || "FORGE" },
            { "itunes:email": process.env.PODCAST_CONTACT_EMAIL || "podcasts@forge-blog.com" },
          ],
        },
        {
          "itunes:image": {
            _attr: {
              href: podcast.coverImage,
            },
          },
        },
        {
          "itunes:category": {
            _attr: {
              text: "Health & Fitness",
            },
            "itunes:category": {
              _attr: {
                text: "Fitness",
              },
            },
          },
        },
        { "itunes:explicit": podcast.explicit ? "yes" : "no" },
        { "googleplay:author": podcast.author?.name || "FORGE" },
        { "googleplay:description": podcast.description },
        { "googleplay:explicit": podcast.explicit ? "yes" : "no" },
      ],
    })

    // Add episodes to feed
    episodes.forEach((episode) => {
      if (!episode.publishedAt) return // Skip unpublished episodes

      feed.item({
        title: episode.title,
        description: episode.description,
        url: `${baseUrl}/podcasts/${podcast.slug}/${episode.slug}`,
        guid: episode.id,
        date: episode.publishedAt || episode.createdAt,
        enclosure: {
          url: episode.audioUrl,
          size: episode.audioSize || 0,
          type: "audio/mpeg",
        },
        custom_elements: [
          { "itunes:title": episode.title },
          { "itunes:author": podcast.author?.name || "FORGE" },
          { "itunes:subtitle": episode.description.substring(0, 255) },
          { "itunes:summary": episode.description },
          { "itunes:duration": formatDuration(episode.duration) },
          { "itunes:explicit": episode.explicit ? "yes" : "no" },
          { "itunes:episodeType": "full" },
          { "itunes:episode": episode.episodeNumber },
          episode.seasonNumber && { "itunes:season": episode.seasonNumber },
        ].filter(Boolean),
      })
    })

    // Return RSS feed
    return new NextResponse(feed.xml({ indent: true }), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 })
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

