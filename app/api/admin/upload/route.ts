import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE_URL } from "@/lib/api/auth"

// Upload file to storage
export async function POST(request: NextRequest) {
  console.log("[Admin Upload API] POST - Uploading file")
  
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, message: "Authorization required", data: null },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folderName = formData.get("folderName") as string
    const fileName = formData.get("fileName") as string

    if (!file) {
      return NextResponse.json(
        { status: 400, message: "No file provided", data: null },
        { status: 400 }
      )
    }

    console.log("[Admin Upload API] File:", fileName, "Folder:", folderName, "Size:", file.size)

    // Step 1: Get presigned URL from API
    const presignedResponse = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent(folderName)}&fileName=${encodeURIComponent(fileName)}`,
      {
        method: "POST",
        headers: {
          "Authorization": authHeader,
        },
      }
    )

    const presignedData = await presignedResponse.json()
    console.log("[Admin Upload API] Presigned URL response status:", presignedData.status)

    if (presignedData.status !== 200 || !presignedData.data) {
      console.error("[Admin Upload API] Failed to get presigned URL:", presignedData)
      return NextResponse.json(presignedData, { status: presignedResponse.ok ? 200 : presignedResponse.status })
    }

    const presignedUrl = presignedData.data
    
    // Extract the base S3 URL (without query params) - this is the final public URL
    const baseS3Url = presignedUrl.split("?")[0]
    console.log("[Admin Upload API] Base S3 URL:", baseS3Url)

    // Step 2: Upload the file to the presigned URL
    const fileBuffer = await file.arrayBuffer()
    
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: fileBuffer,
    })

    console.log("[Admin Upload API] S3 upload status:", uploadResponse.status)

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("[Admin Upload API] S3 upload failed:", errorText)
      return NextResponse.json(
        { status: 500, message: "Failed to upload file to storage", data: null },
        { status: 500 }
      )
    }

    // Return the permanent S3 URL (without query params)
    return NextResponse.json({
      status: 200,
      message: "File uploaded successfully",
      data: baseS3Url,
    })
  } catch (error) {
    console.error("[Admin Upload API] Error:", error)
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
