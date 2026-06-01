"use client"

import { HelpCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground mb-8">
          Need assistance? We're here to help you get the most out of WriteFlow AI.
        </p>

        <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
          <HelpCircle className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Support Center Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We are currently building our comprehensive help center. In the meantime, please contact us at support@writeflow.ai for any inquiries.
          </p>
        </div>
      </div>
    </div>
  )
}
