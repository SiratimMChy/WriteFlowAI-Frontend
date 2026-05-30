import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DraftAgentClient } from "@/components/draft-agent-client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function DraftAgentPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  // Check if Draft Agent is enabled in site settings
  const settings = await prisma.siteSettings.findFirst()
  if (settings && !settings.draftAgent && session.user.role !== "admin") {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Draft Agent Disabled</h2>
          <p className="text-gray-400">The administrator has temporarily disabled the Draft Agent.</p>
        </div>
      </div>
    )
  }

  return <DraftAgentClient />
}
