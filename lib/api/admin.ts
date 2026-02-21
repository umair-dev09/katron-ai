// Admin API Service for Katron AI Gift Card Platform
// Admin-specific API calls for dashboard statistics

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
 * Fetch dashboard statistics via proxy route
 * This avoids CORS issues by calling our Next.js API route
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

    const response = await fetch("/api/admin/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    const data: ApiResponse<DashboardStats> = await response.json()
    
    console.log("[Admin API] Stats response:", data)

    if (data.status === 200 && data.data) {
      return data.data
    }

    console.error("[Admin API] Failed to fetch stats:", data.message)
    return {
      totalPublishedBlogs: 0,
      totalUsers: 0,
      totalMerchants: 0,
      totalAuthors: 0,
    }
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
