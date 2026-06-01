"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Shield, Ban, CheckCircle2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function AdminUsersClient({ users, totalPages }: { users: any[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")

  const currentPage = Number(searchParams.get("page")) || 1

  const updateUrl = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    if (params.page === undefined) {
      current.set("page", "1")
    }

    const search = current.toString()
    const urlQuery = search ? `?${search}` : ""
    
    startTransition(() => {
      router.push(`${pathname}${urlQuery}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: query })
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    startTransition(async () => {
      try {
        const res = await api.patch(`/users/${userId}`, { role: newRole })
        if (res.data.success) {
          toast.success("Role updated")
          router.refresh()
        } else {
          toast.error(res.data.message || "Failed to update role")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update role")
      }
    })
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "banned" : "active"
    startTransition(async () => {
      try {
        const res = await api.patch(`/users/${userId}`, { status: newStatus })
        if (res.data.success) {
          toast.success(`User ${newStatus === "banned" ? "banned" : "activated"}`)
          router.refresh()
        } else {
          toast.error(res.data.message || "Failed to update status")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update status")
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search users by name or email..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl focus-visible:ring-violet-500"
          />
        </form>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 font-medium text-gray-400">User</th>
                <th className="p-4 font-medium text-gray-400">Role</th>
                <th className="p-4 font-medium text-gray-400">Plan</th>
                <th className="p-4 font-medium text-gray-400">Join Date</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={isPending ? "opacity-50 pointer-events-none" : ""}>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-200">{user.name || "Anonymous"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-black border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-300 border border-white/10 uppercase tracking-wider">
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {user.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded">
                        <Ban className="w-3 h-3" /> Banned
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={user.status === "active" ? "text-red-400 hover:text-red-300 hover:bg-red-400/10" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"}
                    >
                      {user.status === "active" ? (
                        <><Ban className="w-4 h-4 mr-2" /> Ban</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Unban</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button 
            disabled={currentPage <= 1 || isPending}
            onClick={() => updateUrl({ page: String(currentPage - 1) })}
            className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          <button 
            disabled={currentPage >= totalPages || isPending}
            onClick={() => updateUrl({ page: String(currentPage + 1) })}
            className="px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
