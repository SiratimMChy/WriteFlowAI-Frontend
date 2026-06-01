"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  History,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Wand2,
  MessageSquare,
  Users,
  BarChart,
  Grid,
  Star,
  ShieldAlert
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    label: "Draft Agent",
    href: "/dashboard/draft",
    icon: Wand2,
  },
  {
    label: "Rewrite Agent",
    href: "/dashboard/rewrite",
    icon: Sparkles,
  },
  {
    label: "Chat Assistant",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    label: "AI History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

const adminItems = [
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Templates",
    href: "/dashboard/admin/templates",
    icon: Grid,
  },
  {
    label: "Reviews",
    href: "/dashboard/admin/reviews",
    icon: Star,
  },
  {
    label: "Site Settings",
    href: "/dashboard/admin/settings",
    icon: ShieldAlert,
  },
]

export function DashboardSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "U"

  const isAdmin = user?.role === "admin" || user?.role === "ADMIN"

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo */}
      <Link href="/" className="h-16 flex items-center gap-2 px-6 border-b border-white/5 hover:opacity-80 transition-opacity">
        <Wand2 className="w-5 h-5 text-violet-500" />
        <span className="font-bold text-white">WriteFlow AI</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </div>

        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Admin Panel
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8 border border-white/10">
            <AvatarImage src={getAvatarUrl(user?.email, user?.image)} alt={user?.name || "User"} />
            <AvatarFallback className="bg-violet-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
