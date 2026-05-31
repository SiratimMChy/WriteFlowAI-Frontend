"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function updateSiteSettings(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const siteName = formData.get("siteName") as string
  const logoUrl = formData.get("logoUrl") as string
  const maintenanceMode = formData.get("maintenanceMode") === "true"
  const draftAgent = formData.get("draftAgent") === "true"
  const rewriteAgent = formData.get("rewriteAgent") === "true"
  const chatAgent = formData.get("chatAgent") === "true"

  try {
    const settings = await prisma.siteSettings.findFirst()
    
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          logoUrl,
          maintenanceMode,
          draftAgent,
          rewriteAgent,
          chatAgent
        }
      })
    } else {
      await prisma.siteSettings.create({
        data: {
          siteName,
          logoUrl,
          maintenanceMode,
          draftAgent,
          rewriteAgent,
          chatAgent
        }
      })
    }
    
    revalidatePath("/dashboard/admin/settings")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update settings" }
  }
}
