import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/user/update-info - Starting request")
  
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[Proxy] /api/user/update-info - No authorization header")
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    console.log("[Proxy] /api/user/update-info - Request body:", body)
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/updateUserInformation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/user/update-info - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/user/update-info - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
