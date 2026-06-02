"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import { Sparkles, FileText, Zap, Clock, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalDocuments: 0, totalWords: 0, documentsThisWeek: 0, wordsThisWeek: 0 })
  const [recentDocuments, setRecentDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Mocking the responses to prevent 404/403 console errors until backend is updated
        const [docsRes, statsRes] = await Promise.all([
          Promise.resolve({ data: { success: true, data: [] } }),
          Promise.resolve({ data: { success: true, data: { totalDocuments: 0, totalWords: 0, documentsThisWeek: 0, wordsThisWeek: 0 } } })
        ])
        if (docsRes.data.success || docsRes.data.data) setRecentDocuments(docsRes.data.data || [])
        if (statsRes.data.success) {
          const s = statsRes.data.data as any
          setStats({
            totalDocuments: s.totalDocuments ?? s.totalBookings ?? 0,
            totalWords: s.totalWords ?? 0,
            documentsThisWeek: s.documentsThisWeek ?? s.bookingsThisWeek ?? 0,
            wordsThisWeek: s.wordsThisWeek ?? 0,
          })
        }
      } catch (err) {
        console.error("Dashboard fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const firstName = user?.name?.split(" ")[0] || "Creator"
  const timeSavedHours = (stats.totalWords / 1500).toFixed(1)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening in your workspace today.</p>
        </div>
        <Link href="/explore">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Documents Created"
          value={loading ? "..." : String(stats.totalDocuments)}
          trend={`+${stats.documentsThisWeek} this week`}
          icon={<FileText className="w-5 h-5 text-violet-400" />}
        />
        <StatCard
          title="Words Generated"
          value={loading ? "..." : stats.totalWords.toLocaleString()}
          trend={`+${stats.wordsThisWeek.toLocaleString()} this week`}
          icon={<Zap className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Time Saved"
          value={loading ? "..." : `${timeSavedHours}h`}
          trend="Based on 25wpm typing speed"
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Documents</h2>
            <Link href="/dashboard/documents" className="text-sm text-violet-400 hover:text-violet-300">
              View all
            </Link>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200 group-hover:text-violet-300 transition-colors">{doc.title || doc.service || "Untitled"}</h3>
                      <p className="text-sm text-gray-500">{timeAgo(doc.updatedAt || doc.createdAt)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No documents yet.</p>
                <Link href="/explore" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
                  Generate content using a template →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/dashboard/draft" className="block">
              <QuickActionCard
                title="Blog Post Writer"
                description="Generate a full SEO-optimized article."
                icon={<Sparkles className="w-5 h-5 text-violet-400" />}
                color="violet"
              />
            </Link>
            <Link href="/dashboard/draft" className="block">
              <QuickActionCard
                title="Social Media Ad"
                description="Create engaging copy for FB/LinkedIn."
                icon={<Zap className="w-5 h-5 text-blue-400" />}
                color="blue"
              />
            </Link>
            <Link href="/dashboard/rewrite" className="block">
              <QuickActionCard
                title="Content Rewriter"
                description="Improve or rephrase existing text."
                icon={<FileText className="w-5 h-5 text-emerald-400" />}
                color="emerald"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color }: { title: string, description: string, icon: React.ReactNode, color: string }) {
  const bgColors = {
    violet: "hover:bg-violet-500/10 hover:border-violet-500/30",
    blue: "hover:bg-blue-500/10 hover:border-blue-500/30",
    emerald: "hover:bg-emerald-500/10 hover:border-emerald-500/30",
  }

  return (
    <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer transition-all ${bgColors[color as keyof typeof bgColors]} group`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}