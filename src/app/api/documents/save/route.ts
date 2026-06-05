import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, status, type, wordCount } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const documentData = {
      title: title || "Untitled Document",
      content,
      status: status || "draft",
      type: type || "draft",
      wordCount: wordCount || content.split(/\s+/).length,
      userId: session.user.id
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://writeflowai-backend.onrender.com/api'
    
    const res = await fetch(`${apiUrl}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData)
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, document: data.data })
  } catch (error) {
    console.error("Save document error:", error)
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
  }
}
