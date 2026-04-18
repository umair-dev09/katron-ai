/**
 * Storage API utilities — shared across blog admin, article display, and user settings.
 *
 * Pattern:
 *   UPLOAD  → POST /api/storage/uploadGenericFile?folderName=...&fileName=...  (raw binary, Content-Type: file.type)
 *             → backend uploads to S3; `data.data` in the response contains the actual S3 key used
 *             → always persist `data.data` (the key the backend actually used), NOT a generated filename
 *   STORE   → save the key returned in data.data (e.g. "FOLDER_TYPE_BLOG_ASSETS/1234-photo.jpg")
 *             NEVER store a presigned URL — it expires after ~10 minutes
 *   DISPLAY → GET /api/storage/getGenericFile?folderName=...&fileName=...
 *             → strip the folderName prefix from the stored key, pass the remainder as fileName
 *             → returns a fresh presigned URL valid for display
 */

import { EXTERNAL_API_BASE_URL } from "./auth"

export type StorageFolderType =
  | "FOLDER_TYPE_BLOG_ASSETS"
  | "FOLDER_TYPE_BLOG_AUTHOR_AVATAR"
  | "FOLDER_TYPE_USER"

export interface UploadResult {
  success: boolean
  /** The plain filename to persist in the backend record (e.g. passed to createBlog, updateUserPhoto). */
  fileName: string
  /**
   * A presigned S3 URL for immediate display.
   * This expires — use resolveFileUrl() on subsequent page loads to get a fresh one.
   */
  presignedDisplayUrl: string
  message?: string
}

/**
 * Upload a file to S3 via the backend storage endpoint.
 * The file is sent as multipart/form-data; the backend handles the S3 PUT internally.
 *
 * @returns UploadResult — use `fileName` for storage and `presignedDisplayUrl` for immediate display.
 */
export async function uploadFile(
  file: File,
  folderType: StorageFolderType,
  authToken: string
): Promise<UploadResult> {
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const contentType = getContentType(uniqueFileName)

  try {
    // Step 1: POST with NO file body — backend generates & returns a presigned S3 PUT URL
    const presignRes = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent(folderType)}&fileName=${encodeURIComponent(uniqueFileName)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        // No body — backend only generates the presigned URL here
      }
    )

    const presignData = await presignRes.json()
    console.log(`[Storage] presigned URL response for "${uniqueFileName}":`, JSON.stringify(presignData))

    if (presignData.status !== 200 || !presignData.data) {
      return { success: false, fileName: "", presignedDisplayUrl: "", message: presignData.message || "Failed to get presigned URL" }
    }

    const presignedPutUrl: string = presignData.data

    // Step 2: PUT the file directly to S3 using the presigned URL.
    // Do NOT include Authorization here — S3 presigned URLs are self-authenticated.
    // Content-Type must match what the backend used when generating the URL (derived from extension).
    console.log(`[Storage] PUT to S3 with Content-Type: ${contentType}`)
    const s3Res = await fetch(presignedPutUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    })

    if (!s3Res.ok) {
      const errText = await s3Res.text().catch(() => "")
      console.error(`[Storage] S3 PUT failed (${s3Res.status}):`, errText)
      return { success: false, fileName: "", presignedDisplayUrl: "", message: `S3 upload failed: ${s3Res.status}` }
    }

    console.log(`[Storage] S3 PUT success for "${uniqueFileName}"`)

    // Extract the storable S3 key from the presigned URL path
    const storedKey = extractStoredKey(presignedPutUrl, uniqueFileName)
    console.log(`[Storage] storedKey to persist: "${storedKey}"`)

    // Fetch a fresh presigned GET URL for immediate display
    const presignedDisplayUrl = await resolveFileUrl(storedKey, folderType, authToken)

    return { success: true, fileName: storedKey, presignedDisplayUrl }
  } catch (err) {
    console.error("[Storage] uploadFile error:", err)
    return { success: false, fileName: "", presignedDisplayUrl: "", message: "Network error during upload" }
  }
}

/** Derive MIME type from filename extension (must match backend presigned URL content-type) */
function getContentType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
  }
  return map[ext] ?? "image/png"
}

/**
 * Resolve a stored filename to a fresh presigned S3 display URL via getGenericFile.
 *
 * - If `fileName` already starts with "http", it is returned unchanged.
 * - If the API call fails, `fileName` is returned as-is so UIs can degrade gracefully.
 * - `authToken` is optional: blog assets are public; user files require auth.
 */
/**
 * Extract the S3 object key to persist from an upload API response.
 *
 * The upload endpoint returns `data.data` which may be:
 *   - A plain S3 key:      "FOLDER_TYPE_BLOG_ASSETS/1234-photo.jpg"  → use as-is
 *   - Just the filename:   "1234-photo.jpg"                          → use as-is
 *   - A presigned URL:     "https://s3.amazonaws.com/...?X-Amz-..." → extract key from URL path
 *   - null/undefined:      fallback to the locally-generated name
 */
function extractStoredKey(apiData: unknown, fallback: string): string {
  if (typeof apiData !== "string" || !apiData) return fallback
  if (!apiData.startsWith("http")) {
    const last = apiData.split("/").filter(Boolean).pop()
    return last || fallback
  }

  // Presigned URL: extract S3 object key from the URL pathname
  try {
    const pathname = decodeURIComponent(new URL(apiData).pathname)
    const lastSegment = pathname.split("/").filter(Boolean).pop()
    return lastSegment || fallback
  } catch {
    return fallback
  }
}

export async function resolveFileUrl(
  fileName: string,
  folderType: StorageFolderType,
  authToken?: string
): Promise<string> {
  if (!fileName || fileName.startsWith("http")) return fileName

  // Strip folder prefix if it was accidentally baked into the filename by the backend.
  // e.g. "FOLDER_TYPE_BLOG_ASSETS/1234-photo.jpg" → "1234-photo.jpg"
  const folderPrefixes = ["FOLDER_TYPE_BLOG_ASSETS/", "FOLDER_TYPE_BLOG_AUTHOR_AVATAR/", "FOLDER_TYPE_USER/"]
  for (const prefix of folderPrefixes) {
    if (fileName.startsWith(prefix)) {
      fileName = fileName.slice(prefix.length)
      break
    }
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`

    // Same endpoint for all folder types — folderName param distinguishes them
    const url = `${EXTERNAL_API_BASE_URL}/api/storage/getGenericFile?folderName=${encodeURIComponent(folderType)}&fileName=${encodeURIComponent(fileName)}`
    console.log(`[Storage] resolveFileUrl GET → ${url}`)
    const res = await fetch(url, { method: "GET", headers, cache: "no-store" })
    const result = await res.json()
    console.log(`[Storage] resolveFileUrl response for "${fileName}":`, JSON.stringify(result))

    if (result?.data && typeof result.data === "string" && result.data.startsWith("http")) {
      return result.data
    }
    // Resolution failed — return the raw filename so callers can decide what to show
    console.warn(`[Storage] resolveFileUrl: could not resolve "${fileName}" — result.data was:`, result?.data)
    return fileName
  } catch (err) {
    console.error(`[Storage] resolveFileUrl error for "${fileName}":`, err)
    return fileName
  }
}
