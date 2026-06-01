"use server"

import { revalidatePath } from "next/cache"
import { genAI, DEFAULT_MODEL } from "@/lib/gemini"
import { api } from "@/lib/api"

export async function updateReviewStatus(reviewId: string, status: string) {
  try {
    const res = await api.patch(`/reviews/${reviewId}`, { status })
    
    if (res.data.success) {
      revalidatePath("/dashboard/admin/reviews")
      return { success: true }
    } else {
      return { error: res.data.message || "Failed to update review status" }
    }
  } catch (error: any) {
    console.error("Failed to update review status:", error)
    return { error: error.response?.data?.message || "Failed to update review status" }
  }
}

export async function summarizeReviews() {
  try {
    const res = await api.get("/reviews", { params: { limit: 100 } }).catch(() =>
      api.get("/reviews/all", { params: { limit: 100 } })
    )

    if (!res.data.success) {
      return { error: "Failed to fetch reviews for summary." }
    }

    const reviews = (res.data.data || []).filter((r: any) => r.status === "approved" || r.status === "Approved")

    if (reviews.length === 0) {
      return { summary: "No approved reviews available to summarize." }
    }

    const reviewTexts = reviews.map((r: any) => `Rating: ${r.rating}/5 - ${r.content}`).join("\n")

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      systemInstruction: `You are an expert product analyst. Your task is to analyze user reviews and:
1. Detect overall sentiment (Positive, Neutral, or Negative).
2. Return a concise, high-level 3-bullet summary of the reviews.

Format your response exactly like this:
Sentiment: [Positive / Neutral / Negative]

Summary:
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]`
    })

    const result = await model.generateContent(`Here are the user reviews:\n\n${reviewTexts}\n\nPlease analyze sentiment and return the 3-bullet summary.`)
    const text = result.response.text() || "Unable to generate summary."

    return { summary: text }
  } catch (error: any) {
    console.error("Reviews summarization error:", error)
    return { error: error.message || "Failed to summarize reviews. Make sure GEMINI_API_KEY is configured." }
  }
}
