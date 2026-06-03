"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from "lucide-react"

type InquiryType = "support" | "general"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState<InquiryType>("support")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validations
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }
    if (!message.trim()) {
      toast.error("Please enter your message")
      return
    }

    setIsSubmitting(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success("Your message has been sent successfully.")
      
      // Reset form
      setName("")
      setEmail("")
      setMessage("")
      setSubject("support")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute top-[20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <Navbar />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
        
        {/* UNIFIED CONTAINER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* LEFT PANE: Clean Details & Direct Channels (Tinted background) */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-12 bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/10">
              
              {/* Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold uppercase tracking-wider text-violet-400">
                  <Sparkles className="w-3.5 h-3.5" /> Support Center
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  Contact Our <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400">
                    Relations Team
                  </span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Connect with our specialized teams to resolve technical questions, configure custom API endpoints, or request custom enterprise models.
                </p>
              </div>

              {/* Department Timeline */}
              <div className="space-y-8 border-l border-white/10 pl-6 my-auto">
                <div className="space-y-1 relative">
                  <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 ring-4 ring-violet-500/20" />
                  <h4 className="text-sm font-semibold text-white">Customer Support</h4>
                  <p className="text-[11px] text-gray-400">Account assistance and technical troubleshooting.</p>
                  <a href="mailto:support@writeflow.ai" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    support@writeflow.ai
                  </a>
                </div>

                <div className="space-y-1 relative">
                  <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-fuchsia-500 ring-4 ring-fuchsia-500/20" />
                  <h4 className="text-sm font-semibold text-white">General Inquiries</h4>
                  <p className="text-[11px] text-gray-400">Enterprise sales, partnerships, and corporate opportunities.</p>
                  <a href="mailto:info@writeflow.ai" className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-medium">
                    info@writeflow.ai
                  </a>
                </div>
              </div>

              {/* HQ Address Details */}
              <div className="flex items-start gap-3 text-[11px] text-gray-400 pt-6 border-t border-white/10 shrink-0">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-200 block mb-0.5">Corporate Headquarters</span>
                  WriteFlow Technologies Inc. &bull; 100 Pine St, San Francisco, CA 94111
                </div>
              </div>
            </div>

            {/* RIGHT PANE: MODERN FORM (Solid glass background) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-black/20">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSend}
                    className="space-y-6 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Sarah Chen"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 focus:border-violet-500 focus:bg-white/[0.04] transition-all text-white rounded-lg h-10"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="sarah@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 focus:border-violet-500 focus:bg-white/[0.04] transition-all text-white rounded-lg h-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Subject Selector Controller */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 block">
                        Subject of Inquiry
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                        {(["support", "general"] as InquiryType[]).map((type) => {
                          const isActive = subject === type
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSubject(type)}
                              className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                isActive 
                                  ? "bg-violet-600 text-white shadow-lg" 
                                  : "text-gray-400 hover:text-white hover:bg-white/5"
                              }`}
                              disabled={isSubmitting}
                            >
                              {type === "support" ? "Customer Support" : "General Inquiry"}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                        Message Details
                      </label>
                      <Textarea
                        placeholder="Provide details about your query..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-white/[0.02] border border-white/10 focus:border-violet-500 focus:bg-white/[0.04] transition-all text-white rounded-lg min-h-36 resize-y"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="py-12 flex flex-col items-center text-center space-y-6 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Message Sent</h2>
                      <p className="text-gray-400 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
                        Thank you for reaching out. We have logged your request. Our{" "}
                        <span className="text-violet-400 font-semibold capitalize">{subject === "support" ? "support" : "general inquiries"}</span> team will respond to your business email within 24 hours.
                      </p>
                    </div>

                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 h-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Send Another Message
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  )
}
