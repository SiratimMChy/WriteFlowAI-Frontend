import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { title, content, status, type, wordCount, templateId } = await req.json()

    const doc = await prisma.document.create({
      data: {
        title: title || "Untitled Document",
        content,
        status: status || "draft",
        type: type || "draft",
        wordCount: wordCount || 0,
        userId: session.user.id,
        templateId: templateId || null
      }
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
