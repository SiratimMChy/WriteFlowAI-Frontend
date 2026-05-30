import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { AdminReviewsClient } from "@/components/admin-reviews-client"
import { Star } from "lucide-react"

const prisma = new PrismaClient()

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  
  const ITEMS_PER_PAGE = 20

  const where: any = {}
  
  if (q) {
    where.content = { contains: q }
  }

  const [totalCount, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        user: { select: { name: true, email: true } },
        template: { select: { title: true } }
      }
    })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Star className="w-8 h-8 text-yellow-500" />
          Manage Reviews
        </h1>
        <p className="text-gray-400 mt-1">Moderate user reviews and generate AI summaries.</p>
      </div>

      <AdminReviewsClient 
        reviews={reviews} 
        totalPages={totalPages} 
      />
    </div>
  )
}
