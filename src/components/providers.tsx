"use client"

import { ThemeProvider } from "next-themes"
import { MaintenanceGuard } from "./maintenance-guard"
import { AuthProvider } from "./auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
        <MaintenanceGuard>
          {children}
        </MaintenanceGuard>
      </ThemeProvider>
    </AuthProvider>
  )
}

