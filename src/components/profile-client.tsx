"use client"

import { useState, useTransition } from "react"
import { User, CreditCard, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/app/dashboard/profile/actions"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    
    startTransition(async () => {
      const res = await updateProfile(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Profile updated successfully!")
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
                <AvatarImage src={user?.image || ""} />
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

      {/* Subscription & Stats */}
      <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Subscription & Usage
          </h2>
          <span className="px-3 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            {user?.plan || "FREE"} Plan
          </span>
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
