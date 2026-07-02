import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params


    const word = await (prisma as any).vocabularyWord.findUnique({
      where: { id }
    })

    if (!word || word.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    await (prisma as any).vocabularyWord.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete vocabulary error:", error)
    return NextResponse.json({ error: "Failed to delete vocabulary word" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status } = body 

  
    const word = await (prisma as any).vocabularyWord.findUnique({
      where: { id }
    })

    if (!word || word.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    const updatedWord = await (prisma as any).vocabularyWord.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, vocabularyWord: updatedWord })
  } catch (error) {
    console.error("Update vocabulary error:", error)
    return NextResponse.json({ error: "Failed to update vocabulary word" }, { status: 500 })
  }
}
