"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Wand2, ArrowRight, Loader2, Mail, Lock, User as UserIcon } from "lucide-react"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/register", { name, email, password })

      if (res.data.success) {
        // Successful registration, navigate to login
        router.push("/login")
      } else {
        setError(res.data.message || "Registration failed")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    window.location.href = `${backendUrl}/api/auth/google`
  }

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white selection:bg-violet-500/30">
      
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-violet-500" />
            <span className="font-bold tracking-tight">WriteFlow</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-gray-400">Join WriteFlow and start creating content 10x faster</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 relative group">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500 focus-visible:bg-white/[0.05] h-12 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500 focus-visible:bg-white/[0.05] h-12 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 relative group">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500 focus-visible:bg-white/[0.05] h-12 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm font-medium text-red-400 text-center bg-red-500/10 py-3 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-lg rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-4 text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Google Sign In/Up */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white/[0.02] border-white/10 text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all"
              onClick={loginWithGoogle}
              type="button"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>

      </div>

      {/* Right Panel - Visuals */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black flex-col justify-between p-12 border-l border-white/5">
        {/* Animated Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 flex justify-end">
          <Link href="/" className="flex items-center gap-2 inline-flex transition-transform hover:scale-105">
            <span className="text-2xl font-bold tracking-tight">WriteFlow</span>
            <Wand2 className="w-8 h-8 text-violet-500" />
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-6 max-w-xl self-end text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold tracking-tighter leading-[1.1] mb-6">
              Start creating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-400 to-blue-400">
                content that converts
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed ml-auto max-w-md">
              Get access to powerful AI agents, proven templates, and a seamless writing experience designed for modern creators.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-200">14-Day Free Trial</h3>
              <p className="text-sm text-gray-500">No credit card required to start.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <UserIcon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-200">10k Free Words</h3>
              <p className="text-sm text-gray-500">Enough to write your first book chapter.</p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-600 text-right">
          © {new Date().getFullYear()} WriteFlow AI. All rights reserved.
        </div>
      </div>
    </div>
  )
}
