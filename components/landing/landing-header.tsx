"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { label: "Rewards", href: "/rewards" },
    { label: "Buy Gift Cards", href: "/buy" },
    { label: "For Developers", href: "#developers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ]

  const handleLogin = () => {
    router.push("/auth")
  }

  return (
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

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogin}
              className="px-7 py-3 text-[15px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
            </button>
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
              <div className="border-t border-gray-800 pt-4 mt-2">
                <button
                  onClick={() => {
                    handleLogin()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
