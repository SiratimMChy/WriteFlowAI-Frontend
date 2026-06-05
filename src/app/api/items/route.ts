import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const rating = searchParams.get("rating") || ""
    const sort = searchParams.get("sort") || "popular"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    let where: any = { isActive: true }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (category && category !== "All" && category !== "all") {
      where.category = category
    }

    if (rating && rating !== "All") {
      where.rating = { gte: parseFloat(rating) }
    }

    let orderBy: any = { usageCount: 'desc' }
    if (sort === "newest") {
      orderBy = { createdAt: 'desc' }
    } else if (sort === "rated") {
      orderBy = { rating: 'desc' }
    } else if (sort === "popular") {
      orderBy = { usageCount: 'desc' }
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
      }
    });
  } catch (error) {
    console.error("Failed to fetch templates", error)
    return NextResponse.json({ success: false, error: "Failed to fetch templates" }, { status: 500 })
  }
}
