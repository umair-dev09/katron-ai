import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function GET(request: NextRequest) {
  console.log("[Admin Stats] Starting request")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[Admin Stats] No auth header provided")
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    // Use admin controller endpoints + blog endpoints
    let totalUsers = 0
    let totalMerchants = 0
    let totalPublishedBlogs = 0
    let totalAuthors = 0

    // Fetch users, merchants, published blogs and authors in parallel
    const [usersRes, merchantsRes, blogsRes, authorsRes] = await Promise.all([
      fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=USER`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }).catch(e => {
        console.error("[Admin Stats] Users fetch error:", e)
        return null
      }),
      fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=MERCHANT`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }).catch(e => {
        console.error("[Admin Stats] Merchants fetch error:", e)
        return null
      }),
      // Fetch published blogs count
      fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?status=PUBLISHED&pageSize=1`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }).catch(e => {
        console.error("[Admin Stats] Blogs fetch error:", e)
        return null
      }),
      // Fetch authors list
      fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }).catch(e => {
        console.error("[Admin Stats] Authors fetch error:", e)
        return null
      }),
    ])

    // Parse users response
    if (usersRes) {
      try {
        const usersData = await usersRes.json()
        console.log("[Admin Stats] Users response:", { 
          status: usersData?.status, 
          message: usersData?.message,
          dataType: Array.isArray(usersData?.data) ? 'array' : typeof usersData?.data,
          count: Array.isArray(usersData?.data) ? usersData.data.length : 'N/A'
        })
        
        if (usersData?.status === 200 && Array.isArray(usersData?.data)) {
          totalUsers = usersData.data.length
        }
      } catch (e) {
        console.error("[Admin Stats] Users parse error:", e)
      }
    }

    // Parse merchants response
    if (merchantsRes) {
      try {
        const merchantsData = await merchantsRes.json()
        console.log("[Admin Stats] Merchants response:", { 
          status: merchantsData?.status, 
          message: merchantsData?.message,
          dataType: Array.isArray(merchantsData?.data) ? 'array' : typeof merchantsData?.data,
          count: Array.isArray(merchantsData?.data) ? merchantsData.data.length : 'N/A'
        })
        
        if (merchantsData?.status === 200 && Array.isArray(merchantsData?.data)) {
          totalMerchants = merchantsData.data.length
        }
      } catch (e) {
        console.error("[Admin Stats] Merchants parse error:", e)
      }
    }

    // Parse blogs response - get total count from pagination
    if (blogsRes) {
      try {
        const blogsData = await blogsRes.json()
        console.log("[Admin Stats] Blogs response:", { 
          status: blogsData?.status, 
          message: blogsData?.message,
          totalElements: blogsData?.data?.totalElements
        })
        
        if (blogsData?.status === 200 && blogsData?.data?.totalElements !== undefined) {
          totalPublishedBlogs = blogsData.data.totalElements
        }
      } catch (e) {
        console.error("[Admin Stats] Blogs parse error:", e)
      }
    }

    // Parse authors response
    if (authorsRes) {
      try {
        const authorsData = await authorsRes.json()
        console.log("[Admin Stats] Authors response:", { 
          status: authorsData?.status, 
          message: authorsData?.message,
          dataType: Array.isArray(authorsData?.data) ? 'array' : typeof authorsData?.data,
          count: Array.isArray(authorsData?.data) ? authorsData.data.length : 'N/A'
        })
        
        if (authorsData?.status === 200 && Array.isArray(authorsData?.data)) {
          totalAuthors = authorsData.data.length
        }
      } catch (e) {
        console.error("[Admin Stats] Authors parse error:", e)
      }
    }

    console.log("[Admin Stats] Final stats:", { totalPublishedBlogs, totalUsers, totalMerchants, totalAuthors })

    return NextResponse.json({
      status: 200,
      message: "Success",
      data: {
        totalPublishedBlogs,
        totalUsers,
        totalMerchants,
        totalAuthors,
      }
    })
  } catch (error) {
    console.error("[Admin Stats] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
