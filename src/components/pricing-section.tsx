"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function PricingSection() {
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async (plan: "pro" | "team") => {
    if (status !== "authenticated") {
      toast.error("Authentication required", {
        description: "Please log in or create a free account to upgrade your plan.",
        action: {
          label: "Log In",
          onClick: () => router.push("/login"),
        },
      })
      return
    }

    setIsLoading(plan)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please log in to upgrade your plan.")
          router.push("/login")
          return
        }
        throw new Error(data.error || "Failed to initialize checkout.")
      }
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "An error occurred during checkout.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-violet-300 mb-6 shadow-xl backdrop-blur-md">
          <Zap className="w-4 h-4" /> Transparent Pricing
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">content creation</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Choose the perfect plan for your needs. Upgrade anytime as your workflow demands grow.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 items-center">
        
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col backdrop-blur-xl h-full shadow-2xl"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Free</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-gray-400 font-medium">/month</span>
          </div>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">Perfect for individuals just getting started with AI.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" /><span>10,000 words per month</span></li>
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" /><span>Basic templates</span></li>
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" /><span>Standard support</span></li>
          </ul>
          <Button onClick={() => router.push("/register")} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl h-12 transition-all">
            Start for Free
          </Button>
        </motion.div>
        
        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1.05 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-b from-violet-900/40 to-black/80 border border-violet-500/50 relative shadow-[0_0_50px_rgba(139,92,246,0.2)] flex flex-col z-20 backdrop-blur-xl h-[105%]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-5 rounded-full shadow-lg">
            Most Popular
          </div>
          <h3 className="text-xl font-bold mb-2 text-violet-300 mt-2">Pro</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-extrabold text-white">$29</span>
            <span className="text-violet-200/60 font-medium">/month</span>
          </div>
          <p className="text-violet-200/80 mb-8 text-sm leading-relaxed">For professional creators needing high-volume output.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" /><span>Unlimited AI Generation</span></li>
            <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" /><span>Access to all premium agents</span></li>
            <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" /><span>Priority API routing</span></li>
            <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" /><span>Custom Tone matching</span></li>
          </ul>
          <Button 
            onClick={() => handleCheckout("pro")} 
            disabled={isLoading === "pro"}
            className="w-full bg-white hover:bg-gray-100 text-violet-900 rounded-xl h-12 font-bold shadow-xl transition-all"
          >
            {isLoading === "pro" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade to Pro"}
          </Button>
        </motion.div>
        
        {/* Team Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col backdrop-blur-xl h-full shadow-2xl"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Team</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold text-white">$99</span>
            <span className="text-gray-400 font-medium">/month</span>
          </div>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">For teams and agencies managing multiple brands.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /><span>Everything in Pro</span></li>
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /><span>Up to 5 team members</span></li>
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /><span>Shared workspaces</span></li>
            <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /><span>Dedicated account manager</span></li>
          </ul>
          <Button 
            onClick={() => handleCheckout("team")}
            disabled={isLoading === "team"} 
            className="w-full bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-xl h-12 transition-all font-semibold"
          >
            {isLoading === "team" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade to Team"}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
