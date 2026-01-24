import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function GET(request: NextRequest) {
  console.log("[Proxy] /api/user/get-file - Starting request")
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const folderName = searchParams.get("folderName")
    const fileName = searchParams.get("fileName")
    
    if (!folderName || !fileName) {
      return NextResponse.json(
        { status: 400, message: "folderName and fileName are required", data: null },
        { status: 400 }
      )
    }
    
    console.log("[Proxy] /api/user/get-file - Params:", { folderName, fileName })
    
    // Get the authorization header from the incoming request (optional for images)
    const authHeader = request.headers.get("authorization")
    
    // Build the URL with query parameters
    const params = new URLSearchParams({ folderName, fileName })
    
    // Make request to external API
    const headers: HeadersInit = {}
    if (authHeader) {
      headers["Authorization"] = authHeader
    }
    
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/getGenericFile?${params.toString()}`, {
      method: "GET",
      headers,
    })
    
    console.log("[Proxy] /api/user/get-file - Response status:", response.status)
    
    if (!response.ok) {
      return new NextResponse(null, { status: response.status })
    }
    
    // Get the content type from the response
    const contentType = response.headers.get("content-type") || "image/jpeg"
    
    // Get the image data as array buffer
    const imageBuffer = await response.arrayBuffer()
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("[Proxy] /api/user/get-file - Error:", error)
    return new NextResponse(null, { status: 500 })
  }
}
