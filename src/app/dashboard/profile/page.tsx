import { User, Mail, CreditCard, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-violet-400" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <Input defaultValue="Creator" className="bg-black border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email Address</Label>
                <Input defaultValue="user@writeflow.com" disabled className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">Save Changes</Button>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Subscription
            </h2>
            <span className="px-3 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              Pro Plan
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-black rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Usage</p>
                <p className="text-lg font-bold">24,592 / 50,000 words</p>
              </div>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[49%]"></div>
              </div>
            </div>
            <Button variant="outline" className="border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]">Manage Subscription</Button>
          </div>
        </section>

        {/* API Settings */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            API Keys
          </h2>
          <p className="text-sm text-gray-400 mb-4">Connect WriteFlow to your own applications using API keys.</p>
          <Button variant="outline" className="border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]">Generate New Key</Button>
        </section>
      </div>
    </div>
  )
}
