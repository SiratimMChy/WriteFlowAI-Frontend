"use client"

import { useAuth } from "@/components/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null)

  useEffect(() => {
    // Exclude API routes and static Next.js assets
    if (
      pathname?.startsWith("/api") ||
      pathname?.startsWith("/_next") ||
      pathname?.startsWith("/static") ||
      pathname === "/favicon.ico"
    ) {
      return
    }

    // Default to false or fetch from settings endpoint if supported
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Settings not available")
        return res.json()
      })
      .then((data) => {
        // Support both nested data.data.maintenanceMode (Express standard) and flat data.maintenanceMode
        const mode = data.data !== undefined ? data.data.maintenanceMode : data.maintenanceMode;
        setMaintenanceMode(mode || false)
      })
      .catch((err) => {
        console.error("Error fetching settings:", err)
        setMaintenanceMode(false)
      })
  }, [pathname])

  useEffect(() => {
    if (maintenanceMode === null) return

    const isAdmin = user?.role === "admin" || user?.role === "ADMIN"
    const isLoginPage = pathname === "/login"
    const isMaintenancePage = pathname === "/maintenance"

    if (maintenanceMode && !isAdmin && !isLoginPage && !isMaintenancePage) {
      router.push("/maintenance")
    } else if ((!maintenanceMode || isAdmin) && isMaintenancePage) {
      router.push("/")
    }
  }, [maintenanceMode, user, pathname, router])

  const isAdmin = user?.role === "admin" || user?.role === "ADMIN"
  const isLoginPage = pathname === "/login"
  const isMaintenancePage = pathname === "/maintenance"
  const isExcluded =
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/_next") ||
    pathname?.startsWith("/static") ||
    pathname === "/favicon.ico"

  // Block rendering of normal site content if maintenance mode is active for non-admins
  if (maintenanceMode && !isAdmin && !isLoginPage && !isMaintenancePage && !isExcluded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
