import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/auth/resend-reset-otp - Starting request")
  
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")
    
    // Get the email from body (needed to identify the user)
    let email = ""
    try {
      const body = await request.json()
      email = body.email
    } catch {
      // No body
    }
    
    console.log("[Proxy] /api/auth/resend-reset-otp - Email:", email)
    
    // Build headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    if (authHeader) {
      headers["Authorization"] = authHeader
    }
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/resendOtpForResetPassword`, {
      method: "POST",
      headers,
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/auth/resend-reset-otp - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/auth/resend-reset-otp - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
