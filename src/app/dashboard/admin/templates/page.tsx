import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { AdminTemplatesClient } from "@/components/admin-templates-client"
import { Grid } from "lucide-react"

const prisma = new PrismaClient()

export default async function AdminTemplatesPage({
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
    where.title = { contains: q }
  }

  const [totalCount, templates] = await Promise.all([
    prisma.template.count({ where }),
    prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Grid className="w-8 h-8 text-blue-500" />
          Manage Templates
        </h1>
        <p className="text-gray-400 mt-1">Create, edit, and remove AI templates from the library.</p>
      </div>

      <AdminTemplatesClient 
        templates={templates} 
        totalPages={totalPages} 
      />
    </div>
  )
}
