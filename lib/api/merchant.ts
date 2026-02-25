import { type ApiResponse, AuthApiError, EXTERNAL_API_BASE_URL } from "./auth"

// Types for merchant API profile
export type ChargeType = "CHARGE_CARD" | "CHARGE_ACCOUNT_BALANCE"

export interface MerchantApiProfile {
  id?: number
  token?: string
  apiKey?: string
  chargeType?: ChargeType
  active?: boolean
  balance?: number
  email?: string
  merchantName?: string
  createdAt?: string
  [key: string]: unknown // Allow additional fields from API
}

export interface FeePreference {
  giftCardFeeType?: string
  feeFor1To99?: number
  feeFor100To250?: number
  feeFor251To500?: number
  feeFor501To750?: number
  feeFor751To999?: number
  feePercentageFor1000To5000?: number
}

// Auth headers helper
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

// Generic response handler
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json()
  const isError = !response.ok || (typeof data.status === "number" && data.status >= 400)
  if (isError) {
    throw new AuthApiError(
      data.message || "An error occurred",
      data.status || response.status
    )
  }
  return {
    status: data.status || response.status,
    message: data.message || "",
    // Return data.data if it's an object/array; don't fall back to full body
    data: (data.data !== null && data.data !== undefined) ? data.data : null,
  }
}

/**
 * Get merchant account details (profile, balance, API key, etc.)
 */
export async function getMerchantAccountDetails(): Promise<ApiResponse<MerchantApiProfile>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/merchant/getAccountDetails`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  return handleResponse<MerchantApiProfile>(response)
}

/**
 * Create a new merchant API profile
 * @param type - CHARGE_CARD or CHARGE_ACCOUNT_BALANCE
 */
export async function createMerchantApiProfile(type: ChargeType): Promise<ApiResponse<MerchantApiProfile>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/createMerchantApiProfile?type=${type}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  return handleResponse<MerchantApiProfile>(response)
}

/**
 * Reissue (regenerate) the merchant API token/key
 */
export async function reissueApiToken(): Promise<ApiResponse<MerchantApiProfile>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/merchant/reissueTokenForMerchantApiProfile`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  return handleResponse<MerchantApiProfile>(response)
}

/**
 * Update the charge type for the merchant API profile
 * @param type - CHARGE_CARD or CHARGE_ACCOUNT_BALANCE
 */
export async function updateChargeType(type: ChargeType): Promise<ApiResponse<MerchantApiProfile>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/merchant/giftCard/updateMerchantApiProfileGiftCardChargeType?type=${type}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  return handleResponse<MerchantApiProfile>(response)
}

/**
 * Get active fee preference for merchant
 */
export async function getMerchantFeePreference(): Promise<ApiResponse<FeePreference>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/merchant/giftCard/getActiveFeePreference`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  return handleResponse<FeePreference>(response)
}
