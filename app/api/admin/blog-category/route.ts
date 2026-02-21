import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/blogs/listCategories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch categories" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
