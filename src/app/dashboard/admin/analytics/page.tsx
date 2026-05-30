import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { AdminAnalytics } from "@/components/admin-analytics"
import { BarChart as BarChartIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  // Get start of today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fetch overview data
  const [totalUsers, totalDocuments, aiCallsTodayResult] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.aILog.count({
      where: { createdAt: { gte: today } }
    })
  ])

  // Mock revenue calculation based on users
  const proUsers = await prisma.user.count({ where: { plan: "pro" } })
  const teamUsers = await prisma.user.count({ where: { plan: "team" } })
  const monthlyRevenue = (proUsers * 29) + (teamUsers * 99) + 4500 // Adding base mock revenue

  const overview = {
    totalUsers,
    totalDocuments,
    aiCallsToday: aiCallsTodayResult,
    monthlyRevenue
  }

  // Generate last 7 days for charts
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  // Mock daily AI usage based on recent logs (would normally group by date in SQL)
  const dailyAIUsage = dates.map((date, i) => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    calls: Math.floor(Math.random() * 500) + 200 + (i * 50) // Mocking trend
  }))

  // Mock user signups
  const userSignups = dates.map((date, i) => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    signups: Math.floor(Math.random() * 50) + 10 + (i * 5)
  }))

  // Fetch document types for pie chart
  const types = await prisma.document.groupBy({
    by: ['type'],
    _count: true
  })
  
  let contentTypeBreakdown = types.map(t => ({
    name: t.type,
    value: t._count
  }))

  // If no docs, provide mock data
  if (contentTypeBreakdown.length === 0) {
    contentTypeBreakdown = [
      { name: "Blog Post", value: 400 },
      { name: "Email", value: 300 },
      { name: "Social Media", value: 300 },
      { name: "Ad Copy", value: 200 }
    ]
  }

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
        dailyAIUsage={dailyAIUsage}
        userSignups={userSignups}
        contentTypeBreakdown={contentTypeBreakdown}
      />
    </div>
  )
}
