"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
  verifyEmailOtp as apiVerifyEmailOtp,
  resendEmailVerificationOtp as apiResendEmailOtp,
  getCurrentUser,
  saveAuthToken,
  saveUserData,
  getUserData,
  getAuthToken,
  clearAuthData,
  isAuthenticated as checkIsAuthenticated,
  type UserData,
  type RegisterModel,
  type ApiResponse,
  type LoginResponse,
  AuthApiError,
} from "@/lib/api/auth"
import {
  updateUserInformation as apiUpdateUserInfo,
  updateUserPhoto as apiUpdateUserPhoto,
  changePassword as apiChangePassword,
  sendPhoneVerificationOtp as apiSendPhoneOtp,
  verifyPhoneOtp as apiVerifyPhoneOtp,
  resendPhoneVerificationOtp as apiResendPhoneOtp,
  type UpdateUserModel,
  type ChangePasswordModel,
} from "@/lib/api/user"
import { uploadFile as storageUploadFile, resolveFileUrl } from "@/lib/api/storage"

/**
 * Resolve user.profilePhoto to a fresh presigned URL if it is a raw S3 key.
 * Always saves the raw key back to localStorage so it can be re-resolved on
 * next load; only the in-memory user state carries the presigned URL.
 */
async function resolveUserProfilePhoto(userData: UserData, token: string): Promise<UserData> {
  const photo = userData.profilePhoto
  if (!photo || photo.startsWith("data:") || photo.startsWith("blob:")) return userData

  let keyToResolve = photo

  if (photo.startsWith("http")) {
    // If this is an S3 presigned URL, extract the raw key so we fetch a fresh one.
    // (Presigned URLs expire; we should never show them stale.)
    if (photo.includes("X-Amz-") || photo.includes("amazonaws.com")) {
      try {
        const pathname = decodeURIComponent(new URL(photo).pathname)
        const idx = pathname.indexOf("FOLDER_TYPE_")
        if (idx >= 0) {
          keyToResolve = pathname.slice(idx) // e.g. "FOLDER_TYPE_USER/1234-photo.jpg"
        } else {
          return userData // can't extract key — show as-is
        }
      } catch {
        return userData
      }
    } else {
      return userData // regular CDN/external URL — leave as-is
    }
  }

  try {
    const resolved = await resolveFileUrl(keyToResolve, "FOLDER_TYPE_USER", token)
    return { ...userData, profilePhoto: resolved }
  } catch {
    return userData
  }
}

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  pendingVerificationEmail: string | null
  pendingVerificationToken: string | null
  login: (email: string, password: string, accountType?: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN") => Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }>
  googleLogin: (idToken: string, accountType: "MERCHANT" | "USER") => Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }>
  register: (data: RegisterModel) => Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }>
  verifyEmail: (otp: string) => Promise<{ success: boolean; message?: string }>
  resendVerificationOtp: () => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
  setPendingVerification: (email: string, token: string) => void
  clearPendingVerification: () => void
  // New user profile functions
  updateProfile: (data: UpdateUserModel) => Promise<{ success: boolean; message?: string }>
  updateProfilePhoto: (photoUrl: string) => Promise<{ success: boolean; message?: string }>
  uploadProfilePhoto: (file: File) => Promise<{ success: boolean; message?: string; url?: string; fileName?: string }>
  changePassword: (data: ChangePasswordModel) => Promise<{ success: boolean; message?: string }>
  sendPhoneOtp: () => Promise<{ success: boolean; message?: string }>
  verifyPhone: (otp: string) => Promise<{ success: boolean; message?: string }>
  resendPhoneOtp: () => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)
  const [pendingVerificationToken, setPendingVerificationToken] = useState<string | null>(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken()
        const savedUser = getUserData()
        
        console.log("[Auth Init] Token exists:", !!token)
        console.log("[Auth Init] Saved user exists:", !!savedUser)
        
        if (token && savedUser) {
          // First, set the saved user immediately so UI shows logged in state
          // Resolve profile photo so header/settings show the image right away
          const initialUser = await resolveUserProfilePhoto(savedUser, token).catch(() => savedUser)
          setUser(initialUser)
          
          // Then try to validate/refresh from server (don't block on this)
          try {
            const response = await getCurrentUser()
            console.log("[Auth Init] getCurrentUser response:", response.status, response.message)
            if (response.status === 200 && response.data) {
              saveUserData(response.data) // persist raw key
              const resolvedUser = await resolveUserProfilePhoto(response.data, token).catch(() => response.data)
              setUser(resolvedUser)
              console.log("[Auth Init] User refreshed from server")
            } else if (response.status === 401) {
              // Token is invalid/expired - clear auth data
              console.log("[Auth Init] Token invalid, clearing auth data")
              clearAuthData()
              setUser(null)
            }
            // For other errors, keep the saved user (offline mode)
          } catch (error) {
            // Network error - keep the saved user data
            console.error("[Auth Init] Failed to validate token (keeping saved user):", error)
          }
        }
      } catch (error) {
        console.error("[Auth Init] Auth initialization error:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  const setPendingVerification = useCallback((email: string, token: string) => {
    setPendingVerificationEmail(email)
    setPendingVerificationToken(token)
    // Save token temporarily for verification calls
    saveAuthToken(token)
  }, [])

  const clearPendingVerification = useCallback(() => {
    setPendingVerificationEmail(null)
    setPendingVerificationToken(null)
  }, [])

  const login = useCallback(async (email: string, password: string, accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN" = "USER"): Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiLogin(email, password, accountType)
      
      if (response.data) {
        const { token, user: userData } = response.data
        
        // Reject admin/super_admin credentials in user/merchant console
        if (userData && (userData.accountType === "ADMIN" || userData.accountType === "SUPER_ADMIN")) {
          return {
            success: false,
            message: "Admin accounts cannot log in here. Please use the admin portal."
          }
        }
        
        // Check if email verification is needed
        if (userData && !userData.emailVerified) {
          setPendingVerification(email, token)
          return { 
            success: false, 
            needsVerification: true, 
            email: email,
            message: "Please verify your email address to continue" 
          }
        }
        
        saveAuthToken(token)
        saveUserData(userData)
        setUser(userData)
        return { success: true, message: "Login successful!" }
      }
      
      // Check if response message indicates email verification needed
      if (response.message?.toLowerCase().includes("verify") || response.message?.toLowerCase().includes("email")) {
        return { 
          success: false, 
          needsVerification: true, 
          email: email,
          message: response.message || "Please verify your email address" 
        }
      }
      
      return { success: false, message: response.message || "Login failed. Please try again." }
    } catch (error) {
      const errorMessage = error instanceof AuthApiError ? error.message : ""
      
      // Check if error indicates email verification needed
      if (
        errorMessage.toLowerCase().includes("verify") || 
        errorMessage.toLowerCase().includes("email not verified") ||
        errorMessage.toLowerCase().includes("not active")
      ) {
        return { 
          success: false, 
          needsVerification: true, 
          email: email,
          message: "Please verify your email address to continue" 
        }
      }
      
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An unexpected error occurred. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [setPendingVerification])

  const googleLogin = useCallback(async (
    idToken: string,
    accountType: "MERCHANT" | "USER"
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }> => {
    setIsLoading(true)

    const attemptGoogleLogin = async (): Promise<ApiResponse<LoginResponse>> => {
      return apiGoogleLogin(idToken, accountType)
    }

    try {
      let response: ApiResponse<LoginResponse>

      try {
        response = await attemptGoogleLogin()
      } catch (firstError) {
        // First attempt failed — this commonly happens on cold starts or when
        // the backend needs a moment to initialise for a brand-new Google user.
        // Wait briefly then retry once before surfacing the error.
        console.warn("[GoogleLogin] First attempt failed, retrying in 1.5s…", firstError)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        response = await attemptGoogleLogin()
      }
      
      console.log("[GoogleLogin] Full response:", JSON.stringify(response, null, 2))
      
      if (response.data) {
        const { token, user: userData } = response.data
        
        console.log("[GoogleLogin] Token received:", token ? token.substring(0, 50) + "..." : "NONE")
        console.log("[GoogleLogin] User data:", JSON.stringify(userData, null, 2))
        
        // Check if email verification is needed (unlikely for Google login but handle anyway)
        if (userData && !userData.emailVerified) {
          setPendingVerification(userData.email, token)
          return { 
            success: false, 
            needsVerification: true, 
            email: userData.email,
            message: "Please verify your email address to continue" 
          }
        }
        
        saveAuthToken(token)
        saveUserData(userData)
        setUser(userData)
        
        // Verify token was saved
        const savedToken = getAuthToken()
        console.log("[GoogleLogin] Token saved successfully:", !!savedToken)
        console.log("[GoogleLogin] Saved token matches:", savedToken === token)
        
        return { success: true, message: "Login successful!" }
      }
      
      return { success: false, message: response.message || "Google login failed. Please try again." }
    } catch (error) {
      console.error("[GoogleLogin] Error:", error)
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An unexpected error occurred. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [setPendingVerification])

  const register = useCallback(async (data: RegisterModel): Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiRegister(data)
      
      // Check if registration was successful (status 200/255 or message indicates success)
      if (response.status === 200 || response.status === 255 || response.message?.toLowerCase().includes("success") || response.message?.toLowerCase().includes("otp")) {
        // Use the token returned directly from the register response
        // The register API returns { token, user } in response.data
        if (response.data?.token) {
          console.log("[Register] Token received from registration, saving for email verification")
          setPendingVerification(data.email, response.data.token)
        } else {
          console.warn("[Register] No token in registration response, email verification may fail")
          // Fallback: try to login (unlikely to work if user is not active yet)
          try {
            const loginResponse = await apiLogin(data.email, data.password)
            if (loginResponse.data) {
              const { token } = loginResponse.data
              setPendingVerification(data.email, token)
            }
          } catch (loginError) {
            console.log("[Register] Post-registration login failed (expected if user not active):", loginError)
          }
        }
        
        // Always return needsVerification for new registrations
        return { 
          success: true, 
          needsVerification: true, 
          email: data.email,
          message: response.message || "Registration successful! Please verify your email." 
        }
      }
      
      return { success: false, message: response.message || "Registration failed. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An unexpected error occurred. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [setPendingVerification])

  const verifyEmail = useCallback(async (otp: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiVerifyEmailOtp(otp)
      
      if (response.status === 200) {
        let loggedIn = false

        // The verify response may return { token, user } for auto-login
        if (response.data?.token && response.data?.user) {
          console.log("[VerifyEmail] Response contains token + user, auto-logging in")
          saveAuthToken(response.data.token)
          saveUserData(response.data.user)
          setUser(response.data.user)
          loggedIn = true
        }

        // If no token in verify response, try fetching user with the existing token
        if (!loggedIn) {
          try {
            const userResponse = await getCurrentUser()
            if (userResponse.status === 200 && userResponse.data) {
              console.log("[VerifyEmail] Fetched user after verification, auto-logging in")
              saveUserData(userResponse.data)
              setUser(userResponse.data)
              loggedIn = true
            }
          } catch (e) {
            console.log("[VerifyEmail] getCurrentUser failed after verification:", e)
          }
        }

        // If we still haven't logged in, try login with pending email
        if (!loggedIn && pendingVerificationEmail) {
          console.log("[VerifyEmail] Attempting login after verification")
          try {
            const loginResponse = await apiLogin(pendingVerificationEmail, "")
            if (loginResponse.data?.token && loginResponse.data?.user) {
              saveAuthToken(loginResponse.data.token)
              saveUserData(loginResponse.data.user)
              setUser(loginResponse.data.user)
              loggedIn = true
            }
          } catch {
            // Login without password won't work, that's expected
          }
        }

        clearPendingVerification()
        return { 
          success: true, 
          message: loggedIn 
            ? "Email verified successfully! You are now logged in." 
            : "Email verified successfully! Please log in to continue." 
        }
      }
      
      return { success: false, message: response.message || "Verification failed. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Invalid or expired verification code. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [clearPendingVerification, pendingVerificationEmail])

  const resendVerificationOtp = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiResendEmailOtp()
      
      if (response.status === 200) {
        return { success: true, message: "Verification code sent successfully!" }
      }
      
      return { success: false, message: response.message || "Failed to resend code. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to resend verification code. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthData()
    setUser(null)
    clearPendingVerification()
  }, [clearPendingVerification])

  const refreshUser = useCallback(async () => {
    if (!checkIsAuthenticated()) return
    
    try {
      const response = await getCurrentUser()
      if (response.data) {
        saveUserData(response.data) // persist raw key
        const token = getAuthToken()
        const resolvedUser = token
          ? await resolveUserProfilePhoto(response.data, token).catch(() => response.data)
          : response.data
        setUser(resolvedUser)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      // If refresh fails, user might need to re-login
      logout()
    }
  }, [logout])

  // Profile update functions
  const updateProfile = useCallback(async (data: UpdateUserModel): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiUpdateUserInfo(data)
      
      if (response.status === 200) {
        // Refresh user data after successful update
        await refreshUser()
        return { success: true, message: "Profile updated successfully!" }
      }
      
      return { success: false, message: response.message || "Failed to update profile. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to update profile. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [refreshUser])

  const updateProfilePhoto = useCallback(async (photoUrl: string): Promise<{ success: boolean; message?: string }> => {
    // If the URL is a local base64 data URL, skip the backend call entirely.
    // The backend only accepts real S3 URLs and sending base64 as a query param
    // causes ERR_CONNECTION_RESET due to the URL being too long.
    if (photoUrl.startsWith("data:") || photoUrl === "") {
      return { success: true, message: "Profile photo updated successfully!" }
    }

    // The backend updateUserPhoto endpoint expects a bare filename like "1234-photo.jpg".
    // If the stored key includes the folder prefix ("FOLDER_TYPE_USER/1234-photo.jpg"),
    // strip it off so the backend doesn't end up storing a double-prefixed S3 path.
    let photoParam = photoUrl
    const folderPrefixes = ["FOLDER_TYPE_USER/", "FOLDER_TYPE_BLOG_ASSETS/", "FOLDER_TYPE_BLOG_AUTHOR_AVATAR/"]
    for (const prefix of folderPrefixes) {
      if (photoParam.startsWith(prefix)) {
        photoParam = photoParam.slice(prefix.length)
        break
      }
    }

    setIsLoading(true)
    try {
      const response = await apiUpdateUserPhoto(photoParam)
      
      if (response.status === 200) {
        // Refresh user data after successful update
        await refreshUser()
        return { success: true, message: "Profile photo updated successfully!" }
      }
      
      return { success: false, message: response.message || "Failed to update profile photo. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to update profile photo. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [refreshUser])

  const uploadProfilePhoto = useCallback(async (file: File): Promise<{ success: boolean; message?: string; url?: string; fileName?: string }> => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!token) {
        return { success: false, message: "Not authenticated — please log in again." }
      }

      const result = await storageUploadFile(file, "FOLDER_TYPE_USER", token)

      if (result.success) {
        return {
          success: true,
          message: "Photo uploaded successfully!",
          // presignedDisplayUrl is used for immediate display in the UI
          url: result.presignedDisplayUrl || result.fileName,
          // fileName is the plain reference to persist via updateUserPhoto
          fileName: result.fileName,
        }
      }

      return { success: false, message: result.message || "Upload failed. Please try again." }
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Failed to upload photo. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const changePasswordFn = useCallback(async (data: ChangePasswordModel): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiChangePassword(data)
      
      if (response.status === 200) {
        return { success: true, message: "Password changed successfully!" }
      }
      
      return { success: false, message: response.message || "Failed to change password. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to change password. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendPhoneOtp = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiSendPhoneOtp()
      
      if (response.status === 200) {
        return { success: true, message: "Verification code sent to your phone!" }
      }
      
      return { success: false, message: response.message || "Failed to send verification code. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to send verification code. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyPhone = useCallback(async (otp: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiVerifyPhoneOtp(otp)
      
      if (response.status === 200) {
        // Refresh user data after successful verification
        await refreshUser()
        return { success: true, message: "Phone number verified successfully!" }
      }
      
      return { success: false, message: response.message || "Invalid verification code. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Invalid or expired verification code. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [refreshUser])

  const resendPhoneOtp = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiResendPhoneOtp()
      
      if (response.status === 200) {
        return { success: true, message: "Verification code resent successfully!" }
      }
      
      return { success: false, message: response.message || "Failed to resend code. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to resend verification code. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isAuthenticated = !!user && checkIsAuthenticated()

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isInitialized,
        pendingVerificationEmail,
        pendingVerificationToken,
        login,
        googleLogin,
        register,
        verifyEmail,
        resendVerificationOtp,
        logout,
        refreshUser,
        setPendingVerification,
        clearPendingVerification,
        updateProfile,
        updateProfilePhoto,
        uploadProfilePhoto,
        changePassword: changePasswordFn,
        sendPhoneOtp,
        verifyPhone,
        resendPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
