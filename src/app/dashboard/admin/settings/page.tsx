import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { AdminSettingsClient } from "@/components/admin-settings-client"
import { ShieldAlert } from "lucide-react"

const prisma = new PrismaClient()

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  let settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        siteName: "WriteFlow AI",
        maintenanceMode: false
      }
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-blue-500" />
          Site Settings
        </h1>
        <p className="text-gray-400 mt-1">Configure global platform settings and agent availability.</p>
      </div>

      <AdminSettingsClient settings={settings} />
    </div>
  )
}
