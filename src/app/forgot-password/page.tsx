import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-32">
        <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Email Address</label>
              <Input 
                type="email" 
                placeholder="name@example.com"
                className="h-12 bg-black/50 border-white/10"
                required
              />
            </div>
            
            <Button type="button" className="w-full h-12 rounded-full bg-violet-600 hover:bg-violet-700">
              Send Reset Link
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Remember your password? <Link href="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
