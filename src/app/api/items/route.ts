import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://writeflowai-backend.onrender.com/api'
  
  try {
    const res = await fetch(`${apiUrl}/items?${searchParams.toString()}`, {
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
    console.error("Failed to fetch items from backend", error)
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 })
  }
}
