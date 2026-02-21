"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Settings, LogOut, Gift, Key } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isInitialized, logout } = useAuth()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { label: "Rewards", href: "/rewards" },
    { label: "Buy Gift Cards", href: "/buy" },
    { label: "For Developers", href: "/api-docs" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ]

  const handleLogin = () => {
    router.push("/auth")
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

  const displayName = user ? `${user.firstname} ${user.lastname}`.trim() : "User"
  const userInitials = user
    ? `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase()
    : "U"

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 md:h-[72px] items-center justify-between rounded-2xl px-5 md:px-8 backdrop-blur-md border border-gray-800" style={{ backgroundColor: '#181818' }}>
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/katron-ai-logo-bg-transparent.png"
                alt="Katron AI"
                width={130}
                height={52}
                className="h-[53px] w-auto object-contain"
                priority
              />
            </button>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[16px] font-medium text-white hover:text-gray-300 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center">
            {!isInitialized ? (
              <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-gray-700 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-gray-600" />
                <div className="w-14 h-3 rounded-full bg-gray-600" />
              </div>
            ) : !isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="px-7 py-3 text-[15px] font-semibold text-white bg-[#9333EA] rounded-lg hover:bg-[#7E22CE] transition-colors duration-200"
              >
                Get Started
              </button>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple-500/40 transition-all">
                    <Avatar className="w-9 h-9">
                      <AvatarImage
                        src={user?.profilePhoto || undefined}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-purple-600/30 text-purple-300 font-semibold text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 bg-[#181818] border-gray-800 text-white"
                >
                  <div className="px-3 py-2 mb-2 flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user?.profilePhoto || undefined}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-purple-600/30 text-purple-300 font-semibold text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="px-3 pb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full">
                      {user?.accountType}
                    </span>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={() => router.push("/my-giftcards")}
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10 text-gray-300 data-[highlighted]:text-white rounded-lg py-3 px-3 transition-colors"
                  >
                    <Gift className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10 text-gray-300 data-[highlighted]:text-white rounded-lg py-3 px-3 transition-colors"
                  >
                    <Settings className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">Settings</span>
                  </DropdownMenuItem>
                  {user?.accountType === "MERCHANT" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/merchant-api")}
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10 text-gray-300 data-[highlighted]:text-white rounded-lg py-3 px-3 transition-colors"
                    >
                      <Key className="w-[18px] h-[18px] mr-[6px]" />
                      <span className="text-[15px] font-[480]">API Profile</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-red-950/40 focus:bg-red-950/40 data-[highlighted]:bg-red-950/40 text-red-400 data-[highlighted]:text-red-300 rounded-lg py-3 px-3"
                  >
                    <LogOut className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl backdrop-blur-md border border-gray-800 overflow-hidden" style={{ backgroundColor: '#181818' }}>
            <nav className="flex flex-col p-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-white hover:text-gray-300 py-2 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-800 pt-4 mt-2 space-y-2">
                {!isInitialized ? (
                  <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-gray-800 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-700" />
                      <div className="h-2.5 w-28 rounded bg-gray-700" />
                    </div>
                  </div>
                ) : !isAuthenticated ? (
                  <button
                    onClick={() => { handleLogin(); setMobileMenuOpen(false) }}
                    className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-[#9333EA] rounded-lg hover:bg-[#7E22CE] transition-colors duration-200"
                  >
                    Get Started
                  </button>
                ) : (
                  <>
                    <div className="px-2 py-2 flex items-center gap-3">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src={user?.profilePhoto || undefined}
                          alt={displayName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-purple-600/30 text-purple-300 font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full">
                          {user?.accountType}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { router.push("/my-giftcards"); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Gift className="w-4 h-4" /> My Orders
                    </button>
                    <button
                      onClick={() => { router.push("/settings"); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    {user?.accountType === "MERCHANT" && (
                      <button
                        onClick={() => { router.push("/merchant-api"); setMobileMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Key className="w-4 h-4" /> API Profile
                      </button>
                    )}
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
