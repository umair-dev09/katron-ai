import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// GET - List all orders for a user
export async function GET(request: NextRequest) {
  console.log("[Admin User Orders] Fetching orders")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { status: 400, message: "userId is required", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfUserAndMerchant?userId=${userId}`,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }
    )

    const data = await response.json()
    console.log("[Admin User Orders] Response:", { 
      status: data?.status, 
      count: Array.isArray(data?.data) ? data.data.length : 'N/A' 
    })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin User Orders] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to fetch orders", data: null },
      { status: 500 }
    )
  }
}
