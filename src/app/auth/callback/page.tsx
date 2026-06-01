"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const id = params.get("id")
    const name = params.get("name")
    const email = params.get("email")
    const image = params.get("image")
    const role = params.get("role")
    const error = params.get("error")

    if (error) {
      router.push(`/login?error=${error}`)
      return
    }

    if (token && email) {
      const userData = {
        id: id || "",
        name: name || "",
        email,
        role: role || "USER",
        image: image || undefined,
      }
      login(token, userData)
      router.push("/dashboard")
    } else {
      router.push("/login?error=google_failed")
    }
  }, [login, router])

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  )
}
