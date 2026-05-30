import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RewriteAgentClient } from "@/components/rewrite-agent-client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function RewriteAgentPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  // Check if Rewrite Agent is enabled in site settings
  const settings = await prisma.siteSettings.findFirst()
  if (settings && !settings.rewriteAgent && session.user.role !== "admin") {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Rewrite Agent Disabled</h2>
          <p className="text-gray-400">The administrator has temporarily disabled the Rewrite Agent.</p>
        </div>
      </div>
    )
  }

  return <RewriteAgentClient />
}
