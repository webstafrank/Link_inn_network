import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/blob"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const postId = formData.get("postId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = {
      IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      VIDEO: ["video/mp4", "video/webm", "video/ogg"],
      AUDIO: ["audio/mpeg", "audio/ogg", "audio/wav"],
    }

    const mediaType = type || "IMAGE"

    if (
      (mediaType === "IMAGE" && !validTypes.IMAGE.includes(file.type)) ||
      (mediaType === "VIDEO" && !validTypes.VIDEO.includes(file.type)) ||
      (mediaType === "AUDIO" && !validTypes.AUDIO.includes(file.type))
    ) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Upload file to Vercel Blob
    const { url, filename } = await uploadFile(file, mediaType.toLowerCase())

    // Save media record in database
    const media = await prisma.media.create({
      data: {
        filename,
        url,
        type: mediaType as "IMAGE" | "VIDEO" | "AUDIO",
        size: file.size,
        uploaderId: session.user.id,
        ...(postId && { post: { connect: { id: postId } } }),
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
