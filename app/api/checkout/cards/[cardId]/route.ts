// API proxy route for deleting a saved card
// DELETE /api/checkout/cards/:cardId

import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params
    const token = request.headers.get("Authorization")
    
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "Authorization token required", data: null },
        { status: 401 }
      )
    }

    if (!cardId) {
      return NextResponse.json(
        { status: 400, message: "Card ID is required", data: null },
        { status: 400 }
      )
    }

    console.log("[Delete Card] Deleting card:", cardId)

    // Try POST with cardId in body first (common pattern for some APIs)
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/deleteCard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ cardId: parseInt(cardId) }),
    })

    const data = await response.json()
    
    console.log("[Delete Card] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Delete Card] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
