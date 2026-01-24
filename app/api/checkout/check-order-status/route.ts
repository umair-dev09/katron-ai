// API proxy route for checking order status (payment + gift card delivery)
// POST /api/checkout/check-order-status

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
    const orderId = body.orderId || body.giftCardOrderId
    
    console.log("[Check Order Status] Order ID:", orderId)

    if (!orderId) {
      return NextResponse.json(
        { status: 400, message: "Order ID is required", data: null },
        { status: 400 }
      )
    }

    // API expects giftCardOrderId as query parameter, not body
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/giftCards/checkForPaymentAndGiftCardStatus?giftCardOrderId=${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    )

    const data = await response.json()
    
    console.log("[Check Order Status] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Check Order Status] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
