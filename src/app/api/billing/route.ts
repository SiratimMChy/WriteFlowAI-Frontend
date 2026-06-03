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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured on this server." }, { status: 500 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    // @ts-ignore
    if (!user || !user.stripeCustomerId) {
      return new NextResponse("No active subscription found", { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const stripeSession = await getStripe().billingPortal.sessions.create({
      // @ts-ignore
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard/profile`,
    })

    return NextResponse.redirect(stripeSession.url)
  } catch (error: any) {
    console.error("[STRIPE_BILLING]", error)
    return new NextResponse(error.message, { status: 500 })
  }
}
