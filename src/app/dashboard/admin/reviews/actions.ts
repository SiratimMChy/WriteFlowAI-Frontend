"use server"

import { revalidatePath } from "next/cache"
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

    // Delegate AI summarization to the backend (Groq-powered)
    const summaryRes = await api.post("/ai/review-summary", { reviews })

    if (!summaryRes.data.success) {
      return { error: summaryRes.data.message || "Failed to summarize reviews." }
    }

    return { summary: summaryRes.data.data?.summary || "Unable to generate summary." }
  } catch (error: any) {
    console.error("Reviews summarization error:", error)
    return { error: error.response?.data?.message || error.message || "Failed to summarize reviews. Make sure GROQ_API_KEY is configured on the backend." }
  }
}
