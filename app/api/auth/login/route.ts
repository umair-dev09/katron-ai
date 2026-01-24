import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const password = searchParams.get("password")

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: "Email and password are required", data: null },
        { status: 400 }
      )
    }

    console.log("[Login API] Attempting login for:", email)

    const params = new URLSearchParams({ email, password })

    const response = await fetch(`${API_BASE_URL}/api/auth/login?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    
    console.log("[Login API] Response status:", response.status)
    console.log("[Login API] Response data:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
