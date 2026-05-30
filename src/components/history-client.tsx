"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Filter, History, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HistoryClient({ logs, totalPages }: { logs: any[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [agentFilter, setAgentFilter] = useState(searchParams.get("agent") || "")
  
  const currentPage = Number(searchParams.get("page")) || 1

  const updateUrl = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    if (params.page === undefined) {
      current.set("page", "1")
    }

    const search = current.toString()
    const urlQuery = search ? `?${search}` : ""
    
    startTransition(() => {
      router.push(`${pathname}${urlQuery}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: query })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search prompt snippets..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl focus-visible:ring-violet-500"
          />
        </form>
        <select 
          value={agentFilter}
          onChange={(e) => {
            setAgentFilter(e.target.value)
            updateUrl({ agent: e.target.value })
          }}
          className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-gray-300 outline-none focus:border-violet-500 w-full sm:w-auto"
        >
          <option value="">All Agents</option>
          <option value="draft">Draft Agent</option>
          <option value="rewrite">Rewrite Agent</option>
          <option value="chat">Chat Assistant</option>
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-4 font-medium text-gray-400">Date & Time</th>
                  <th className="p-4 font-medium text-gray-400">Agent Used</th>
                  <th className="p-4 font-medium text-gray-400">Prompt Snippet</th>
                  <th className="p-4 font-medium text-gray-400">Usage</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                    <td className="p-4 text-sm text-gray-300">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10 capitalize">
                        {log.agentUsed}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400 truncate max-w-xs" title={log.promptSnippet}>
                      {log.promptSnippet}
                    </td>
                    <td className="p-4 text-sm text-gray-300">{log.tokensUsed} tokens</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No history found</h3>
            <p className="text-sm text-gray-500">You haven't used the AI yet, or no logs match your search.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button 
            disabled={currentPage <= 1 || isPending}
            onClick={() => updateUrl({ page: String(currentPage - 1) })}
            className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-400 flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage >= totalPages || isPending}
            onClick={() => updateUrl({ page: String(currentPage + 1) })}
            className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
