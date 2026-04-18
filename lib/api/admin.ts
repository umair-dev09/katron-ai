// Admin API Service for Katron AI Gift Card Platform
// Admin-specific API calls for dashboard statistics and management

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T
}

// Get admin auth token from localStorage
function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_auth_token")
  }
  return null
}

function getAdminHeaders(): Record<string, string> {
  const token = getAdminToken()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalPublishedBlogs: number
  totalUsers: number
  totalMerchants: number
  totalAuthors: number
}

// User data from API
export interface AdminUser {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN"
  emailVerified: boolean
  phoneVerified: boolean
  profilePhoto?: string
  about?: string
  address?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipcode?: string
    country?: string
    currentLocation?: string
    currentLocationLat?: number
    currentLocationLng?: number
  }
  active?: boolean
  createdAt?: string
}

// Order data from API
export interface AdminOrder {
  id: number
  giftCardOrderId?: number
  productName?: string
  brandName?: string
  amount?: number
  unitPrice?: number
  totalAmount?: number
  fee?: number
  status?: string
  paymentStatus?: string
  orderStatus?: string
  createdAt?: string
  customerEmail?: string
  recipientEmail?: string
  recipientName?: string
  email?: string
  cardNumber?: string
  cardPin?: string
  giftCardCode?: string
  giftCardPin?: string
  productId?: number
  senderName?: string
}

// Gift card data from API
export interface AdminGiftCard {
  productId: number
  productName: string
}

// Fee Structure Model
export interface GiftCardFeePreference {
  giftCardFeeType: "FEE_TYPE_USER" | "FEE_TYPE_MERCHANT" | "FEE_TYPE_MERCHANT_API"
  feeFor1To99?: number
  feeFor100To250?: number
  feeFor251To500?: number
  feeFor501To750?: number
  feeFor751To999?: number
  feePercentageFor1000To5000?: number
}

// Register Model for creating admin accounts
export interface AdminRegisterModel {
  firstname: string
  lastname: string
  email: string
  password: string
  phone: string
  address: {
    addressLine1: string
    addressLine2?: string
    city?: string
    state?: string
    zipcode?: string
    country: string
  }
  accountType: "ADMIN" | "SUPER_ADMIN"
}

// ==================== Fee Management ====================

export async function getActiveFeePreference(
  feeType: "FEE_TYPE_USER" | "FEE_TYPE_MERCHANT" | "FEE_TYPE_MERCHANT_API"
): Promise<ApiResponse<GiftCardFeePreference | null>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/getActiveFeePreference?giftCardType=${feeType}`,
      { method: "GET", headers: getAdminHeaders() }
    )
    const data = await response.json()
    console.log(`[Admin API] getActiveFeePreference(${feeType}) response:`, data)
    // The API might return the fee object at data.data or directly at data level
    const feeData = data.data ?? null
    return { status: data.status || response.status, message: data.message || "", data: feeData }
  } catch (error) {
    console.error("[Admin API] Failed to get fee preference:", error)
    return { status: 500, message: "Failed to fetch fee preference", data: null }
  }
}

export async function setFeePreference(
  feeModel: GiftCardFeePreference
): Promise<ApiResponse<unknown>> {
  try {
    console.log("[Admin API] setFeePreference request body:", JSON.stringify(feeModel))
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/setFeesForGiftCard`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(feeModel),
      }
    )
    const data = await response.json()
    console.log("[Admin API] setFeePreference response:", data)
    // Accept both 200 and 201 as success
    const isSuccess = response.ok || data.status === 200 || data.status === 201
    return {
      status: isSuccess ? 200 : (data.status || response.status),
      message: data.message || "",
      data: data.data,
    }
  } catch (error) {
    console.error("[Admin API] Failed to set fee preference:", error)
    return { status: 500, message: "Failed to set fee preference", data: null }
  }
}

// ==================== User/Merchant Management ====================

export async function getAllUsers(
  accountType: "USER" | "MERCHANT" | "ADMIN" | "SUPER_ADMIN"
): Promise<ApiResponse<AdminUser[]>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=${accountType}`,
      { method: "GET", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data || [] }
  } catch (error) {
    console.error("[Admin API] Failed to get users:", error)
    return { status: 500, message: "Failed to fetch users", data: [] }
  }
}

export async function activateOrDeactivateMerchantApiProfile(
  email: string,
  activate: boolean
): Promise<ApiResponse<unknown>> {
  try {
    console.log(`[Admin API] activateOrDeactivateMerchantApiProfile email=${email} activate=${activate}`)
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/activateOrDeactivateMerchantApiProfile?email=${encodeURIComponent(email)}&activate=${activate}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    console.log("[Admin API] activateOrDeactivate response:", data)
    // Accept response.ok or explicit status 200
    const isSuccess = response.ok || data.status === 200
    return {
      status: isSuccess ? 200 : (data.status || response.status),
      message: data.message || (isSuccess ? "Success" : "Failed to update status"),
      data: data.data,
    }
  } catch (error) {
    console.error("[Admin API] Failed to toggle merchant API profile:", error)
    return { status: 500, message: "Failed to update status", data: null }
  }
}

export async function loadBalance(
  email: string,
  balance: number
): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/loadBalance?email=${encodeURIComponent(email)}&balance=${balance}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to load balance:", error)
    return { status: 500, message: "Failed to load balance", data: null }
  }
}

// ==================== Order Management ====================

export async function listOrdersOfUserAndMerchant(
  userId: number
): Promise<ApiResponse<AdminOrder[]>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfUserAndMerchant?userId=${userId}`,
      { method: "GET", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data || [] }
  } catch (error) {
    console.error("[Admin API] Failed to fetch user orders:", error)
    return { status: 500, message: "Failed to fetch orders", data: [] }
  }
}

export async function listOrdersOfMerchantProfileApi(
  merchantEmail: string
): Promise<ApiResponse<AdminOrder[]>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfMerchantProfileApi?merchantEmail=${encodeURIComponent(merchantEmail)}`,
      { method: "GET", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data || [] }
  } catch (error) {
    console.error("[Admin API] Failed to fetch merchant API orders:", error)
    return { status: 500, message: "Failed to fetch orders", data: [] }
  }
}

export async function adminRefundOrder(giftCardOrderId: number): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/refundOrderPayment?giftCardOrderId=${giftCardOrderId}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to refund order:", error)
    return { status: 500, message: "Failed to refund order", data: null }
  }
}

export async function adminVoidOrder(giftCardOrderId: number): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/voidOrderPayment?giftCardOrderId=${giftCardOrderId}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to void order:", error)
    return { status: 500, message: "Failed to void order", data: null }
  }
}

export async function adminRefreshOrder(giftCardOrderId: number): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/refreshOrder?giftCardOrderId=${giftCardOrderId}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to refresh order:", error)
    return { status: 500, message: "Failed to refresh order", data: null }
  }
}

// ==================== Admin Account Management ====================

export async function createAdminAccount(
  model: AdminRegisterModel
): Promise<ApiResponse<unknown>> {
  try {
    // The createAdmin endpoint takes registerModel fields as query parameters (Spring @ModelAttribute).
    // Flatten the nested object into dot-notation query params.
    const params = new URLSearchParams()
    params.set("firstname", model.firstname)
    params.set("lastname", model.lastname)
    params.set("email", model.email)
    params.set("password", model.password)
    params.set("phone", model.phone)
    params.set("accountType", model.accountType)
    // Nested address object — Spring binds these as address.fieldName
    params.set("address.addressLine1", model.address.addressLine1)
    if (model.address.addressLine2) params.set("address.addressLine2", model.address.addressLine2)
    if (model.address.city) params.set("address.city", model.address.city)
    if (model.address.state) params.set("address.state", model.address.state)
    if (model.address.zipcode) params.set("address.zipcode", model.address.zipcode)
    params.set("address.country", model.address.country)

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/createAdmin?${params.toString()}`,
      {
        method: "POST",
        headers: getAdminHeaders(),
      }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to create admin:", error)
    return { status: 500, message: "Failed to create admin account", data: null }
  }
}

// ==================== Admin Change Password ====================

export async function adminChangePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<unknown>> {
  try {
    const params = new URLSearchParams({ oldPassword, newPassword, confirmPassword })
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/user/changePassword?${params.toString()}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to change password:", error)
    return { status: 500, message: "Failed to change password", data: null }
  }
}

// ==================== Admin Forgot/Reset Password ====================

export async function adminForgotPassword(email: string): Promise<ApiResponse<{ token?: string }>> {
  try {
    const params = new URLSearchParams({ email })
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/auth/forgotPassword?${params.toString()}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data || {} }
  } catch (error) {
    console.error("[Admin API] Failed to send reset password:", error)
    return { status: 500, message: "Failed to send reset password email", data: {} }
  }
}

export async function adminResetPassword(
  otp: string,
  newPassword: string,
  confirmPassword: string,
  tempToken: string
): Promise<ApiResponse<unknown>> {
  try {
    const params = new URLSearchParams({ otp, newPassword, confirmPassword })
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/auth/resetPassword?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`,
        },
      }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to reset password:", error)
    return { status: 500, message: "Failed to reset password", data: null }
  }
}

// ==================== Resend Gift Card Credentials ====================

export async function adminResendGiftCardCredentials(
  giftCardOrderId: number
): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/giftCards/resendGiftCardCredentials?giftCardOrderId=${giftCardOrderId}`,
      { method: "POST", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data }
  } catch (error) {
    console.error("[Admin API] Failed to resend credentials:", error)
    return { status: 500, message: "Failed to resend credentials", data: null }
  }
}

// ==================== Get User By ID ====================

export async function getUserById(userId: number): Promise<ApiResponse<AdminUser | null>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/user/getUserById?userId=${userId}`,
      { method: "GET", headers: getAdminHeaders() }
    )
    const data = await response.json()
    return { status: data.status || response.status, message: data.message || "", data: data.data || null }
  } catch (error) {
    console.error("[Admin API] Failed to get user:", error)
    return { status: 500, message: "Failed to fetch user", data: null }
  }
}

/**
 * Fetch dashboard statistics by aggregating multiple API calls directly
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const token = getAdminToken()
    
    if (!token) {
      console.log("[Admin API] No admin token found")
      return {
        totalPublishedBlogs: 0,
        totalUsers: 0,
        totalMerchants: 0,
        totalAuthors: 0,
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }

    // Fetch users, merchants, published blogs and authors in parallel
    const [usersRes, merchantsRes, blogsRes, authorsRes] = await Promise.all([
      fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=USER`, {
        method: "GET",
        headers,
      }).catch(() => null),
      fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=MERCHANT`, {
        method: "GET",
        headers,
      }).catch(() => null),
      fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?status=PUBLISHED&pageSize=1`, {
        method: "GET",
        headers,
      }).catch(() => null),
      fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`, {
        method: "GET",
        headers,
      }).catch(() => null),
    ])

    let totalUsers = 0
    let totalMerchants = 0
    let totalPublishedBlogs = 0
    let totalAuthors = 0

    if (usersRes) {
      try {
        const data = await usersRes.json()
        if (data?.status === 200 && Array.isArray(data?.data)) {
          totalUsers = data.data.length
        }
      } catch {}
    }

    if (merchantsRes) {
      try {
        const data = await merchantsRes.json()
        if (data?.status === 200 && Array.isArray(data?.data)) {
          totalMerchants = data.data.length
        }
      } catch {}
    }

    if (blogsRes) {
      try {
        const data = await blogsRes.json()
        if (data?.status === 200 && data?.data?.totalElements !== undefined) {
          totalPublishedBlogs = data.data.totalElements
        }
      } catch {}
    }

    if (authorsRes) {
      try {
        const data = await authorsRes.json()
        if (data?.status === 200 && Array.isArray(data?.data)) {
          totalAuthors = data.data.length
        }
      } catch {}
    }

    return { totalPublishedBlogs, totalUsers, totalMerchants, totalAuthors }
  } catch (error) {
    console.error("[Admin API] Failed to fetch dashboard stats:", error)
    return {
      totalPublishedBlogs: 0,
      totalUsers: 0,
      totalMerchants: 0,
      totalAuthors: 0,
    }
  }
}
