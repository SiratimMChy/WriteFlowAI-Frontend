"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const prisma = new PrismaClient()

export async function updateReviewStatus(reviewId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status }
    })
    revalidatePath("/dashboard/admin/reviews")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update review status" }
  }
}

export async function summarizeReviews() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      select: { content: true, rating: true }
    })

    if (reviews.length === 0) {
      return { summary: "No approved reviews available to summarize." }
    }

    const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5 - ${r.content}`).join("\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are an expert product analyst. Summarize the following user reviews into a concise list of Pros and Cons. Be brief but informative.",
      prompt: `Here are the user reviews:\n\n${reviewTexts}\n\nPlease summarize them into Pros and Cons.`
    })

    return { summary: text }
  } catch (error) {
    console.error(error)
    return { error: "Failed to summarize reviews. Make sure OPENAI_API_KEY is configured." }
  }
}
