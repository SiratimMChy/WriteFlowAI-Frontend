"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowRight, CheckCircle2, Zap, PenTool, MessageSquare, Plus, ChevronDown, Mail, LayoutTemplate, Rocket, Bot, Wand2, RefreshCw, Star, Users, Activity } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { TemplateCard, TemplateCardSkeleton } from "@/components/template-card"
import { useSession } from "next-auth/react"
function AnimatedCounter({ targetValue, suffix = "", decimals = 0 }: { targetValue: number, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const currentRef = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 2000 // 2 seconds
    const startTime = Date.now()

    const timer = setInterval(() => {
      const timePassed = Date.now() - startTime
      const progress = Math.min(timePassed / duration, 1)
      const easeProgress = progress * (2 - progress)
      const nextValue = easeProgress * targetValue
      
      if (progress >= 1) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(nextValue)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [hasStarted, targetValue])

  const formatted = count.toFixed(decimals)

  return (
    <span ref={elementRef}>
      {decimals === 0 ? parseInt(formatted).toLocaleString() : parseFloat(formatted).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

export default function LandingPage() {
  const { status } = useSession()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTemplateCategory, setActiveTemplateCategory] = useState("All")
  
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)

  const [publicStats, setPublicStats] = useState({
    totalUsers: 10000,
    totalTemplates: 50,
    wordsGenerated: 500000,
    uptimeGuarantee: 99.9,
  })

  const [fakeInput, setFakeInput] = useState("")
  const [fakeOutput, setFakeOutput] = useState("")
  const [fakeStep, setFakeStep] = useState(0) // 0: typing prompt, 1: generating state, 2: typing response, 3: completed

  useEffect(() => {
    let timer: any
    const promptText = "Create a catchy social media post introducing WriteFlow AI."
    const responseText = "🚀 Say hello to WriteFlow AI — your new content powerhouse!\n\nStruggling to write blogs, ads, or emails that convert? Let our tailored AI writing agents do the heavy lifting for you.\n\n✨ Adjust tone & brand voice\n✨ Rewrite & expand copies instantly\n✨ Maintain team workspaces\n\nStart writing for free today! ✍️"

    let promptIndex = 0
    let responseIndex = 0

    const runLoop = () => {
      setFakeStep(0)
      setFakeInput("")
      setFakeOutput("")
      promptIndex = 0
      responseIndex = 0

      const typePrompt = () => {
        if (promptIndex < promptText.length) {
          setFakeInput((prev) => prev + promptText.charAt(promptIndex))
          promptIndex++
          timer = setTimeout(typePrompt, 30)
        } else {
          setFakeStep(1)
          timer = setTimeout(typeResponse, 1200)
        }
      }

      const typeResponse = () => {
        setFakeStep(2)
        if (responseIndex < responseText.length) {
          setFakeOutput((prev) => prev + responseText.charAt(responseIndex))
          responseIndex++
          timer = setTimeout(typeResponse, 12)
        } else {
          setFakeStep(3)
          timer = setTimeout(runLoop, 6000)
        }
      }

      typePrompt()
    }

    timer = setTimeout(runLoop, 1500)
    return () => clearTimeout(timer)
  }, [])

  const fallbackTemplates = [
    { id: "seo-long-form", category: "Blog", title: "SEO Long-form Post", usageCount: 12500, rating: 4.9, thumbnail: null, description: "Generate structured, SEO-optimized blog posts complete with headers, keywords, and intro." },
    { id: "viral-twitter", category: "Social Media", title: "Viral Twitter Thread", usageCount: 8200, rating: 4.8, thumbnail: null, description: "Create highly engaging Twitter/X threads that drive clicks, retweets, and followers." },
    { id: "cold-outreach", category: "Email", title: "Cold Outreach Sequence", usageCount: 15000, rating: 4.7, thumbnail: null, description: "Write professional email sequences that get high response rates and conversions." },
    { id: "insta-caption", category: "Social Media", title: "Instagram Caption Maker", usageCount: 10400, rating: 4.8, thumbnail: null, description: "Generate witty, engaging Instagram captions with targeted hashtags." },
  ]

  useEffect(() => {
    setIsLoadingTemplates(true)
    fetch(`/api/items?limit=4&sort=popular`)
      .then((res) => {
        if (!res.ok) throw new Error("API failed")
        return res.json()
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setTemplates(data.data)
        } else {
          setTemplates(fallbackTemplates)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch templates, using fallback", err)
        setTemplates(fallbackTemplates)
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoadingTemplates(false)
        }, 800)
      })
  }, [])

  // Fetch public platform stats
  useEffect(() => {
    fetch(`/api/dashboard/public-stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data) => {
        if (data?.success && data?.data) {
          const d = data.data
          setPublicStats({
            totalUsers: d.totalUsers ?? 10000,
            totalTemplates: d.totalTemplates ?? 50,
            wordsGenerated: d.wordsGenerated ?? 500000,
            uptimeGuarantee: d.uptimeGuarantee ?? 99.9,
          })
        }
      })
      .catch(() => {
        // Silently fall back to default values
      })
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setEmail("")
      toast.success("Thanks for subscribing! Check your inbox soon.")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[120vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#050505] to-[#050505]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="w-full min-h-[65vh] px-6 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-32 flex flex-col items-center justify-center text-center" style={{ minHeight: "65vh" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Announcement badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="group inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#111] border border-white/10 text-sm text-gray-300 mb-8 cursor-pointer hover:bg-white/5 hover:border-violet-500/50 transition-all shadow-xl shadow-black/50 mx-auto"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
              </span>
              <span className="font-medium">WriteFlow AI 2.0 is live</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-extrabold tracking-tighter mb-6 leading-[1.1] max-w-5xl mx-auto"
            >
              The AI Workspace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-500 pb-2">
                Limitless Creation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-5xl mx-auto mb-10 leading-relaxed font-light"
            >
              Generate, refine, and organize your highest-performing content. Experience the next generation of AI-assisted writing engineered for professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto mx-auto"
            >
              {status === "authenticated" ? (
                <Link href="/dashboard" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <Button size="lg" className="relative w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 border-0">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <Button size="lg" className="relative w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 border-0">
                    Start Writing Free
                    <Sparkles className="ml-2 w-5 h-5 text-white/80 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
              )}
              <Link href="/explore" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 rounded-full font-medium transition-all">
                  Explore Templates
                </Button>
              </Link>
            </motion.div>

            {/* Premium Floating Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1, type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-5xl mx-auto hidden md:block"
            >
              <div className="absolute -inset-1 bg-gradient-to-t from-violet-900/50 via-transparent to-transparent blur-3xl" />
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="relative rounded-3xl border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
              >
                {/* MacOS style header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/5 text-xs text-gray-400 font-mono">
                    <Wand2 className="w-3 h-3 text-violet-400" />
                    app.writeflow.ai/draft
                  </div>
                  <div className="w-16" /> {/* Spacer for balance */}
                </div>
                
                {/* Fake Dashboard Content */}
                <div className="grid grid-cols-12 h-[400px]">
                  {/* Fake Sidebar */}
                  <div className="col-span-3 border-r border-white/5 bg-[#0a0a0c]/60 p-4 flex flex-col justify-between select-none">
                    <div className="space-y-4 font-sans">
                      {/* Brand Title / Header */}
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <Wand2 className="w-4 h-4 text-violet-400" />
                        <span className="text-xs font-bold text-white tracking-wider">WriteFlow AI</span>
                      </div>
                      
                      {/* Sidebar Tabs */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[10px] font-medium text-gray-500 hover:text-gray-300">
                          <LayoutTemplate className="w-3.5 h-3.5" />
                          Overview
                        </div>
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[10px] font-medium text-violet-400 bg-violet-500/10 border-l-2 border-violet-500">
                          <Wand2 className="w-3.5 h-3.5" />
                          Draft Agent
                        </div>
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[10px] font-medium text-gray-500 hover:text-gray-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Rewrite Agent
                        </div>
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[10px] font-medium text-gray-500 hover:text-gray-300">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat Assistant
                        </div>
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[10px] font-medium text-gray-500 hover:text-gray-300">
                          <Rocket className="w-3.5 h-3.5" />
                          AI History
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-2 py-1 border-t border-white/5 pt-3 font-sans">
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold">U</div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-medium text-white truncate">Demo Creator</span>
                        <span className="text-[8px] text-gray-500 truncate">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fake Editor */}
                  <div className="col-span-9 p-6 flex flex-col relative overflow-hidden bg-black/40">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-full pointer-events-none" />
                    
                    {/* Fake Editor Tabs Bar */}
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 font-sans">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md text-white">
                          📄 intro_post_draft.md
                        </span>
                      </div>
                      
                      {/* Generation Status Badge */}
                      <div className="flex items-center gap-2">
                        {fakeStep === 0 && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Typing Prompt...
                          </span>
                        )}
                        {fakeStep === 1 && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            Thinking...
                          </span>
                        )}
                        {fakeStep === 2 && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                            Writing draft...
                          </span>
                        )}
                        {fakeStep === 3 && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Prompt Box */}
                    <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] space-y-1 font-sans">
                      <div className="flex items-center justify-between text-[9px] text-gray-500">
                        <span>PROMPT</span>
                        <span>DRAFT AGENT</span>
                      </div>
                      <div className="text-gray-300 font-mono">
                        {fakeInput}
                        {fakeStep === 0 && <span className="animate-pulse">|</span>}
                      </div>
                    </div>

                    {/* Output Rich Text View */}
                    <div className="flex-1 p-4 rounded-xl bg-[#030303]/60 border border-white/5 overflow-y-auto font-mono text-[11px] text-gray-400 leading-relaxed min-h-0 select-none">
                      {fakeStep === 1 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-600">
                          <Bot className="w-8 h-8 text-violet-500/40 animate-bounce" />
                          <span className="text-[10px] animate-pulse">Formulating creative copy...</span>
                        </div>
                      ) : fakeOutput ? (
                        <div className="whitespace-pre-wrap text-left text-gray-300">
                          {fakeOutput}
                          {fakeStep === 2 && <span className="animate-ping text-violet-400">█</span>}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-600 text-[10px]">
                          Waiting for prompt input...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Agents designed specifically for different content workflows.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="AI Drafting"
              description="Generate high-converting blog posts, emails, and ad copy in seconds using proven frameworks."
            />
            <FeatureCard 
              icon={<PenTool className="w-6 h-6 text-violet-400" />}
              title="Tone Rewriting"
              description="Adjust the tone, expand, summarize, or completely rewrite existing text to match your brand voice."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
              title="Team Collaboration"
              description="Work together with your team, share templates, and maintain a consistent brand voice across all users."
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0c] to-[#050505] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-20">
              <span className="text-violet-400 font-bold tracking-wider uppercase text-sm mb-4 block">Workflow</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">How WriteFlow Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Four intelligent steps to perfect content. Zero friction.</p>
            </div>
            
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Select Template", desc: "Choose from 50+ optimized presets.", icon: LayoutTemplate, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-500/20" },
                  { step: "2", title: "Define Context", desc: "Provide a brief prompt or keywords.", icon: MessageSquare, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10", border: "border-fuchsia-500/20" },
                  { step: "3", title: "AI Generation", desc: "Watch the AI craft your content instantly.", icon: Bot, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20" },
                  { step: "4", title: "Refine & Export", desc: "Polish in the editor and deploy.", icon: Rocket, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    className="relative group h-full"
                  >
                    <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl text-center hover:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative z-10 h-full flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.border} border flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white group-hover:bg-violet-600 transition-colors shadow-lg">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Templates Section */}
        <section className="relative py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-12 gap-8">
              <div>
                <span className="text-fuchsia-400 font-bold tracking-wider uppercase text-sm mb-4 block">Templates</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Start Instantly</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">Our most loved AI frameworks, ready to deploy. Optimized for high conversion and engagement.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                {["All", "Blog", "Social", "Email"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveTemplateCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTemplateCategory === cat ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingTemplates ? (
                Array(4).fill(0).map((_, i) => <TemplateCardSkeleton key={i} />)
              ) : (
                <AnimatePresence mode="popLayout">
                  {templates
                    .filter(t => activeTemplateCategory === "All" || t.category.toLowerCase().includes(activeTemplateCategory.toLowerCase()))
                    .map((t) => (
                      <motion.div 
                        key={t.id || t.title}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <TemplateCard template={t} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { target: publicStats.totalUsers || 10000, suffix: "+", decimals: 0, label: "Active Users", icon: Users, color: "text-violet-400", border: "hover:border-violet-500/50" },
                { target: publicStats.wordsGenerated || 500000, suffix: "+", decimals: 0, label: "Words Generated", icon: PenTool, color: "text-fuchsia-400", border: "hover:border-fuchsia-500/50" },
                { target: publicStats.totalTemplates || 50, suffix: "+", decimals: 0, label: "AI Templates", icon: LayoutTemplate, color: "text-blue-400", border: "hover:border-blue-500/50" },
                { target: publicStats.uptimeGuarantee || 99.9, suffix: "%", decimals: 1, label: "Uptime Guarantee", icon: Activity, color: "text-emerald-400", border: "hover:border-emerald-500/50" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group bg-white/[0.02] backdrop-blur-md border border-white/5 p-8 rounded-3xl text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.04] ${stat.border}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                    <AnimatedCounter targetValue={stat.target} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <div className="text-gray-400 font-medium uppercase tracking-wider text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        {/* Testimonials */}
        <section className="bg-white/[0.01] border-y border-white/5 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">Loved by creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { name: "Sarah Jenkins", role: "Content Marketer", review: "WriteFlow completely changed how our team produces content. We went from publishing 2 blogs a week to 10, without dropping quality." },
                { name: "David Chen", role: "Indie Hacker", review: "The SEO blog generator is literal magic. It writes exactly in my tone of voice and perfectly optimizes for my target keywords." },
                { name: "Elena Rossi", role: "Social Media Manager", review: "I manage 5 different brands. The tone rewriting tool saves me hours every single day. Highly recommended for any agency." },
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 shadow-xl">
                  <div className="flex text-yellow-400 text-sm mb-4">★★★★★</div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarFallback className="bg-violet-900 text-white text-xs">{t.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Does the AI plagiarize?", a: "No, WriteFlow AI generates unique, original content on the fly based on the massive datasets it was trained on." },
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
                <button 
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-medium hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter & CTA Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 mb-16 text-center">
          <div className="p-8 sm:p-16 rounded-3xl bg-gradient-to-b from-violet-900/20 to-[#050505] border border-violet-500/20 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay ahead of the curve</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">Subscribe to our newsletter for the latest AI writing tips, prompts, and WriteFlow updates.</p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-12">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-black/50 border-white/20 h-12 rounded-full px-6 focus-visible:ring-violet-500" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-8 bg-white text-black hover:bg-gray-200 rounded-full font-medium">
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12" />

            <h3 className="text-2xl font-bold mb-6">Ready to transform your workflow?</h3>
            {status === "authenticated" ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 bg-violet-600 text-white hover:bg-violet-700 text-lg rounded-full shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 bg-violet-600 text-white hover:bg-violet-700 text-lg rounded-full shadow-lg">
                  Start Writing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none scale-150 transform translate-x-4 -translate-y-4">
        {icon}
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6 border border-white/10 relative z-10 text-violet-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 relative z-10">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm sm:text-base relative z-10">
        {description}
      </p>
    </div>
  )
}