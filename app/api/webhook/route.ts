import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const { orderId } = session.metadata

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "completed" },
      })

      // Update stock for physical products
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
        include: { product: true },
      })

      for (const item of orderItems) {
        if (item.product.type === "PHYSICAL" && item.product.stock !== null) {
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: Math.max(0, item.product.stock - item.quantity) },
          })
        }
      }

      break
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object
      const order = await prisma.order.findFirst({
        where: { paymentIntent: paymentIntent.id },
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "failed" },
        })
      }

      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
