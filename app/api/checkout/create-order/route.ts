// API proxy route for regular user gift card order creation
// POST /api/checkout/create-order

import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")
    
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "Authorization token required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    console.log("[Create Order] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/giftCards/createGiftCardOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log("[Create Order] Raw response status:", response.status)
    console.log("[Create Order] Raw response data:", JSON.stringify(data, null, 2))
    console.log("[Create Order] data.data type:", typeof data.data)
    console.log("[Create Order] data.data value:", data.data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Create Order] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
