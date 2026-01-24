"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X, User, Settings, LogOut, Gift, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function Header() {
  const { user, isAuthenticated, isInitialized, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogin = () => {
    router.push("/auth")
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buy?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    } else {
      router.push("/buy")
    }
  }

  const navItems = [
    {
      label: "Rewards",
      href: "/buy",
    },
    {
      label: "Buy Gift Cards",
      href: "/buy",
    },
  ]

  // Get user display name
  const displayName = user ? `${user.firstname} ${user.lastname}`.trim() : "User"
  const userInitials = user 
    ? `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() 
    : "U"

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border/60 bg-white/[0.94] dark:bg-slate-950/[0.94] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-[2px]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/ktn-logo.png"
                alt="Logo"
                width={120}
                height={50}
                className="h-16 w-[138px] object-fill -ml-6"
                priority
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gift cards..."
                className="w-[260px] h-10 pl-10 pr-4 text-[15px] bg-white dark:bg-gray-950 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:border-primary dark:focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </form>

            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="text-[17px] font-medium text-foreground transition-all relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}

            {/* Login / Profile */}
            {!isInitialized ? (
              // Skeleton loading - hybrid design that resembles both button and profile
              <div className="ml-4 flex items-center gap-2 h-10 px-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="w-16 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            ) : !isAuthenticated ? (
              <Button
                onClick={handleLogin}
                className="ml-4 h-10 px-6 py-[22px] rounded-md text-base text-primary-foreground font-semibold transition-all"
              >
                Get Started
              </Button>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className=" flex items-center justify-center w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <Avatar className="w-9 h-9">
                      <AvatarImage 
                        src={user?.profilePhoto || undefined} 
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <div className="px-3 py-2 mb-2 flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={user?.profilePhoto || undefined} 
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="px-3 pb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {user?.accountType}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => router.push("/my-giftcards")} 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-lg py-3 px-3"
                  >
                    <Gift className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSettings} 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-lg py-3 px-3"
                  >
                    <Settings className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg py-3 px-3"
                  >
                    <LogOut className="w-[18px] h-[18px] mr-[6px]" />
                    <span className="text-[15px] font-[480]">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Nav Items */}
                  <nav className="flex flex-col space-y-1 mt-8">
                    {navItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => router.push(item.href)}
                        className="text-left text-lg font-medium text-foreground/70 hover:text-foreground py-3 px-4 rounded-lg hover:bg-accent/50 transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Login/Profile Section */}
                  <div className="mt-auto pb-6 space-y-3 pt-6 border-t border-border">
                    {!isInitialized ? (
                      // Skeleton loading for mobile - hybrid design
                      <div className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                          <div className="h-3 w-32 rounded bg-gray-300 dark:bg-gray-600" />
                        </div>
                      </div>
                    ) : !isAuthenticated ? (
                      <Button 
                        onClick={handleLogin} 
                        className="w-full h-11 font-semibold shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-full"
                      >
                        Get Started
                      </Button>
                    ) : (
                      <>
                        <div className="px-4 py-2 mb-2 flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage 
                              src={user?.profilePhoto || undefined} 
                              alt={displayName}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                              {user?.accountType}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push("/my-giftcards")}
                          variant="outline"
                          className="w-full h-11 justify-start font-medium hover:bg-gray-50 dark:hover:bg-gray-900/20"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          My Orders
                        </Button>
                        <Button
                          onClick={handleSettings}
                          variant="outline"
                          className="w-full h-11 justify-start font-medium hover:bg-gray-50 dark:hover:bg-gray-900/20"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full h-11 justify-start font-medium text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
