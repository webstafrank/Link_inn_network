"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Podcast } from "@/lib/types"

interface PodcastFormProps {
  action: (formData: FormData) => Promise<void>
  podcast?: Podcast
  isEditing?: boolean
}

export default function PodcastForm({ action, podcast, isEditing = false }: PodcastFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(podcast?.coverImage || null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await action(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setCoverImagePreview(imageUrl)
    }
  }

  function handleRemoveCoverImage() {
    setCoverImagePreview(null)
    const fileInput = document.getElementById("coverImage") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Podcast Title</Label>
          <Input id="title" name="title" defaultValue={podcast?.title || ""} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={podcast?.slug || ""} required className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">
            Used in the URL: forge-blog.com/podcasts/<span className="font-mono">[slug]</span>
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={podcast?.description || ""}
          required
          className="mt-1 min-h-[120px]"
        />
        <p className="text-sm text-muted-foreground mt-1">
          This will appear in podcast directories like Apple Podcasts and Spotify.
        </p>
      </div>

      <div>
        <Label htmlFor="coverImage">Cover Image</Label>
        <div className="mt-1 flex items-center gap-4">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">
            {coverImagePreview ? (
              <>
                <Image
                  src={coverImagePreview || "/placeholder.svg"}
                  alt="Cover image preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={handleRemoveCoverImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("coverImage")?.click()}>
              {coverImagePreview ? "Change Image" : "Upload Image"}
            </Button>
            <p className="text-sm text-muted-foreground mt-1">Recommended: 3000x3000px square JPG or PNG.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="language">Language</Label>
          <Input id="language" name="language" defaultValue={podcast?.language || "en"} className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">Two-letter language code (e.g., "en" for English)</p>
        </div>

        <div>
          <Label htmlFor="copyright">Copyright</Label>
          <Input
            id="copyright"
            name="copyright"
            defaultValue={podcast?.copyright || `Copyright ${new Date().getFullYear()} FORGE`}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="explicit" name="explicit" defaultChecked={podcast?.explicit || false} />
        <Label htmlFor="explicit">Contains explicit content</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Podcast"
          )}
        </Button>
      </div>
    </form>
  )
}

