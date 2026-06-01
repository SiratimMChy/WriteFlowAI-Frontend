"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AdminTemplatesClient } from "@/components/admin-templates-client"
import { Grid } from "lucide-react"

export default function AdminTemplatesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/items", { params: { limit: 20 } })
        if (res.data.success) {
          setTemplates(res.data.data || [])
          if (res.data.meta) {
            setTotalPages(Math.ceil(res.data.meta.total / (res.data.meta.limit || 20)))
          }
        }
      } catch (err) {
        console.error("Templates fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [user, router])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Grid className="w-8 h-8 text-blue-500" />
          Manage Templates
        </h1>
        <p className="text-gray-400 mt-1">Create, edit, and remove AI templates from the library.</p>
      </div>
      <AdminTemplatesClient templates={templates} totalPages={totalPages} />
    </div>
  )
}
