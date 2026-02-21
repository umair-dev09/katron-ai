import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// Create a new blog author
export async function POST(request: NextRequest) {
  console.log("[Admin Blog Author API] POST - Creating author")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("[Admin Blog Author API] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createBlogAuthor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[Admin Blog Author API] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Admin Blog Author API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}

// Get all blog authors
export async function GET(request: NextRequest) {
  console.log("[Admin Blog Author API] GET - Fetching authors")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })

    const data = await response.json()
    console.log("[Admin Blog Author API] Authors fetched:", data?.data?.length || 0, "authors")

    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Admin Blog Author API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
