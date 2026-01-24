// API proxy route for resending gift card credentials
// POST /api/orders/resend-credentials

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

    // Get orderId from query params
    const { searchParams } = new URL(request.url)
    const giftCardOrderId = searchParams.get("giftCardOrderId")
    
    if (!giftCardOrderId) {
      return NextResponse.json(
        { status: 400, message: "giftCardOrderId is required", data: null },
        { status: 400 }
      )
    }

    console.log("[Resend Credentials] Resending credentials for order:", giftCardOrderId)

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/external/giftCard/resendGiftCardCredentials?giftCardOrderId=${giftCardOrderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    )

    const data = await response.json()
    
    console.log("[Resend Credentials] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Resend Credentials] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
