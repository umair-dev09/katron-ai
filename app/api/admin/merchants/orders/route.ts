import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// GET - List all orders for a merchant (by user ID or merchant email)
export async function GET(request: NextRequest) {
  console.log("[Admin Merchant Orders] Fetching orders")
  
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
    const merchantEmail = searchParams.get("merchantEmail")

    let endpoint: string

    if (merchantEmail) {
      // Use merchant API profile endpoint
      endpoint = `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfMerchantProfileApi?merchantEmail=${encodeURIComponent(merchantEmail)}`
    } else if (userId) {
      // Use user/merchant endpoint
      endpoint = `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfUserAndMerchant?userId=${userId}`
    } else {
      return NextResponse.json(
        { status: 400, message: "Either userId or merchantEmail is required", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": authHeader 
      },
    })

    const data = await response.json()
    console.log("[Admin Merchant Orders] Response:", { 
      status: data?.status, 
      count: Array.isArray(data?.data) ? data.data.length : 'N/A' 
    })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin Merchant Orders] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to fetch orders", data: null },
      { status: 500 }
    )
  }
}
