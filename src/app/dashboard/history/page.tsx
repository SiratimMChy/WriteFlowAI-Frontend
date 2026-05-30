import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { HistoryClient } from "@/components/history-client"
import { History } from "lucide-react"

const prisma = new PrismaClient()

export default async function AIHistoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const agent = typeof searchParams.agent === "string" ? searchParams.agent : ""
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  
  const ITEMS_PER_PAGE = 20

  const where: any = {
    userId: session.user.id,
  }
  
  if (q) {
    where.promptSnippet = { contains: q }
  }
  
  if (agent) {
    where.agentUsed = agent
  }

  const [totalCount, logs] = await Promise.all([
    prisma.aILog.count({ where }),
    prisma.aILog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        agentUsed: true,
        promptSnippet: true,
        tokensUsed: true,
        createdAt: true,
      }
    })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

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

      <HistoryClient 
        logs={logs} 
        totalPages={totalPages} 
      />
    </div>
  )
}
