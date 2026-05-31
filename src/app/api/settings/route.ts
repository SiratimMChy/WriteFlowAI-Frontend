import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return NextResponse.json({
      siteName: settings?.siteName || "WriteFlow",
      logoUrl: settings?.logoUrl || null,
      maintenanceMode: settings?.maintenanceMode || false,
    })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
