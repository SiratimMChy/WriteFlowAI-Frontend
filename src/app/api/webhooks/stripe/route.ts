import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

const getStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2024-11-20.acacia"
  })
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe webhook secret is missing.")
    }
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const subscription = event.data.object as Stripe.Subscription

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // First time purchase
        if (session.metadata?.userId) {
          const subscriptionData = await getStripe().subscriptions.retrieve(
            session.subscription as string
          )

          await prisma.user.update({
            where: {
              id: session.metadata.userId,
            },
            data: {
              stripeSubscriptionId: subscriptionData.id,
              stripeCustomerId: subscriptionData.customer as string,
              stripePriceId: subscriptionData.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscriptionData.current_period_end * 1000
              ),
              plan: session.metadata.plan || "free",
            },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        // Subscription updated (e.g. upgraded/downgraded)
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (user) {
          await prisma.user.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled or payment failed fully
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (user) {
          await prisma.user.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
              plan: "free",
            },
          })
        }
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error: any) {
    console.error("[WEBHOOK_UPDATE_ERROR]", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
  }
}
