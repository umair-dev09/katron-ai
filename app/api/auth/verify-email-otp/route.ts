import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const otp = searchParams.get("otp")

    if (!otp) {
      return NextResponse.json(
        { status: 400, message: "OTP is required", data: null },
        { status: 400 }
      )
    }

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")

    const params = new URLSearchParams({ otp })

    const response = await fetch(`${API_BASE_URL}/api/auth/verifyEmailOtp?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Verify Email OTP API error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
