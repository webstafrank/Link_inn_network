import { Button } from "@/components/ui/button"
import type { Podcast } from "@/lib/types"

interface PodcastSubscribeLinksProps {
  podcast: Podcast
}

export default function PodcastSubscribeLinks({ podcast }: PodcastSubscribeLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://podcasts.apple.com/podcast/id${podcast.applePodcastId || "unknown"}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
            <path d="M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
            <path d="M12 13v8" />
          </svg>
          Apple
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://open.spotify.com/show/${podcast.spotifyId || "unknown"}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
            <circle cx="12" cy="12" r="10" />
            <path d="M8 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M12 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M16 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M8 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M16 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
          Spotify
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://podcasts.google.com/feed/${encodeURIComponent(`/api/podcasts/${podcast.id}/rss`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
          Google
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a href={`/api/podcasts/${podcast.id}/rss`} target="_blank" rel="noopener noreferrer">
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
          RSS
        </a>
      </Button>
    </div>
  )
}

