"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Filter, FileText, MoreVertical, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function DocumentsClient({ documents, totalPages }: { documents: any[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")
  
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
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search documents by title..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl focus-visible:ring-violet-500"
          />
        </form>
        <select 
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            updateUrl({ status: e.target.value })
          }}
          className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-gray-300 outline-none focus:border-violet-500 w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="draft">Drafts</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, i) => (
            <div key={doc.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <FileText className="w-24 h-24 text-violet-400 -rotate-12 translate-x-4 -translate-y-4" />
              </div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-gray-400 capitalize">
                    {doc.status}
                  </span>
                  <Link href={`/dashboard/draft?documentId=${doc.id}`}>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="font-semibold text-gray-200 group-hover:text-violet-300 transition-colors line-clamp-1">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span className="capitalize">{doc.type}</span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{doc.wordCount} words</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 mb-6">You have no documents yet, or none match your filters.</p>
          <Link href="/explore">
            <Button className="bg-violet-600 hover:bg-violet-700">Start Writing →</Button>
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <button 
            disabled={currentPage <= 1 || isPending}
            onClick={() => updateUrl({ page: String(currentPage - 1) })}
            className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => updateUrl({ page: String(i + 1) })}
              className={`w-8 h-8 rounded-md border text-sm flex items-center justify-center ${
                currentPage === i + 1 
                  ? "border-violet-500 bg-violet-500/20 text-violet-300" 
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
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
