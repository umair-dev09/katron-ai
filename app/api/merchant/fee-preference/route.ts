import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

async function getAuthHeader(request: NextRequest): Promise<string | null> {
  let authHeader = request.headers.get("authorization")
  if (!authHeader) {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("authToken")
    if (tokenCookie?.value) {
      authHeader = `Bearer ${tokenCookie.value}`
    }
  }
  return authHeader
}

/**
 * GET /api/merchant/fee-preference - Get active fee preference
 * Proxies to: GET /api/merchant/giftCard/getActiveFeePreference
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = await getAuthHeader(request)
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/merchant/giftCard/getActiveFeePreference`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Merchant Fee Preference] error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
