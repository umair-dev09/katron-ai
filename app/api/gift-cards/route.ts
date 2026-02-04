import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function GET(request: NextRequest) {
  console.log("[Proxy] /api/gift-cards - Starting request")
  
  try {
    // Get the type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    
    if (!type) {
      return NextResponse.json(
        { status: 400, message: "Type parameter is required (open or close)", data: null },
        { status: 400 }
      )
    }
    
    // Validate type - API expects 'open' or 'close'
    if (type !== "open" && type !== "close") {
      return NextResponse.json(
        { status: 400, message: "Type must be 'open' or 'close'", data: null },
        { status: 400 }
      )
    }
    
    // Get the authorization header from the incoming request
    let authHeader = request.headers.get("authorization")
    
    // If no auth header, try to get token from cookie
    if (!authHeader) {
      const cookieStore = await cookies()
      const tokenCookie = cookieStore.get("authToken")
      if (tokenCookie?.value) {
        authHeader = `Bearer ${tokenCookie.value}`
        console.log("[Proxy] /api/gift-cards - Using token from cookie")
      }
    }
    
    console.log("[Proxy] /api/gift-cards - Fetching type:", type)
    console.log("[Proxy] /api/gift-cards - Auth header present:", !!authHeader)
    console.log("[Proxy] /api/gift-cards - Auth header value:", authHeader ? authHeader.substring(0, 30) + "..." : "NONE")
    
    // Build headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    if (authHeader) {
      headers["Authorization"] = authHeader
    }
    
    // Make request to external API
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/giftCards/listAllGiftCards?type=${type}`,
      {
        method: "GET",
        headers,
      }
    )
    
    const data = await response.json()
    console.log("[Proxy] /api/gift-cards - Response status:", response.status)
    console.log("[Proxy] /api/gift-cards - Full response:", JSON.stringify(data, null, 2))
    
    // Log first card structure if available
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log("[Proxy] /api/gift-cards - First card structure:", JSON.stringify(data.data[0], null, 2))
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/gift-cards - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
