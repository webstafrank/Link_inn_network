import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET all published products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorySlug = searchParams.get("category")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = { published: true }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (type) {
      where.type = type
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST a new product (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const productSchema = z.object({
      name: z.string().min(3),
      slug: z.string().min(3),
      description: z.string().min(10),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      type: z.enum(["EBOOK", "COURSE", "PROGRAM", "PHYSICAL"]),
      featuredImage: z.string().optional(),
      digitalUrl: z.string().optional(),
      stock: z.number().int().optional(),
      published: z.boolean().default(false),
      categoryId: z.string().optional(),
      tagIds: z.array(z.string()).optional(),
    })

    const {
      name,
      slug,
      description,
      price,
      salePrice,
      type,
      featuredImage,
      digitalUrl,
      stock,
      published,
      categoryId,
      tagIds,
    } = productSchema.parse(body)

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice,
        type,
        featuredImage,
        digitalUrl,
        stock,
        published,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      },
    })

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map((tagId) =>
          prisma.tagsOnProducts.create({
            data: {
              product: { connect: { id: product.id } },
              tag: { connect: { id: tagId } },
            },
          }),
        ),
      )
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
