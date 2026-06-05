import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    searchParams.set("userId", session.user.id)
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://writeflowai-backend.onrender.com/api'
    
    const res = await fetch(`${apiUrl}/documents?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch documents from backend", error)
    return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 })
  }
}
