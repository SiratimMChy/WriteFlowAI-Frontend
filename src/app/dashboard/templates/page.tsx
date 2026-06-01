"use client"

import { FileText, FolderHeart } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Templates</h1>
        <p className="text-muted-foreground mb-8">
          Browse and manage your AI writing templates.
        </p>

        <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
          <FolderHeart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Templates Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We are working hard to bring you a vast library of highly optimized templates. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}
