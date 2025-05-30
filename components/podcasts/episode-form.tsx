"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Play, Pause } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import type { Episode } from "@/lib/types"

interface EpisodeFormProps {
  action: (formData: FormData) => Promise<void>
  podcastId: string
  episode?: Episode
  isEditing?: boolean
}

export default function EpisodeForm({ action, podcastId, episode, isEditing = false }: EpisodeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioDuration, setAudioDuration] = useState<number>(episode?.duration || 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add podcast ID
      formData.append("podcastId", podcastId)

      // Add audio duration
      formData.append("duration", audioDuration.toString())

      await action(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)

      // Create object URL for audio preview
      const audioUrl = URL.createObjectURL(file)

      // Load audio to get duration
      const audio = new Audio(audioUrl)
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(Math.round(audio.duration))
      })
    }
  }

  function handleRemoveAudio() {
    setAudioFile(null)
    setAudioDuration(0)
    const fileInput = document.getElementById("audioFile") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  function togglePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Episode Title</Label>
          <Input id="title" name="title" defaultValue={episode?.title || ""} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={episode?.slug || ""} required className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">
            Used in the URL: forge-blog.com/podcasts/[podcast-slug]/<span className="font-mono">[episode-slug]</span>
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={episode?.description || ""}
          required
          className="mt-1 min-h-[120px]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="episodeNumber">Episode Number</Label>
          <Input
            id="episodeNumber"
            name="episodeNumber"
            type="number"
            min="1"
            defaultValue={episode?.episodeNumber || "1"}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="seasonNumber">Season Number (optional)</Label>
          <Input
            id="seasonNumber"
            name="seasonNumber"
            type="number"
            min="1"
            defaultValue={episode?.seasonNumber || ""}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="publishedAt">Publish Date (optional)</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={episode?.publishedAt ? new Date(episode.publishedAt).toISOString().slice(0, 16) : ""}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">Leave blank to save as draft</p>
        </div>
      </div>

      <div>
        <Label htmlFor="audioFile">Audio File</Label>
        <div className="mt-1">
          <Card>
            <CardContent className="p-4">
              {isEditing && episode?.audioUrl && !audioFile ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current audio file</p>
                    <p className="text-sm text-muted-foreground">Duration: {formatDuration(episode.duration)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("audioFile")?.click()}
                    >
                      Replace
                    </Button>
                  </div>
                  <audio ref={audioRef} src={episode.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                </div>
              ) : audioFile ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {formatFileSize(audioFile.size)} • Duration: {formatDuration(audioDuration)}
                    </p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={handleRemoveAudio}>
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="font-medium">Upload MP3 audio file</p>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                  <Button type="button" variant="outline" onClick={() => document.getElementById("audioFile")?.click()}>
                    Select File
                  </Button>
                </div>
              )}
              <Input
                id="audioFile"
                name="audioFile"
                type="file"
                accept="audio/mpeg,audio/mp3"
                onChange={handleAudioChange}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="explicit" name="explicit" defaultChecked={episode?.explicit || false} />
        <Label htmlFor="explicit">Contains explicit content</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || (!isEditing && !audioFile)}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Episode"
          )}
        </Button>
      </div>
    </form>
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

