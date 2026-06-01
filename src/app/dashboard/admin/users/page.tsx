"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AdminUsersClient } from "@/components/admin-users-client"
import { Users } from "lucide-react"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", { params: { limit: 20 } })
        if (res.data.success) {
          setUsers(res.data.data || [])
          if (res.data.meta) {
            setTotalPages(Math.ceil(res.data.meta.total / (res.data.meta.limit || 20)))
          }
        }
      } catch (err) {
        console.error("Users fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [user, router])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          Manage Users
        </h1>
        <p className="text-gray-400 mt-1">View, edit, and manage all users on the platform.</p>
      </div>
      <AdminUsersClient users={users} totalPages={totalPages} />
    </div>
  )
}
