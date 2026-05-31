"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { MaintenanceGuard } from "./maintenance-guard"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <MaintenanceGuard>
          {children}
        </MaintenanceGuard>
      </ThemeProvider>
    </SessionProvider>
  )
}

