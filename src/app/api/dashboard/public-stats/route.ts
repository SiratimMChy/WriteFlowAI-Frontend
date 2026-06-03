import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [totalUsers, totalTemplates, totalDocs] = await Promise.all([
      prisma.user.count(),
      prisma.template.count(),
      prisma.document.count()
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers + 10000, // Fake boost for marketing
        totalTemplates: totalTemplates + 50,
        wordsGenerated: (totalDocs * 350) + 500000, // Estimate 350 words per doc
        uptimeGuarantee: 99.9
      }
    })
  } catch (error) {
    console.error("Failed to fetch public stats", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
