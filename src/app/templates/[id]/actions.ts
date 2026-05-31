"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitReview(templateId: string, rating: number, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "You must be logged in to leave a review." }
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5 stars." }
  }

  if (!content || content.trim().length < 5) {
    return { error: "Review content must be at least 5 characters long." }
  }

  try {
    // Check if the user already has a review (pending, approved or rejected) for this template
    const existing = await prisma.review.findFirst({
      where: {
        templateId,
        userId: session.user.id
      }
    })

    if (existing) {
      return { error: "You have already reviewed this template." }
    }

    await prisma.review.create({
      data: {
        rating,
        content: content.trim(),
        templateId,
        userId: session.user.id,
        status: "pending" // Admin must moderate reviews
      }
    })

    revalidatePath(`/templates/${templateId}`)
    return { success: true, message: "Your review has been submitted and is pending admin approval." }
  } catch (error) {
    console.error("Submit review error:", error)
    return { error: "Failed to submit review." }
  }
}
