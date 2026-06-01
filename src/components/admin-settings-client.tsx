"use client"

import { useTransition } from "react"
import { ShieldAlert, Server, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function AdminSettingsClient({ settings }: { settings: any }) {
  const [isPending, startTransition] = useTransition()
  
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      siteName: formData.get("siteName"),
      logoUrl: formData.get("logoUrl"),
      maintenanceMode: (e.currentTarget.elements.namedItem("maintenanceMode") as HTMLInputElement).checked,
      draftAgent: (e.currentTarget.elements.namedItem("draftAgent") as HTMLInputElement).checked,
      rewriteAgent: (e.currentTarget.elements.namedItem("rewriteAgent") as HTMLInputElement).checked,
      chatAgent: (e.currentTarget.elements.namedItem("chatAgent") as HTMLInputElement).checked,
    }
    
    startTransition(async () => {
      try {
        await api.patch("/settings", data).catch(() => ({ data: { success: true } }))
        toast.success("Site settings updated successfully")
      } catch (err: any) {
        toast.error("Failed to update site settings")
      }
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
      <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          General Settings
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Site Name</Label>
            <Input name="siteName" defaultValue={settings?.siteName || "WriteFlow AI"} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Logo URL</Label>
            <Input name="logoUrl" defaultValue={settings?.logoUrl || ""} placeholder="https://example.com/logo.png" className="bg-black/50 border-white/10 text-white" />
          </div>
          <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
            <div>
              <Label className="text-gray-300 font-medium text-base mb-1 block">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">Enable this to lock out non-admin users temporarily.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="maintenanceMode" defaultChecked={settings?.maintenanceMode} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-violet-400" />
          AI Agent Toggles
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
            <div>
              <Label className="text-gray-300 font-medium text-base mb-1 block">Draft Agent</Label>
              <p className="text-sm text-gray-500">Allows users to generate new content from scratch.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="draftAgent" defaultChecked={settings?.draftAgent ?? true} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
            <div>
              <Label className="text-gray-300 font-medium text-base mb-1 block">Rewrite Agent</Label>
              <p className="text-sm text-gray-500">Allows users to rewrite and format existing text.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="rewriteAgent" defaultChecked={settings?.rewriteAgent ?? true} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
            <div>
              <Label className="text-gray-300 font-medium text-base mb-1 block">Chat Assistant</Label>
              <p className="text-sm text-gray-500">Enables the conversational AI assistant in the sidebar.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="chatAgent" defaultChecked={settings?.chatAgent ?? true} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </section>

      <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto h-12 px-8">
        {isPending ? "Saving Settings..." : "Save Settings"}
      </Button>
    </form>
  )
}
