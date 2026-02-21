import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// POST - Perform order actions (refund, void, refresh)
export async function POST(request: NextRequest) {
  console.log("[Admin Order Action] Processing request")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { giftCardOrderId, action } = body

    if (!giftCardOrderId || !action) {
      return NextResponse.json(
        { status: 400, message: "Order ID and action required", data: null },
        { status: 400 }
      )
    }

    // Map action to endpoint
    const actionEndpoints: Record<string, string> = {
      refund: "refundOrderPayment",
      void: "voidOrderPayment",
      refresh: "refreshOrder",
    }

    const endpointName = actionEndpoints[action]
    if (!endpointName) {
      return NextResponse.json(
        { status: 400, message: "Invalid action. Use: refund, void, or refresh", data: null },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/admin/giftCard/${endpointName}?giftCardOrderId=${giftCardOrderId}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": authHeader 
        },
      }
    )

    const data = await response.json()
    console.log("[Admin Order Action] Response:", { action, status: data?.status, message: data?.message })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Admin Order Action] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Failed to perform order action", data: null },
      { status: 500 }
    )
  }
}
