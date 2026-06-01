"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { Loader2, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic client validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      const res = await api.post("/auth/forgot-password", { email })
      if (res.data.success) {
        setSuccess(res.data.message || "A reset link has been sent to your email.")
        setEmail("")
      } else {
        setError(res.data.message || "Failed to request password reset.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white overflow-x-hidden selection:bg-violet-500/30">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-32 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll verify it to send a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-sm text-gray-300 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-black/50 border-white/10 text-white focus-visible:ring-violet-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm font-medium text-red-400 bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm font-medium text-emerald-400 bg-emerald-500/10 py-3 px-4 rounded-xl border border-emerald-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Sign in
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
