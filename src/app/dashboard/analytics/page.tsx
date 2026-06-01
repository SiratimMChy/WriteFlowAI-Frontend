"use client"

import { PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground mb-8">
          View your content generation usage and engagement metrics.
        </p>

        <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
          <PieChart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We are working on powerful new insights to help you track your generated content performance. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}
