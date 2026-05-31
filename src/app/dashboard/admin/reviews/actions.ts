"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { groq, DEFAULT_MODEL } from "@/lib/groq"

const prisma = new PrismaClient()

export async function updateReviewStatus(reviewId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { status }
    })

    // If a review is approved, recalculate the average rating and count for the template
    if (status === "approved") {
      const approvedReviews = await prisma.review.findMany({
        where: { templateId: updatedReview.templateId, status: "approved" }
      })

      const ratingCount = approvedReviews.length
      const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / (ratingCount || 1)

      await prisma.template.update({
        where: { id: updatedReview.templateId },
        data: {
          rating: avgRating,
          ratingCount: ratingCount
        }
      })
    }

    revalidatePath("/dashboard/admin/reviews")
    revalidatePath(`/templates/${updatedReview.templateId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update review status:", error)
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

    const completion = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert product analyst. Your task is to analyze user reviews and:
1. Detect overall sentiment (Positive, Neutral, or Negative).
2. Return a concise, high-level 3-bullet summary of the reviews.

Format your response exactly like this:
Sentiment: [Positive / Neutral / Negative]

Summary:
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]`
        },
        {
          role: "user",
          content: `Here are the user reviews:\n\n${reviewTexts}\n\nPlease analyze sentiment and return the 3-bullet summary.`
        }
      ]
    })

    const text = completion.choices[0]?.message?.content || "Unable to generate summary."

    return { summary: text }
  } catch (error) {
    console.error(error)
    return { error: "Failed to summarize reviews. Make sure GROQ_API_KEY is configured." }
  }
}
