import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/auth/reset-password - Starting request")
  
  try {
    // Get the request body
    const body = await request.json()
    const { otp, newPassword, confirmPassword } = body
    
    if (!otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { status: 400, message: "OTP, new password, and confirm password are required", data: null },
        { status: 400 }
      )
    }
    
    console.log("[Proxy] /api/auth/reset-password - Processing reset")
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      otp,
      newPassword,
      confirmPassword,
    })
    
    // Get the authorization header if present
    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    if (authHeader) {
      headers["Authorization"] = authHeader
    }
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/resetPassword?${params.toString()}`, {
      method: "POST",
      headers,
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/auth/reset-password - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/auth/reset-password - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
