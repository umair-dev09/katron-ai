import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/auth/forgot-password - Starting request")
  
  try {
    // Get the email from query params or body
    const { searchParams } = new URL(request.url)
    let email = searchParams.get("email")
    
    // Also try to get from body if not in query
    if (!email) {
      try {
        const body = await request.json()
        email = body.email
      } catch {
        // No body, that's fine
      }
    }
    
    if (!email) {
      return NextResponse.json(
        { status: 400, message: "Email is required", data: null },
        { status: 400 }
      )
    }
    
    console.log("[Proxy] /api/auth/forgot-password - Email:", email)
    
    // Build the URL with query parameter
    const params = new URLSearchParams({ email })
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/forgotPassword?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/auth/forgot-password - Response:", {
      status: response.status,
      data,
      hasToken: !!data?.data?.token,
    })

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/auth/forgot-password - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
