"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Wand2, Menu, X, User, Settings, LogOut, LayoutDashboard, FileText, PieChart, Sparkles, FolderHeart, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/avatar"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [siteName, setSiteName] = useState("WriteFlow")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const authLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/dashboard"},
    { name: "My Documents", href: "/dashboard/documents"},
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt={siteName} 
                width={24} 
                height={24} 
                className="object-contain" 
              />
            ) : (
              <Wand2 className="w-6 h-6 text-violet-500" />
            )}
            <span className="text-xl font-bold tracking-tight">{siteName}</span>
          </Link>
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-muted-foreground">
          {!mounted ? (
            <div className="w-32 h-4 bg-muted animate-pulse rounded" />
          ) : user ? (
            authLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 transition-colors group ${
                    isActive
                      ? "text-violet-500"
                      : "hover:text-foreground"
                  }`}
                >
                  <link className="w-4 h-4" />
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" />
                  )}
                </Link>
              )
            })
          ) : (
            publicLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative transition-colors group ${
                    isActive
                      ? "text-violet-500"
                      : "hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" />
                  )}
                </Link>
              )
            })
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!mounted ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={getAvatarUrl(user.email, user.image || undefined)} alt={user.name || "User"} />
                    <AvatarFallback className="bg-violet-600 text-xs text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-muted-foreground text-xs truncate">{user.email}</div>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <Link href="/dashboard/profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-md">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 mb-2 flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={getAvatarUrl(user.email, user.image || undefined)} alt={user.name || "User"} />
                      <AvatarFallback className="bg-violet-600 text-sm text-white">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-muted-foreground text-xs truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="h-px bg-border my-2" />
                  {authLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-violet-500/10 text-violet-500 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <link className={`w-4 h-4 ${isActive ? "text-violet-500" : ""}`} />
                        {link.name}
                      </Link>
                    )
                  })}
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:text-destructive-foreground hover:bg-destructive/90 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  {publicLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-violet-500/10 text-violet-500 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )
                  })}
                  <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground justify-center">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-md">Get Started</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
