"use client"

import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and application settings.
        </p>

        <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
          <Settings className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Settings Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We are building a comprehensive settings dashboard to give you full control over your WriteFlow experience. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}
