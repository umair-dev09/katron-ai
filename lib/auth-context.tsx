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
  uploadFile as apiUploadFile,
  changePassword as apiChangePassword,
  sendPhoneVerificationOtp as apiSendPhoneOtp,
  verifyPhoneOtp as apiVerifyPhoneOtp,
  resendPhoneVerificationOtp as apiResendPhoneOtp,
  type UpdateUserModel,
  type ChangePasswordModel,
} from "@/lib/api/user"

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  pendingVerificationEmail: string | null
  pendingVerificationToken: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }>
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
  uploadProfilePhoto: (file: File) => Promise<{ success: boolean; message?: string; url?: string }>
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
          setUser(savedUser)
          
          // Then try to validate/refresh from server (don't block on this)
          try {
            const response = await getCurrentUser()
            console.log("[Auth Init] getCurrentUser response:", response.status, response.message)
            if (response.status === 200 && response.data) {
              setUser(response.data)
              saveUserData(response.data)
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; needsVerification?: boolean; message?: string; email?: string }> => {
    setIsLoading(true)
    try {
      const response = await apiLogin(email, password)
      
      if (response.data) {
        const { token, user: userData } = response.data
        
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
      if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("email not verified")) {
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
    try {
      const response = await apiGoogleLogin(idToken, accountType)
      
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
      
      // Check if registration was successful (status 200 or message indicates success)
      if (response.status === 200 || response.message?.toLowerCase().includes("success") || response.message?.toLowerCase().includes("otp")) {
        // Registration successful - now try to login to get the token for verification
        try {
          const loginResponse = await apiLogin(data.email, data.password)
          if (loginResponse.data) {
            const { token } = loginResponse.data
            setPendingVerification(data.email, token)
          }
        } catch (loginError) {
          // Login might fail if email not verified yet, that's expected
          console.log("Post-registration login:", loginError)
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
        // Email verified, now fetch updated user data
        try {
          const userResponse = await getCurrentUser()
          if (userResponse.data) {
            setUser(userResponse.data)
            saveUserData(userResponse.data)
          }
        } catch {
          // Continue even if fetching user fails
        }
        clearPendingVerification()
        return { success: true, message: "Email verified successfully!" }
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
  }, [clearPendingVerification])

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
        setUser(response.data)
        saveUserData(response.data)
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
    setIsLoading(true)
    try {
      const response = await apiUpdateUserPhoto(photoUrl)
      
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

  const uploadProfilePhoto = useCallback(async (file: File): Promise<{ success: boolean; message?: string; url?: string }> => {
    setIsLoading(true)
    try {
      // Generate a unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop() || 'jpg'
      const fileName = `profile_${user?.id || 'user'}_${timestamp}.${extension}`
      const folderName = "profile-photos"
      
      const response = await apiUploadFile(file, folderName, fileName)
      
      if (response.status === 200 && response.data) {
        // The API returns the filename - construct the full URL to access the file
        // Files are accessed via our proxy endpoint to avoid CORS/auth issues
        const returnedFileName = typeof response.data === 'string' ? response.data : (response.data as unknown as { url?: string; fileName?: string }).fileName || (response.data as unknown as { url?: string }).url
        
        // Use the filename returned by the API, or fall back to our generated filename
        const actualFileName = returnedFileName || fileName
        
        // Construct the URL using our local proxy
        const uploadedUrl = `/api/user/get-file?folderName=${encodeURIComponent(folderName)}&fileName=${encodeURIComponent(actualFileName)}`
        
        console.log("[Auth Context] Upload response data:", response.data)
        console.log("[Auth Context] Constructed photo URL:", uploadedUrl)
        
        return { success: true, message: "Photo uploaded successfully!", url: uploadedUrl }
      }
      
      return { success: false, message: response.message || "Failed to upload photo. Please try again." }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "Failed to upload photo. Please try again."
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

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
