import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// Helper to extract auth header from request or cookie
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
 * GET /api/merchant/profile - Get merchant account details
 * Proxies to: GET /api/merchant/getAccountDetails
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

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/merchant/getAccountDetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    console.log("[Merchant Profile] GET response:", response.status, JSON.stringify(data))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Merchant Profile] GET error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}

/**
 * POST /api/merchant/profile - Create merchant API profile
 * Proxies to: POST /api/user/createMerchantApiProfile?type={type}
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = await getAuthHeader(request)
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type || (type !== "CHARGE_CARD" && type !== "CHARGE_ACCOUNT_BALANCE")) {
      return NextResponse.json(
        { status: 400, message: "Type must be 'CHARGE_CARD' or 'CHARGE_ACCOUNT_BALANCE'", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/user/createMerchantApiProfile?type=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Merchant Profile] POST create error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
