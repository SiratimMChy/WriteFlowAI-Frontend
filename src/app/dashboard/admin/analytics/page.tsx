"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AdminAnalytics } from "@/components/admin-analytics"
import { BarChart as BarChartIcon } from "lucide-react"

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [overview, setOverview] = useState({ totalUsers: 0, totalDocuments: 0, aiCallsToday: 0, monthlyRevenue: 0 })
  const [chartData, setChartData] = useState<any>({ dailyAIUsage: [], userSignups: [], contentTypeBreakdown: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    const fetchAnalytics = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get("/dashboard/stats").catch(() => ({ data: { success: true, data: {} } })),
          api.get("/dashboard/chart-data").catch(() => ({ data: { data: {} } }))
        ])
        if (statsRes.data.success) {
          const s = statsRes.data.data
          setOverview({
            totalUsers: s.totalUsers ?? 0,
            totalDocuments: s.totalDocuments ?? s.totalBookings ?? 0,
            aiCallsToday: s.aiCallsToday ?? 0,
            monthlyRevenue: s.monthlyRevenue ?? 0,
          })
        }
        if (chartRes.data.success || chartRes.data.data) {
          const c = chartRes.data.data || {}
          setChartData({
            dailyAIUsage: c.dailyAIUsage || [],
            userSignups: c.userSignups || [],
            contentTypeBreakdown: c.contentTypeBreakdown || [
              { name: "Blog Post", value: 400 },
              { name: "Email", value: 300 },
              { name: "Social Media", value: 300 },
              { name: "Ad Copy", value: 200 }
            ]
          })
        }
      } catch (err) {
        console.error("Analytics fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [user, router])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChartIcon className="w-8 h-8 text-blue-500" />
          Analytics Overview
        </h1>
        <p className="text-gray-400 mt-1">Platform metrics and performance indicators.</p>
      </div>
      <AdminAnalytics
        overview={overview}
        dailyAIUsage={chartData.dailyAIUsage}
        userSignups={chartData.userSignups}
        contentTypeBreakdown={chartData.contentTypeBreakdown}
      />
    </div>
  )
}
