"use client"

import { useState, useTransition } from "react"
import { User, CreditCard, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/avatar"

export function ProfileClient({ 
  user, 
  stats 
}: { 
  user: any
  stats: { docsCount: number, wordsCount: number } 
}) {
  const [isPending, startTransition] = useTransition()
  
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      image: formData.get("avatarUrl"),
      bio: formData.get("bio")
    }
    
    startTransition(async () => {
      try {
        const res = await api.patch(`/users/${user.id}`, data)
        if (res.data.success) {
          toast.success("Profile updated successfully!")
          // Sync updated profile details to localStorage user session object
          try {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
              const parsed = JSON.parse(storedUser)
              parsed.name = res.data.data.name || parsed.name
              parsed.image = res.data.data.image || parsed.image
              localStorage.setItem("user", JSON.stringify(parsed))
            }
          } catch (e) {
            console.error("Failed to sync profile update to local storage user", e)
          }
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          toast.error(res.data.message || "Failed to update profile")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update profile")
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-violet-400" />
          Personal Information
        </h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 border border-white/10 text-xl">
                <AvatarImage src={getAvatarUrl(user?.email, user?.image)} />
                <AvatarFallback className="bg-violet-900">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Avatar URL</Label>
                <Input name="avatarUrl" defaultValue={user?.image || ""} placeholder="https://example.com/avatar.jpg" className="bg-black/50 border-white/10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input name="name" defaultValue={user?.name || ""} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email Address</Label>
              <Input defaultValue={user?.email || ""} disabled className="bg-black/30 border-white/5 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Bio</Label>
            <Textarea name="bio" defaultValue={user?.bio || ""} placeholder="Tell us about yourself..." className="bg-black/50 border-white/10 text-white min-h-[100px]" />
          </div>
          
          <Button type="submit" disabled={isPending} className="bg-violet-600 hover:bg-violet-700 text-white">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </section>

      {/* Subscription & Usage Stats */}
      <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Subscription & Usage
          </h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              {user?.plan || "FREE"} Plan
            </span>
            {user?.plan && user.plan !== "free" && (
              <a href="/api/billing" className="text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition-colors">
                Manage Billing
              </a>
            )}
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 bg-black/50 rounded-xl border border-white/5 flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-1">Documents Created</p>
            <p className="text-3xl font-bold">{stats.docsCount}</p>
          </div>
          <div className="p-5 bg-black/50 rounded-xl border border-white/5 flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-1">Total Words Generated</p>
            <p className="text-3xl font-bold">{stats.wordsCount.toLocaleString()}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
