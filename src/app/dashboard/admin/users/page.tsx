import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { AdminUsersClient } from "@/components/admin-users-client"
import { Users } from "lucide-react"

const prisma = new PrismaClient()

export default async function AdminUsersPage({
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
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } }
    ]
  }

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        status: true,
        createdAt: true,
      }
    })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          Manage Users
        </h1>
        <p className="text-gray-400 mt-1">View, edit, and manage all users on the platform.</p>
      </div>

      <AdminUsersClient 
        users={users} 
        totalPages={totalPages} 
      />
    </div>
  )
}
