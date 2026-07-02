import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vocabularyWords = await (prisma as any).vocabularyWord.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, vocabularyWords })
  } catch (error) {
    console.error("Get vocabulary error:", error)
    return NextResponse.json({ error: "Failed to fetch vocabulary" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { word, definition, example } = body

    if (!word || !definition) {
      return NextResponse.json({ error: "Word and definition are required" }, { status: 400 })
    }

    // Check if word already exists for this user
    const existing = await (prisma as any).vocabularyWord.findFirst({
      where: {
        userId: session.user.id,
        word: {
          equals: word,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Word already exists in vault", vocabularyWord: existing }, { status: 200 })
    }

    const vocabularyWord = await (prisma as any).vocabularyWord.create({
      data: {
        word,
        definition,
        example,
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true, vocabularyWord })
  } catch (error) {
    console.error("Save vocabulary error:", error)
    return NextResponse.json({ error: "Failed to save vocabulary word" }, { status: 500 })
  }
}
