import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[Register API] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log("[Register API] Response status:", response.status)
    console.log("[Register API] Response data:", JSON.stringify(data, null, 2))

    // Normalize the response - if registration is successful, status should be 200
    // Some APIs return different status codes or have the status in the body
    const normalizedData = {
      ...data,
      status: data.status || response.status,
    }

    return NextResponse.json(normalizedData, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Register API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
