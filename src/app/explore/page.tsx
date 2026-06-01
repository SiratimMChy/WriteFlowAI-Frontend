import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ExploreClient } from "@/components/explore-client"
import { api } from "@/lib/api"

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const rating = typeof searchParams.rating === "string" ? searchParams.rating : ""
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "popular"
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  
  const ITEMS_PER_PAGE = 12

  try {
    const res = await api.get('/items', {
      params: {
        search: q,
        category,
        rating,
        sort,
        page,
        limit: ITEMS_PER_PAGE
      }
    })

    const templates = res.data.data || []
    const meta = res.data.meta || { total: 0 }
    const totalCount = meta.total || 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Templates</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover {totalCount}+ AI templates designed to help you write better, faster. Filter by category, rating, or search for exactly what you need.
          </p>
        </div>

        <ExploreClient 
          initialTemplates={templates} 
          totalPages={totalPages} 
        />
      </main>

      <Footer />
    </div>
  )
} catch (error) {
  // Return fallback if API is down
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-24 sm:py-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Failed to load templates</h1>
          <p className="text-gray-400">Please make sure the backend is running.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
}
