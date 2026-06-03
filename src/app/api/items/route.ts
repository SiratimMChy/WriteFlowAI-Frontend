import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const ratingStr = searchParams.get("rating") || ""
  const sort = searchParams.get("sort") || "popular"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const skip = (page - 1) * limit

  try {
    let where: any = {}
    
    if (q) {
      where.title = { contains: q, mode: "insensitive" }
    }
    
    if (category && category !== "All") {
      where.category = { contains: category, mode: "insensitive" }
    }
    
    if (ratingStr) {
      // rating is usually like "4" or "3"
      where.rating = { gte: parseFloat(ratingStr) }
    }

    let orderBy: any = {}
    if (sort === "popular") {
      orderBy = { usageCount: "desc" }
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" }
    } else if (sort === "rating") {
      orderBy = { rating: "desc" }
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.template.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: templates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch items", error)
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 })
  }
}
