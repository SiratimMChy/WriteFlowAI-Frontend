"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Wand2, Construction, ShieldAlert, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  const [siteName, setSiteName] = useState("WriteFlow")

  useEffect(() => {
    fetch(`/api/settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Settings not available")
        return res.json()
      })
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName)
      })
      .catch((err) => console.warn("Maintenance settings fetch skipped: ", err.message))
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-[#050505] to-[#050505] pointer-events-none z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-center lg:justify-start">
        <div className="flex items-center gap-2">
          <Wand2 className="w-8 h-8 text-violet-500 animate-pulse" />
          <span className="text-2xl font-bold tracking-tight">{siteName}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center justify-center my-auto space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-xl">
            <Construction className="w-12 h-12 text-violet-400" />
          </div>
        </div>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" /> Maintenance Mode
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter leading-none">
            We'll Be Right Back
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-md mx-auto">
            {siteName} is currently undergoing scheduled systems maintenance to upgrade our AI agents and improve performance.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="h-12 border-white/10 text-gray-300 hover:text-white rounded-xl bg-white/[0.02]">
              Admin Login Bypass
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} {siteName} AI. All rights reserved.
      </footer>
    </div>
  )
}
