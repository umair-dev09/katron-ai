import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// POST - Load balance for a merchant
export async function POST(request: NextRequest) {
  console.log("[Admin Load Balance] Processing request")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, balance } = body

    if (!email || balance === undefined || balance === null) {
      return NextResponse.json(
        { status: 400, message: "Email and balance amount required", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/loadBalance?email=${encodeURIComponent(email)}&balance=${balance}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }
    )

    const data = await response.json()
    console.log("[Admin Load Balance] Response:", { status: data?.status, message: data?.message })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin Load Balance] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to load balance", data: null },
      { status: 500 }
    )
  }
}
