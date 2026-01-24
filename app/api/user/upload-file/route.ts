import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  console.log("[Proxy] /api/user/upload-file - Starting request")
  
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[Proxy] /api/user/upload-file - No authorization header")
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }
    
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
    
    console.log("[Proxy] /api/user/upload-file - Params:", { folderName, fileName })
    
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file")
    
    if (!file) {
      return NextResponse.json(
        { status: 400, message: "File is required", data: null },
        { status: 400 }
      )
    }
    
    // Create new FormData for the external API
    const externalFormData = new FormData()
    externalFormData.append("file", file)
    
    // Build the URL with query parameters
    const params = new URLSearchParams({ folderName, fileName })
    
    // Make request to external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/uploadGenericFile?${params.toString()}`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        // Don't set Content-Type header - let fetch set it with boundary for FormData
      },
      body: externalFormData,
    })
    
    const data = await response.json()
    console.log("[Proxy] /api/user/upload-file - Response:", {
      status: response.status,
      data,
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[Proxy] /api/user/upload-file - Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
