import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET a single post by slug
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        media: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // If post is not published, only allow author or admin to view it
    if (!post.published) {
      const session = await getServerSession(authOptions)

      if (!session || (session.user.id !== post.authorId && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// UPDATE a post (protected)
export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Only allow author or admin to update
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const updateSchema = z.object({
      title: z.string().min(3).optional(),
      content: z.string().min(10).optional(),
      excerpt: z.string().optional().nullable(),
      slug: z.string().min(3).optional(),
      categoryId: z.string().optional().nullable(),
      featuredImage: z.string().optional().nullable(),
      published: z.boolean().optional(),
      tagIds: z.array(z.string()).optional(),
    })

    const { title, content, excerpt, slug, categoryId, featuredImage, published, tagIds } = updateSchema.parse(body)

    // Check if new slug is unique (if provided)
    if (slug && slug !== post.slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug },
      })

      if (existingPost) {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
      }
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(slug && { slug }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(published !== undefined && { published }),
        ...(categoryId !== undefined &&
          (categoryId ? { category: { connect: { id: categoryId } } } : { category: { disconnect: true } })),
      },
    })

    // Update tags if provided
    if (tagIds) {
      // Remove existing tags
      await prisma.tagsOnPosts.deleteMany({
        where: { postId: post.id },
      })

      // Add new tags
      if (tagIds.length > 0) {
        await Promise.all(
          tagIds.map((tagId) =>
            prisma.tagsOnPosts.create({
              data: {
                post: { connect: { id: post.id } },
                tag: { connect: { id: tagId } },
              },
            }),
          ),
        )
      }
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE a post (protected)
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Only allow author or admin to delete
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete post (cascade will handle related records)
    await prisma.post.delete({
      where: { id: post.id },
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
