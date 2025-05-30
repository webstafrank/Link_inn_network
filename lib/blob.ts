import { put, del } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadFile(file: File, folder = "general") {
  try {
    const filename = `${folder}/${nanoid()}-${file.name.replace(/\s+/g, "-")}`
    const { url } = await put(filename, file, {
      access: "public",
    })
    return { url, filename }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(filename: string) {
  try {
    await del(filename)
    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}

