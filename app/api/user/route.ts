import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    let authHeader = request.headers.get("authorization")
    
    // If no auth header, try to get token from cookie
    if (!authHeader) {
      const cookieStore = await cookies()
      const tokenCookie = cookieStore.get("authToken")
      if (tokenCookie?.value) {
        authHeader = `Bearer ${tokenCookie.value}`
        console.log("[User API] Using token from cookie")
      }
    }
    
    console.log("[User API] Auth header present:", !!authHeader)
    console.log("[User API] Auth header value:", authHeader ? authHeader.substring(0, 30) + "..." : "NONE")

    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized - no auth header or cookie", data: null },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/user/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    console.log("[User API] Backend response status:", response.status)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Get User API error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
