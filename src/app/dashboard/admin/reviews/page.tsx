"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AdminReviewsClient } from "@/components/admin-reviews-client"
import { Star } from "lucide-react"

export default function AdminReviewsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    const fetchReviews = async () => {
      try {
        // Fetch all items first, then get reviews for each — or use a dedicated admin reviews endpoint
        const res = await api.get("/reviews", { params: { limit: 20 } }).catch(() =>
          api.get("/reviews/all", { params: { limit: 20 } })
        )
        if (res.data.success) {
          setReviews(res.data.data || [])
          if (res.data.meta) {
            setTotalPages(Math.ceil(res.data.meta.total / (res.data.meta.limit || 20)))
          }
        }
      } catch (err) {
        console.error("Reviews fetch error", err)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [user, router])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Star className="w-8 h-8 text-yellow-500" />
          Manage Reviews
        </h1>
        <p className="text-gray-400 mt-1">Moderate user reviews and generate AI summaries.</p>
      </div>
      <AdminReviewsClient reviews={reviews} totalPages={totalPages} />
    </div>
  )
}
