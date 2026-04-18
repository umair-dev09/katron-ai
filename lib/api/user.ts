// User API Service for Katron AI Gift Card Platform
// Calls external backend API directly

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
 */
export async function updateUserInformation(data: UpdateUserModel): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/updateUserInformation`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Update user profile photo
 */
export async function updateUserPhoto(photoUrl: string): Promise<ApiResponse<UserData>> {
  const params = new URLSearchParams({ photo: photoUrl })
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/updateUserPhoto?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Upload a file via presigned S3 URL:
 * 1. POST with no body to get presigned PUT URL from backend
 * 2. PUT file directly to S3 using that URL
 */
export async function uploadFile(file: File, folderName: string, fileName: string): Promise<ApiResponse<string>> {
  const params = new URLSearchParams({ folderName, fileName })
  const contentType = file.type || "image/png"

  // Step 1: Get presigned PUT URL (no file body)
  const presignRes = await fetch(`${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
  })
  const presignData = await presignRes.json()

  if (presignData.status !== 200 || !presignData.data) {
    return { status: presignData.status || 500, message: presignData.message || "Failed to get upload URL", data: "" }
  }

  // Step 2: PUT file to S3 (no auth header — presigned URL is self-authenticated)
  const s3Res = await fetch(presignData.data, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  })

  if (!s3Res.ok) {
    return { status: s3Res.status, message: `S3 upload failed: ${s3Res.status}`, data: "" }
  }

  return { status: 200, message: "Upload successful", data: presignData.data }
}

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordModel): Promise<ApiResponse<null>> {
  const params = new URLSearchParams({
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  })
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/changePassword?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}

/**
 * Send OTP for phone verification
 */
export async function sendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/sendOtpForPhoneVerification`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOtp(otp: string): Promise<ApiResponse<UserData>> {
  const params = new URLSearchParams({ otp })
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/verifyPhoneOtp?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<UserData>(response)
}

/**
 * Resend phone verification OTP
 */
export async function resendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/resendOtpForPhoneVerification`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}

/**
 * Update user address  
 * POST /api/user/updateUserAddress
 */
export interface RegisterAddressModel {
  addressLine1: string
  addressLine2?: string
  currentLocation?: string
  currentLocationLat?: number
  currentLocationLng?: number
  city?: string
  country: string // 2-char ISO code
  state?: string
  zipcode?: string
}

export async function updateUserAddress(address: RegisterAddressModel): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/updateUserAddress`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(address),
  })
  
  return handleResponse<UserData>(response)
}
