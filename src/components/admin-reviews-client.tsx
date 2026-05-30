"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Sparkles, CheckCircle2, XCircle, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateReviewStatus, summarizeReviews } from "@/app/dashboard/admin/reviews/actions"
import { toast } from "sonner"

export function AdminReviewsClient({ reviews, totalPages }: { reviews: any[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [summary, setSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)

  const currentPage = Number(searchParams.get("page")) || 1

  const updateUrl = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") current.delete(key)
      else current.set(key, value)
    })
    if (params.page === undefined) current.set("page", "1")
    const search = current.toString()
    startTransition(() => router.push(`${pathname}${search ? `?${search}` : ""}`))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: query })
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateReviewStatus(id, status)
      if (res.error) toast.error(res.error)
      else toast.success(`Review ${status}`)
    })
  }

  const handleSummarize = async () => {
    setIsSummarizing(true)
    try {
      const res = await summarizeReviews()
      if (res.error) toast.error(res.error)
      else setSummary(res.summary!)
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search reviews..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl"
          />
        </form>
        <Button onClick={handleSummarize} disabled={isSummarizing} className="bg-violet-600 hover:bg-violet-700 text-white h-12">
          <Sparkles className="w-4 h-4 mr-2" />
          {isSummarizing ? "Summarising..." : "AI Review Summariser"}
        </Button>
      </div>

      {summary && (
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-6 relative">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSummary(null)}>
            <XCircle className="w-5 h-5" />
          </Button>
          <h3 className="font-bold text-violet-300 flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" /> AI Summary of Approved Reviews
          </h3>
          <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
            {summary}
          </div>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 font-medium text-gray-400">User</th>
                <th className="p-4 font-medium text-gray-400">Template</th>
                <th className="p-4 font-medium text-gray-400">Rating</th>
                <th className="p-4 font-medium text-gray-400 w-1/3">Review</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={isPending ? "opacity-50 pointer-events-none" : ""}>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                  <td className="p-4 text-sm font-medium">{r.user?.name || "Unknown"}</td>
                  <td className="p-4 text-sm text-gray-400">{r.template?.title || "Unknown Template"}</td>
                  <td className="p-4">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-yellow-400" : "text-gray-600"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300 truncate max-w-[300px]" title={r.content}>{r.content}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium uppercase ${
                      r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      r.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(r.id, "approved")} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 mr-1" title="Approve">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(r.id, "rejected")} className="text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Reject">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && <div className="p-8 text-center text-gray-500">No reviews found.</div>}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button disabled={currentPage <= 1 || isPending} onClick={() => updateUrl({ page: String(currentPage - 1) })} className="px-3 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm">Prev</button>
          <button disabled={currentPage >= totalPages || isPending} onClick={() => updateUrl({ page: String(currentPage + 1) })} className="px-3 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm">Next</button>
        </div>
      )}
    </div>
  )
}
