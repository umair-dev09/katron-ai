import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// GET - List all users
export async function GET(request: NextRequest) {
  console.log("[Admin Users] Fetching users list")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=USER`,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }
    )

    const data = await response.json()
    console.log("[Admin Users] Response:", { status: data?.status, count: data?.data?.length })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin Users] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to fetch users", data: null },
      { status: 500 }
    )
  }
}
