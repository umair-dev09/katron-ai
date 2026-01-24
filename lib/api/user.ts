// User API Service for Katron AI Gift Card Platform
// Uses Next.js API routes as proxy to avoid CORS issues

import { EXTERNAL_API_BASE_URL, type ApiResponse, type UserData, AuthApiError } from "./auth"

// Types for user updates
export interface UpdateUserModel {
  id?: number
  firstname: string
  lastname: string
  phone: string
  about?: string
}

export interface ChangePasswordModel {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use relative URL
    return ""
  }
  // Server-side: use absolute URL
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

// Helper function to get auth headers for file upload
function getAuthHeadersForUpload(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const headers: HeadersInit = {}
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json()
  
  console.log("[User API] Response:", { status: response.status, data })
  
  const isError = !response.ok || (data.status && data.status >= 400)
  
  if (isError) {
    throw new AuthApiError(
      data.message || "An error occurred",
      data.status || response.status
    )
  }
  
  return {
    status: data.status || response.status,
    message: data.message || "",
    data: data.data || data,
  }
}

/**
 * Update user information
 * POST /api/user/update-info (proxied)
 */
export async function updateUserInformation(data: UpdateUserModel): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${getBaseUrl()}/api/user/update-info`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Update user profile photo
 * POST /api/user/update-photo (proxied)
 */
export async function updateUserPhoto(photoUrl: string): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${getBaseUrl()}/api/user/update-photo`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ photo: photoUrl }),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Upload a file
 * POST /api/user/upload-file (proxied)
 */
export async function uploadFile(file: File, folderName: string, fileName: string): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append("file", file)
  
  const params = new URLSearchParams({
    folderName,
    fileName,
  })
  
  const response = await fetch(`${getBaseUrl()}/api/user/upload-file?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  })
  
  return handleResponse<string>(response)
}

/**
 * Change user password
 * POST /api/user/change-password (proxied)
 */
export async function changePassword(data: ChangePasswordModel): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/user/change-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  return handleResponse<null>(response)
}

/**
 * Send OTP for phone verification
 * POST /api/auth/send-phone-otp (proxied)
 */
export async function sendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/send-phone-otp`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}

/**
 * Verify phone OTP
 * POST /api/auth/verify-phone-otp (proxied)
 */
export async function verifyPhoneOtp(otp: string): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/verify-phone-otp`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ otp }),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Resend phone verification OTP
 * POST /api/auth/resend-phone-otp (proxied)
 */
export async function resendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/resend-phone-otp`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}
