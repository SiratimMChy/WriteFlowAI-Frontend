"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle2, Zap, LayoutTemplate, PenTool, MessageSquare, Menu } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-violet-500/30">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            <span className="text-xl font-bold tracking-tight">WriteFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-violet-300 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>WriteFlow AI 2.0 is now available</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
              Create content that <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                converts effortlessly
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              The all-in-one AI platform for content creators, marketers, and businesses. Generate, rewrite, and optimize content 10x faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 bg-violet-600 hover:bg-violet-700 text-lg rounded-full">
                  Start creating for free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 text-lg rounded-full">
                View Templates
              </Button>
            </div>
            
            <div className="mt-16 text-sm text-gray-500 flex items-center gap-4">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> No credit card required</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 14-day free trial</span>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to write better</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Powerful AI agents designed specifically for different content workflows.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Content Generation"
              description="Generate high-converting blog posts, emails, and ad copy in seconds using proven frameworks."
            />
            <FeatureCard 
              icon={<PenTool className="w-6 h-6 text-violet-400" />}
              title="Smart Rewriter"
              description="Adjust the tone, expand, summarize, or completely rewrite existing text to match your brand voice."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
              title="AI Chat Assistant"
              description="Brainstorm ideas, research topics, and outline content with a conversational AI agent."
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white/5 border-y border-white/10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10M+</div>
                <div className="text-gray-400">Words Generated</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50k+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-gray-400">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">99%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Choose the perfect plan for your content needs. No hidden fees.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">Perfect for individuals just getting started with AI.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>10,000 words per month</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Standard support</span>
                </li>
              </ul>
              
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full h-12">
                  Start Free
                </Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-violet-900/20 to-black border border-violet-500/50 relative shadow-[0_0_40px_rgba(139,92,246,0.1)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">For professional creators needing high-volume output.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Unlimited words</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>All premium templates</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Custom brand voices</span>
                </li>
              </ul>
              
              <Link href="/login">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12">
                  Get Pro
                </Button>
              </Link>
            </div>
            
            {/* Team Plan */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:col-span-2 lg:col-span-1 md:w-1/2 lg:w-full md:mx-auto lg:mx-0">
              <h3 className="text-xl font-bold mb-2">Team</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">For teams and agencies managing multiple brands.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                  <span>API access</span>
                </li>
              </ul>
              
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full h-12">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-violet-900/20 to-black border border-violet-500/20 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl text-gray-400 mb-8">Join thousands of creators who are already using WriteFlow AI.</p>
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-gray-200 text-lg rounded-full">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <span className="font-bold">WriteFlow AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} WriteFlow AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
