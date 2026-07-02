import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
// @ts-ignore
import { VocabularyClient } from "./vocabulary-client"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Vocabulary Vault | WriteFlow AI",
  description: "Learn and practice your saved vocabulary.",
}

export default async function VocabularyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const words = await (prisma as any).vocabularyWord.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Format dates for client
  const serializedWords = words.map((w: any) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  }))

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Vocabulary Vault</h1>
        <p className="text-gray-400 mt-2">
          Save new words while writing and master them using interactive flashcards.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center border border-white/10 rounded-xl bg-[#0f0f0f]">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      }>
        <VocabularyClient initialWords={serializedWords} />
      </Suspense>
    </div>
  )
}
