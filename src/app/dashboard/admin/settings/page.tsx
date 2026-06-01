"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { AdminSettingsClient } from "@/components/admin-settings-client"
import { ShieldAlert } from "lucide-react"

const defaultSettings = {
  siteName: "WriteFlow AI",
  logoUrl: null,
  maintenanceMode: false,
  draftAgent: true,
  rewriteAgent: true,
  chatAgent: true,
}

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<any>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    // Settings are managed directly in the client component
    // No dedicated endpoint yet — use defaults
    setLoading(false)
  }, [user, router])

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse h-8 bg-white/5 rounded w-1/3 mb-4" />
      </div>
    )
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
