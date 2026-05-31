"use client"

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
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

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setMaintenanceMode(data.maintenanceMode || false)
      })
      .catch((err) => {
        console.error("Error fetching settings:", err)
        setMaintenanceMode(false)
      })
  }, [pathname])

  useEffect(() => {
    if (maintenanceMode === null || status === "loading") return

    const isAdmin = session?.user?.role === "admin"
    const isLoginPage = pathname === "/login"
    const isMaintenancePage = pathname === "/maintenance"

    if (maintenanceMode && !isAdmin && !isLoginPage && !isMaintenancePage) {
      router.push("/maintenance")
    } else if ((!maintenanceMode || isAdmin) && isMaintenancePage) {
      router.push("/")
    }
  }, [maintenanceMode, session, status, pathname, router])

  const isAdmin = session?.user?.role === "admin"
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
