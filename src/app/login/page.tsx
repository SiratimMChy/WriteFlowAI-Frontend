"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Wand2, ArrowRight, Loader2, User, ShieldCheck, Mail, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const loginWithGoogle = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    window.location.href = `${backendUrl}/api/auth/google`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/login", { email, password })

      if (res.data.success && res.data.data.token) {
        const userData = {
          id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
          image: res.data.data.image,
        }
        login(res.data.data.token, userData)
        router.push("/dashboard")
      } else {
        setError(res.data.message || "Invalid email or password")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsDemo = async (type: "user" | "admin") => {
    const demoEmail = type === "admin" ? "admin@writeflow.com" : "user@writeflow.com"
    setEmail(demoEmail)
    setPassword("123456")
    
    setIsLoading(true)
    try {
      const res = await api.post("/auth/login", { email: demoEmail, password: "123456" })

      if (res.data.success && res.data.data.token) {
        const userData = {
          id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
          image: res.data.data.image,
        }
        login(res.data.data.token, userData)
        router.push("/dashboard")
      } else {
        setError(res.data.message || "Invalid email or password")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white selection:bg-violet-500/30">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black flex-col justify-between p-12 border-r border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 inline-flex transition-transform hover:scale-105">
            <Wand2 className="w-8 h-8 text-violet-500" />
            <span className="text-2xl font-bold tracking-tight">WriteFlow</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-6 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold tracking-tighter leading-[1.1] mb-6">
              Welcome back to your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                content powerhouse
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Log in to continue generating high-converting content, managing your brand voices, and optimizing your workflows.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-200">AI Generation</h3>
              <p className="text-sm text-gray-500">Pick up right where you left off.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-200">Team Collab</h3>
              <p className="text-sm text-gray-500">Your workspace is waiting for you.</p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-600">
          © {new Date().getFullYear()} WriteFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
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
            <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-violet-500 focus-visible:bg-white/[0.05] h-12 transition-all"
                    required
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
                  Sign In
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
            {/* Google Sign In */}
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
              Sign in with Google
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:text-white rounded-xl transition-all"
                onClick={() => loginAsDemo("user")}
                type="button"
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4" />
                User Demo
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:text-white rounded-xl transition-all"
                onClick={() => loginAsDemo("admin")}
                type="button"
                disabled={isLoading}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Demo
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
