import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ChatAgentClient } from "@/components/chat-agent-client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function ChatAgentPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  // Check if Chat Agent is enabled in site settings
  const settings = await prisma.siteSettings.findFirst()
  if (settings && !settings.chatAgent && session.user.role !== "admin") {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Chat Assistant Disabled</h2>
          <p className="text-gray-400">The administrator has temporarily disabled the Chat Assistant.</p>
        </div>
      </div>
    )
  }

  return <ChatAgentClient />
}
