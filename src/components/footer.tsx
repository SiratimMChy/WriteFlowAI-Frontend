"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Wand2, Globe, MessageSquare, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const [siteName, setSiteName] = useState("WriteFlow")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Successfully subscribed to our newsletter!")
      setEmail("")
    } catch (err) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Settings not available")
        return res.json()
      })
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName)
      })
      .catch((err) => console.warn("Footer settings fetch skipped: ", err.message))
  }, [])

  return (
    <footer className="relative border-t border-white/5 bg-[#050505] overflow-hidden pt-24 pb-12 mt-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{siteName} AI</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
              The ultimate AI writing workspace. Generate, refine, and organize your highest-performing content at lightspeed.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/explore" className="hover:text-violet-400 transition-colors">Explore Templates</Link></li>
              <li><Link href="/#features" className="hover:text-violet-400 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-violet-400 transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-violet-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest AI writing tips and product updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your email" 
                className="pl-10 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500/50 focus:ring-violet-500/20"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {siteName} AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Designed with</span>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span>for creators.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
