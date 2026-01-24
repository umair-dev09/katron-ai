import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/auth/verify-phone-otp - Starting request")
  
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[Proxy] /api/auth/verify-phone-otp - No authorization header")
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }
    
    // Get the OTP from request body
    const body = await request.json()
    const { otp } = body
    
    if (!otp) {
      return NextResponse.json(
        { status: 400, message: "OTP is required", data: null },
        { status: 400 }
      )
    }
    
    console.log("[Proxy] /api/auth/verify-phone-otp - OTP received")
    
    // Build the URL with query parameter
    const params = new URLSearchParams({ otp })
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/verifyPhoneOtp?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/auth/verify-phone-otp - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/auth/verify-phone-otp - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
