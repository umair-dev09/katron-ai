import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken, accountType } = body

    if (!idToken) {
      return NextResponse.json(
        { status: 400, message: "Google ID token is required", data: null },
        { status: 400 }
      )
    }

    if (!accountType) {
      return NextResponse.json(
        { status: 400, message: "Account type is required", data: null },
        { status: 400 }
      )
    }

    // Validate accountType
    const validAccountTypes = ["MERCHANT", "USER", "ADMIN", "SUPER_ADMIN"]
    if (!validAccountTypes.includes(accountType)) {
      return NextResponse.json(
        { status: 400, message: "Invalid account type", data: null },
        { status: 400 }
      )
    }

    console.log("[Google Auth API] Attempting Google login for accountType:", accountType)

    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        accountType,
      }),
    })

    const data = await response.json()

    console.log("[Google Auth API] Response status:", response.status)
    console.log("[Google Auth API] Response data:", JSON.stringify(data, null, 2))

    // Return the response from backend
    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Google Auth API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
