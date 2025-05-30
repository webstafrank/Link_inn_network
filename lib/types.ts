export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
}

export interface Podcast {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string | null
  rssUrl: string | null
  websiteUrl: string | null
  copyright: string | null
  language: string
  explicit: boolean
  authorId: string
  author?: User
  createdAt: Date
  updatedAt: Date
  applePodcastId?: string
  spotifyId?: string
  _count?: {
    episodes: number
  }
}

export interface Episode {
  id: string
  title: string
  slug: string
  description: string
  audioUrl: string
  audioSize?: number
  duration: number
  episodeNumber: number
  seasonNumber: number | null
  publishedAt: Date | null
  explicit: boolean
  podcastId: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

