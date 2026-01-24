// API proxy route for getting all orders
// GET /api/orders

import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")
    
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "Authorization token required", data: null },
        { status: 401 }
      )
    }

    console.log("[Orders API] Fetching all orders...")

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/giftCards/listAllOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    })

    const data = await response.json()
    
    console.log("[Orders API] Response status:", response.status)
    console.log("[Orders API] Response data:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Orders API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
