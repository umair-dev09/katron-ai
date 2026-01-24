// API proxy route for adding a payment card to PayArc
// POST /api/checkout/add-card

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
    
    console.log("[Add Card] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/addCardToPayArc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log("[Add Card] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Add Card] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
