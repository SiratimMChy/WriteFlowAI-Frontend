"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { HistoryClient } from "@/components/history-client"
import { History } from "lucide-react"

export default function AIHistoryPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Mocked response to prevent 404 console errors since ai/history endpoint is not built
        const res = await Promise.resolve({ data: { success: true, data: [] } }) as any
        if (res.data.success) {
          setLogs(res.data.data || [])
          if (res.data.meta) {
            setTotalPages(Math.ceil(res.data.meta.total / (res.data.meta.limit || 20)))
          }
        }
      } catch (err) {
        console.error("History fetch error", err)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-8 h-8 text-violet-500" />
            AI History
          </h1>
          <p className="text-gray-400 mt-1">Review your past AI interactions and token usage.</p>
        </div>
      </div>
      <HistoryClient logs={logs} totalPages={totalPages} />
    </div>
  )
}
