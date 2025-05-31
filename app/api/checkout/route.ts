import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const checkoutSchema = z.object({
      items: z.array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().positive(),
        }),
      ),
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
    })

    const { items, successUrl, cancelUrl } = checkoutSchema.parse(body)

    // Fetch products from database
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
      },
    })

    // Validate all products exist and are published
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are invalid or unavailable" }, { status: 400 })
    }

    // Check stock for physical products
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (product?.type === "PHYSICAL" && product.stock !== null && product.stock < item.quantity) {
        return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 })
      }
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description.substring(0, 500),
            images: product.featuredImage ? [product.featuredImage] : undefined,
          },
          unit_amount: Math.round((product.salePrice || product.price) * 100),
        },
        quantity: item.quantity,
      }
    })

    // Calculate order total
    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!
      return sum + (product.salePrice || product.price) * item.quantity
    }, 0)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        total,
        status: "pending",
        user: { connect: { id: session.user.id } },
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!
            return {
              quantity: item.quantity,
              price: product.salePrice || product.price,
              product: { connect: { id: item.productId } },
            }
          }),
        },
      },
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?orderId=${order.id}`,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    })

    // Update order with payment intent
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentIntent: stripeSession.payment_intent as string,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
