"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { PageLoader } from "@/components/ui/page-loader"

interface AdminGuardProps {
  children: React.ReactNode
  /** If true, only allows unauthenticated admins (for admin login page) */
  guestOnly?: boolean
  /** Custom redirect path for authenticated admins on guest-only pages */
  redirectTo?: string
  /** Custom loading message */
  loadingMessage?: string
}

export function AdminGuard({
  children,
  guestOnly = false,
  redirectTo = "/admin",
  loadingMessage,
}: AdminGuardProps) {
  const { isAuthenticated, isInitialized } = useAdminAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) {
      return
    }

    // Guest-only pages (admin login)
    if (guestOnly && isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    // Protected admin pages
    if (!guestOnly && !isAuthenticated) {
      router.replace("/admin/auth")
      return
    }

    // All checks passed, allow rendering
    setIsChecking(false)
    setShouldRender(true)
  }, [isAuthenticated, isInitialized, guestOnly, redirectTo, router])

  // Show loader while checking auth or redirecting
  if (!isInitialized || isChecking) {
    const message = loadingMessage || (
      guestOnly 
        ? "Checking admin session..." 
        : "Verifying admin access..."
    )
    
    return <PageLoader message={message} logoSrc="/katron-ai-logo-bg-transparent.png" />
  }

  // Don't render children if we shouldn't
  if (!shouldRender) {
    return <PageLoader message="Redirecting..." logoSrc="/katron-ai-logo-bg-transparent.png" />
  }

  return <>{children}</>
}

// Convenience wrapper for admin login page (guest-only)
export function AdminGuestGuard({ 
  children, 
  redirectTo = "/admin" 
}: { 
  children: React.ReactNode
  redirectTo?: string 
}) {
  return (
    <AdminGuard guestOnly redirectTo={redirectTo} loadingMessage="Checking admin session...">
      {children}
    </AdminGuard>
  )
}

// Convenience wrapper for protected admin pages
export function AdminProtectedGuard({ 
  children,
  loadingMessage = "Verifying admin access..."
}: { 
  children: React.ReactNode
  loadingMessage?: string
}) {
  return (
    <AdminGuard loadingMessage={loadingMessage}>
      {children}
    </AdminGuard>
  )
}
