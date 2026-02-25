// Admin API Service for Katron AI Gift Card Platform
// Admin-specific API calls for dashboard statistics

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
}

// Order data from API
export interface AdminOrder {
  id: number
  // Add more fields as needed based on API response
}

// Gift card data from API
export interface AdminGiftCard {
  productId: number
  productName: string
  // Add more fields as needed
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
