import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

const getStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2026-05-27.dahlia" as any
  })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured on this server." }, { status: 500 })
    }

    const body = await req.json()
    const { plan } = body

    if (!plan || (plan !== "pro" && plan !== "team")) {
      return new NextResponse("Invalid plan", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Placeholder Price IDs - In a real app, these should come from your Stripe Dashboard or env vars
    const priceIds = {
      pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro_placeholder",
      team: process.env.STRIPE_TEAM_PRICE_ID || "price_team_placeholder"
    }

    const priceId = priceIds[plan as "pro" | "team"]

    const stripeSession = await getStripe().checkout.sessions.create({
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/#pricing`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT]", error)
    return new NextResponse(error.message, { status: 500 })
  }
}
