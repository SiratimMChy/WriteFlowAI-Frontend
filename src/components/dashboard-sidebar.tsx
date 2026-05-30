"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
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
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#0a0a0a] border-r border-white/5">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <span className="font-bold text-white">WriteFlow AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-violet-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 gap-2"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
