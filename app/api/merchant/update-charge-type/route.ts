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
 * POST /api/merchant/update-charge-type?type={type} - Update charge type
 * Proxies to: POST /api/merchant/giftCard/updateMerchantApiProfileGiftCardChargeType?type={type}
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
      `${EXTERNAL_API_BASE_URL}/api/merchant/giftCard/updateMerchantApiProfileGiftCardChargeType?type=${type}`,
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
    console.error("[Merchant Update Charge Type] error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
