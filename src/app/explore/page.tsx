import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ExploreClient } from "@/components/explore-client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

  // Build where clause
  const where: any = {
    isActive: true,
  }
  
  if (q) {
    where.OR = [
      { title: { contains: q } }, // SQLite contains is case-insensitive in Prisma mostly depending on DB, but SQLite uses nocase
      { description: { contains: q } }
    ]
  }
  
  if (category) {
    where.category = category
  }
  
  if (rating) {
    where.rating = { gte: parseFloat(rating) }
  }

  // Build orderBy
  let orderBy: any = { usageCount: "desc" }
  if (sort === "newest") orderBy = { createdAt: "desc" }
  if (sort === "rated") orderBy = { rating: "desc" }

  // Fetch data
  const [totalCount, templates] = await Promise.all([
    prisma.template.count({ where }),
    prisma.template.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        rating: true,
        usageCount: true,
        thumbnail: true,
      }
    })
  ])

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
}
