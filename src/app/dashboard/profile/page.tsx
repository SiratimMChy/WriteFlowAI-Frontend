import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { ProfileClient } from "@/components/profile-client"

const prisma = new PrismaClient()

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      plan: true,
    }
  })

  // Calculate usage stats
  // Documents created this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [docsCount, docsWithWords] = await Promise.all([
    prisma.document.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfMonth }
      }
    }),
    prisma.document.findMany({
      where: { userId: session.user.id },
      select: { wordCount: true }
    })
  ])

  const wordsCount = docsWithWords.reduce((sum, doc) => sum + doc.wordCount, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <ProfileClient 
        user={user} 
        stats={{ docsCount, wordsCount }} 
      />
    </div>
  )
}
