import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// POST - Activate or deactivate merchant API profile
export async function POST(request: NextRequest) {
  console.log("[Admin Merchant Toggle] Processing request")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, activate } = body

    if (!email || activate === undefined) {
      return NextResponse.json(
        { status: 400, message: "Email and activate status required", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/activateOrDeactivateMerchantApiProfile?email=${encodeURIComponent(email)}&activate=${activate}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }
    )

    const data = await response.json()
    console.log("[Admin Merchant Toggle] Response:", { status: data?.status, message: data?.message })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin Merchant Toggle] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to toggle merchant status", data: null },
      { status: 500 }
    )
  }
}
