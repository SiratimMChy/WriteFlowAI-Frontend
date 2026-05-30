import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { DocumentsClient } from "@/components/documents-client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const status = typeof searchParams.status === "string" ? searchParams.status : ""
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  
  const ITEMS_PER_PAGE = 12

  const where: any = {
    userId: session.user.id,
  }
  
  if (q) {
    where.title = { contains: q }
  }
  
  if (status) {
    where.status = status
  }

  const [totalCount, documents] = await Promise.all([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        title: true,
        status: true,
        type: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true
      }
    })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-gray-400 mt-1">Manage and organize all your generated content.</p>
        </div>
        <Link href="/explore">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </Link>
      </div>

      <DocumentsClient 
        documents={documents} 
        totalPages={totalPages} 
      />
    </div>
  )
}
