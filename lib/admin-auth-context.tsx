"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

// External API base URL
const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

// Admin user types
type AdminAccountType = "ADMIN" | "SUPER_ADMIN"

export interface AdminUserData {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  accountType: AdminAccountType
  emailVerified: boolean
  phoneVerified: boolean
  profilePhoto?: string
  about?: string
}

interface AdminLoginResponse {
  token: string
  user: AdminUserData
}

interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T
}

interface AdminAuthContextType {
  admin: AdminUserData | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshAdmin: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Storage keys - separate from regular user auth
const ADMIN_TOKEN_KEY = "admin_auth_token"
const ADMIN_USER_KEY = "admin_user_data"

// Storage helpers
function saveAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  }
}

function saveAdminData(user: AdminUserData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  }
}

function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  }
  return null
}

function getAdminData(): AdminUserData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_USER_KEY)
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    }
  }
  return null
}

function clearAdminAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize admin auth state from localStorage
  useEffect(() => {
    const initializeAdminAuth = async () => {
      try {
        const token = getAdminToken()
        const savedAdmin = getAdminData()

        console.log("[Admin Auth Init] Token exists:", !!token)
        console.log("[Admin Auth Init] Saved admin exists:", !!savedAdmin)

        if (token && savedAdmin) {
          // Verify the saved user is an admin
          if (savedAdmin.accountType === "ADMIN" || savedAdmin.accountType === "SUPER_ADMIN") {
            setAdmin(savedAdmin)

            // Validate token with server
            try {
              const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/getCurrentUser`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })

              if (response.ok) {
                const data: ApiResponse<AdminUserData> = await response.json()
                if (data.status === 200 && data.data) {
                  // Verify returned user is still an admin
                  if (data.data.accountType === "ADMIN" || data.data.accountType === "SUPER_ADMIN") {
                    setAdmin(data.data)
                    saveAdminData(data.data)
                    console.log("[Admin Auth Init] Admin refreshed from server")
                  } else {
                    // No longer an admin - clear auth
                    console.log("[Admin Auth Init] User is no longer an admin")
                    clearAdminAuth()
                    setAdmin(null)
                  }
                }
              } else if (response.status === 401) {
                console.log("[Admin Auth Init] Token invalid, clearing admin auth")
                clearAdminAuth()
                setAdmin(null)
              }
            } catch (error) {
              console.error("[Admin Auth Init] Failed to validate token:", error)
              // Keep saved admin data for offline mode
            }
          } else {
            // Not an admin - clear data
            console.log("[Admin Auth Init] Saved user is not an admin")
            clearAdminAuth()
          }
        }
      } catch (error) {
        console.error("[Admin Auth Init] Error:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAdminAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ email, password })
      
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/login?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data: ApiResponse<AdminLoginResponse> = await response.json()

      console.log("[Admin Login] Response:", { status: data.status, hasData: !!data.data })

      if (data.data) {
        const { token, user: userData } = data.data

        // CRITICAL: Verify the user is an admin
        if (userData.accountType !== "ADMIN" && userData.accountType !== "SUPER_ADMIN") {
          console.log("[Admin Login] Access denied - not an admin account")
          return { 
            success: false, 
            message: "Access denied. This portal is for administrators only." 
          }
        }

        // Check if email is verified
        if (!userData.emailVerified) {
          return {
            success: false,
            message: "Please verify your email address before accessing the admin portal."
          }
        }

        saveAdminToken(token)
        saveAdminData(userData)
        setAdmin(userData)
        
        return { success: true, message: "Welcome to the admin portal!" }
      }

      return { success: false, message: data.message || "Login failed. Please try again." }
    } catch (error) {
      console.error("[Admin Login] Error:", error)
      return { 
        success: false, 
        message: "An unexpected error occurred. Please try again." 
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAdminAuth()
    setAdmin(null)
    console.log("[Admin Auth] Logged out")
  }, [])

  const refreshAdmin = useCallback(async () => {
    const token = getAdminToken()
    if (!token) return

    try {
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/getCurrentUser`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data: ApiResponse<AdminUserData> = await response.json()
        if (data.status === 200 && data.data) {
          if (data.data.accountType === "ADMIN" || data.data.accountType === "SUPER_ADMIN") {
            setAdmin(data.data)
            saveAdminData(data.data)
          } else {
            logout()
          }
        }
      } else if (response.status === 401) {
        logout()
      }
    } catch (error) {
      console.error("[Admin Auth] Failed to refresh admin:", error)
    }
  }, [logout])

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    isInitialized,
    login,
    logout,
    refreshAdmin,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

// Helper to get admin token for API calls
export function getAdminAuthToken(): string | null {
  return getAdminToken()
}
