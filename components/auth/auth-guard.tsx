"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLoader } from "@/components/ui/page-loader"

interface AuthGuardProps {
  children: React.ReactNode
  /** If true, only allows unauthenticated users (for login/signup pages) */
  guestOnly?: boolean
  /** If true, only allows authenticated users (for protected pages) */
  requireAuth?: boolean
  /** Custom redirect path for authenticated users on guest-only pages */
  redirectTo?: string
  /** Custom redirect path for unauthenticated users on protected pages */
  loginRedirect?: string
  /** Custom loading message */
  loadingMessage?: string
}

export function AuthGuard({
  children,
  guestOnly = false,
  requireAuth = false,
  redirectTo = "/",
  loginRedirect = "/auth",
  loadingMessage,
}: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) {
      return
    }

    // Guest-only pages (login, signup, etc.)
    if (guestOnly && isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    // Protected pages (dashboard, settings, etc.)
    if (requireAuth && !isAuthenticated) {
      router.replace(loginRedirect)
      return
    }

    // All checks passed, allow rendering
    setIsChecking(false)
    setShouldRender(true)
  }, [isAuthenticated, isInitialized, guestOnly, requireAuth, redirectTo, loginRedirect, router])

  // Show loader while checking auth or redirecting
  if (!isInitialized || isChecking) {
    const message = loadingMessage || (
      guestOnly 
        ? "Checking authentication..." 
        : requireAuth 
          ? "Verifying access..." 
          : "Loading..."
    )
    
    return <PageLoader message={message} />
  }

  // Don't render children if we shouldn't
  if (!shouldRender) {
    return <PageLoader message="Redirecting..." />
  }

  return <>{children}</>
}

// Convenience wrapper for guest-only pages (auth pages)
export function GuestGuard({ 
  children, 
  redirectTo = "/" 
}: { 
  children: React.ReactNode
  redirectTo?: string 
}) {
  return (
    <AuthGuard guestOnly redirectTo={redirectTo} loadingMessage="Checking authentication...">
      {children}
    </AuthGuard>
  )
}

// Convenience wrapper for protected pages
export function ProtectedGuard({ 
  children, 
  loginRedirect = "/auth" 
}: { 
  children: React.ReactNode
  loginRedirect?: string 
}) {
  return (
    <AuthGuard requireAuth loginRedirect={loginRedirect} loadingMessage="Verifying access...">
      {children}
    </AuthGuard>
  )
}
