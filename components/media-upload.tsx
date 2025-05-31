"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface MediaUploadProps {
  onUploadComplete: (media: { id: string; url: string; type: string }) => void
  type?: "IMAGE" | "VIDEO" | "AUDIO"
  postId?: string
  className?: string
}

export default function MediaUpload({ onUploadComplete, type = "IMAGE", postId, className }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const fileUrl = URL.createObjectURL(file)
    setPreview(fileUrl)

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      if (postId) formData.append("postId", postId)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const media = await response.json()
      onUploadComplete(media)
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={type === "IMAGE" ? "image/*" : type === "VIDEO" ? "video/*" : "audio/*"}
      />

      {!preview ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 flex flex-col items-center justify-center border-dashed"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 mb-2" />
              <span>Upload {type.toLowerCase()}</span>
            </>
          )}
        </Button>
      ) : (
        <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
          {type === "IMAGE" && (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          )}
          {type === "VIDEO" && <video src={preview} controls className="w-full h-full object-cover" />}
          {type === "AUDIO" && <audio src={preview} controls className="w-full mt-12" />}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
