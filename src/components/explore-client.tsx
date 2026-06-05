"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { TemplateCard, TemplateCardSkeleton, Template } from "@/components/template-card"
import { useDebounce } from "@/hooks/use-debounce"

export function ExploreClient({ initialTemplates, totalPages }: { initialTemplates: Template[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for UI
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const debouncedQuery = useDebounce(query, 400)
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [rating, setRating] = useState(searchParams.get("rating") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "popular")
  
  const currentPage = Number(searchParams.get("page")) || 1

  // Update URL on filter change
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
      current.set("page", "1") // Reset to page 1 on filter changes
    }

    const search = current.toString()
    const query = search ? `?${search}` : ""
    
    startTransition(() => {
      router.push(`${pathname}${query}`)
    })
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: query })
  }

  useEffect(() => {
    if (debouncedQuery !== (searchParams.get("q") || "")) {
      updateUrl({ q: debouncedQuery })
    }
  }, [debouncedQuery])

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 space-y-8 shrink-0">
        <div>
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search templates..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-white/[0.02] border-white/10 text-sm h-10"
            />
          </form>
          
          <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </h3>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-400 mb-3">Category</div>
            <div className="space-y-2">
              {["", "Blog", "Social Media", "Email", "Ad Copy"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={category === cat}
                    onChange={() => {
                      setCategory(cat)
                      updateUrl({ category: cat })
                    }}
                    className="accent-violet-600 bg-black/50"
                  />
                  {cat === "" ? "All Categories" : cat}
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-400 mb-3">Rating</div>
            <div className="space-y-2">
              {[
                { val: "", label: "Any Rating" },
                { val: "4", label: "4★ & above" },
                { val: "3", label: "3★ & above" },
              ].map((r) => (
                <label key={r.val} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={rating === r.val}
                    onChange={() => {
                      setRating(r.val)
                      updateUrl({ rating: r.val })
                    }}
                    className="accent-violet-600 bg-black/50"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-400">
             Showing results
          </div>
          <select 
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              updateUrl({ sort: e.target.value })
            }}
            className="bg-white/[0.02] border border-white/10 rounded-md text-sm px-3 py-1.5 text-white outline-none focus:border-violet-500"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="rated">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isPending ? (
            Array(8).fill(0).map((_, i) => <TemplateCardSkeleton key={i} />)
          ) : initialTemplates.length > 0 ? (
            initialTemplates.map(t => <TemplateCard key={t.id} template={t} />)
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              No templates found matching your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isPending && totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button 
              disabled={currentPage <= 1}
              onClick={() => updateUrl({ page: String(currentPage - 1) })}
              className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
              disabled={currentPage >= totalPages}
              onClick={() => updateUrl({ page: String(currentPage + 1) })}
              className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
