import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// Create a new blog post
export async function POST(request: NextRequest) {
  console.log("[Admin Blog API] POST - Creating blog")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("[Admin Blog API] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createBlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[Admin Blog API] Response:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Admin Blog API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}

// Get all blogs
export async function GET(request: NextRequest) {
  console.log("[Admin Blog API] GET - Fetching blogs")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/getAllBlogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })

    const data = await response.json()
    console.log("[Admin Blog API] Blogs fetched:", data?.data?.length || 0, "blogs")

    return NextResponse.json(data, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error("[Admin Blog API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
