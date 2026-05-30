"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Cpu, 
  Shield, 
  Heart, 
  ArrowRight, 
  Clock, 
  Coins, 
  FileText, 
  CheckCircle2,
  Code2,
  Rocket,
  Wand2,
  Globe,
  Zap,
  Users
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 sm:pt-40 pb-20 sm:pb-32">
        {/* HERO SECTION - Ultra Modern */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mb-20 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-gray-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Who We Are
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05] max-w-5xl mx-auto">
              Designing the future of <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-blue-600 blur-2xl opacity-40"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-200">
                  human creativity.
                </span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              We're a collective of engineers, designers, and writers building the intelligence layer for the modern creative workspace.
            </p>
          </motion.div>
        </section>

        {/* BENTO GRID SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
            
            {/* The Mission - Large Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 p-8 sm:p-10 relative overflow-hidden group hover:border-violet-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-violet-500/30 transition-colors duration-700" />
              <div className="relative z-10 h-full flex flex-col">
                <Sparkles className="w-8 h-8 text-violet-400 mb-6" />
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  WriteFlow AI was founded to eliminate the friction between thought and expression. We believe that artificial intelligence shouldn't replace the writer, but rather serve as a powerful exoskeleton that amplifies human capability.
                </p>
                <div className="mt-auto">
                  <div className="inline-flex items-center gap-2 text-violet-400 font-semibold group-hover:gap-4 transition-all">
                    Read our manifesto <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metric 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-colors flex flex-col justify-between"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <Users className="w-6 h-6 text-blue-400 mb-4" />
                <div className="text-4xl font-extrabold text-white mb-2">50,000+</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Creators</div>
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-colors flex flex-col justify-between"
            >
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuchsia-500/20 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <Globe className="w-6 h-6 text-fuchsia-400 mb-4" />
                <div className="text-4xl font-extrabold text-white mb-2">120+</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Countries Reached</div>
              </div>
            </motion.div>

            {/* Values Map - Wide Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-3 lg:col-span-2 rounded-3xl bg-[#0c0c0e] border border-white/10 p-8 relative overflow-hidden group"
            >
              {/* Decorative grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative z-10 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6">Core Tenets</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Shield className="w-4 h-4" /></div>
                    <div>
                      <div className="font-bold text-sm">Privacy First</div>
                      <div className="text-xs text-gray-400 mt-1">Zero data training without consent.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Zap className="w-4 h-4" /></div>
                    <div>
                      <div className="font-bold text-sm">Velocity</div>
                      <div className="text-xs text-gray-400 mt-1">Ship fast, learn faster.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400"><Heart className="w-4 h-4" /></div>
                    <div>
                      <div className="font-bold text-sm">Human Centric</div>
                      <div className="text-xs text-gray-400 mt-1">Amplify, don't replace.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Cpu className="w-4 h-4" /></div>
                    <div>
                      <div className="font-bold text-sm">State of the Art</div>
                      <div className="text-xs text-gray-400 mt-1">Always cutting-edge LLMs.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* TIMELINE - Vertical aesthetic */}
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The Story So Far</h2>
          </div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:-translate-x-1/2" />

            {[
              { year: "2024", title: "The Prototype", desc: "Started as a weekend hackathon project by three friends frustrated with writer's block.", side: "left" },
              { year: "2025", title: "Seed Round & V1", desc: "Raised $2M seed. Launched WriteFlow 1.0 to 15,000 early access users.", side: "right" },
              { year: "2026", title: "The Expansion", desc: "Hit 50k users. Released WriteFlow 2.0 with custom agentic workflows.", side: "left" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-20 ${item.side === 'right' ? 'sm:flex-row-reverse' : ''}`}
              >
                <div className={`w-full sm:w-[45%] pl-12 sm:pl-0 ${item.side === 'left' ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'}`}>
                  <div className="text-violet-400 font-mono text-sm font-bold mb-2">{item.year}</div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
                
                {/* Node */}
                <div className="absolute left-0 sm:left-1/2 w-8 h-8 rounded-full bg-[#050505] border-2 border-violet-500 flex items-center justify-center sm:-translate-x-1/2 mt-1 sm:mt-0 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>

                <div className="hidden sm:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-32">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Meet the Architects</h2>
            <p className="text-gray-400 text-lg">The minds behind the machine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Siratim Mustakim", role: "CEO & Founder", img: "/team/ceo_siratim.png" },
              { name: "Ruhit Dhar Raz", role: "CTO & Co-founder", img: "/team/cto_ruhit.png" },
              { name: "Md. Rahim", role: "Head of AI", img: "/team/ai_rahim.png" },
              { name: "Abdur Rab", role: "Lead Designer", img: "/team/designer_abdur.png" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-white/[0.02] border border-white/5 shadow-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:border-violet-500/30 transition-all duration-500"
              >
                {/* Fallback pattern if image doesn't load/is slow, and nice overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 opacity-90 transition-opacity duration-500" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-lg">{member.name}</h4>
                  <p className="text-violet-400 text-sm sm:text-base font-semibold drop-shadow-md">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-10 sm:p-16 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.1)] relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Build with us.
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Join our growing community and help us shape the future of human-AI collaboration.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <Button size="lg" className="relative w-full sm:w-auto h-14 px-8 bg-black text-white border border-white/10 hover:bg-black/50 text-base font-bold rounded-full transition-all duration-300">
                    Join the waitlist
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/careers" className="w-full sm:w-auto">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto h-14 px-8 text-gray-300 hover:text-white rounded-full font-medium transition-all">
                    View Open Roles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
