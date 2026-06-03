import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "WriteFlow AI",
          maintenanceMode: false,
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch site settings", error)
    return NextResponse.json({ maintenanceMode: false }, { status: 500 })
  }
}
