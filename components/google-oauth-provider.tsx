"use client"

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

interface GoogleOAuthProviderProps {
  children: React.ReactNode
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  // If no client ID is configured, just render children without Google provider
  // This allows the app to work even if Google auth is not set up
  if (!GOOGLE_CLIENT_ID) {
    console.warn("[GoogleOAuthProvider] Google Client ID not configured. Google Sign-In will be disabled.")
    return <>{children}</>
  }

  return (
    <GoogleProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleProvider>
  )
}

// Export the client ID check for components to use
export function isGoogleAuthConfigured(): boolean {
  return !!GOOGLE_CLIENT_ID
}
