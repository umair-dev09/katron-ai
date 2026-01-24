import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/user/change-password - Starting request")
  
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[Proxy] /api/user/change-password - No authorization header")
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    const { oldPassword, newPassword, confirmPassword } = body
    
    console.log("[Proxy] /api/user/change-password - Processing request")
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      oldPassword,
      newPassword,
      confirmPassword,
    })
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/changePassword?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/user/change-password - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/user/change-password - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
