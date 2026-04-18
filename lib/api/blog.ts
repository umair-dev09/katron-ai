// Blog API Service for Katron AI Gift Card Platform
// Public-facing blog listing and detail API calls

import { EXTERNAL_API_BASE_URL, ApiResponse } from "./auth"
import { resolveFileUrl } from "./storage"

/** Try to get an auth token from localStorage (user or admin) for authenticated API calls. */
function getAvailableAuthToken(): string | undefined {
  if (typeof window === "undefined") return undefined
  return localStorage.getItem("authToken") || localStorage.getItem("admin_auth_token") || undefined
}

// ─── Blog Types ────────────────────────────────────────────────────────────────

export interface BlogAuthor {
  id: number
  name: string
  bio?: string
  avatar?: string
}

export interface BlogCategory {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  subtitle?: string
  excerpt: string
  content: string
  featuredImage: string
  featuredImageAlt?: string
  category: string
  tagList?: string[]
  author?: BlogAuthor
  authorId?: number
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  featured: boolean
  readingTime: number
  metaTitle?: string
  metaDescription?: string
  viewCount?: number
  createdAt: string
  updatedAt?: string
}

export interface BlogListResponse {
  content: BlogPost[]
  totalElements: number
  totalPages: number
  number: number   // current page (0-indexed)
  size: number     // page size
  first: boolean
  last: boolean
  empty: boolean
}

export interface ListBlogsParams {
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED"
  page?: number          // 0-indexed (converted to 1-based internally when calling the API)
  pageSize?: number
  category?: string
  tag?: string           // filter by a single tag (server-side)
  search?: string
  featured?: boolean
  sortBy?: string        // default: "publishedAt"
  sortOrder?: "ASC" | "DESC"  // default: "DESC"
}

// ─── Raw API Types (shape returned by listCategories) ─────────────────────────

interface RawApiTag {
  id: number
  name: string
  slug: string
}

interface RawApiBlog {
  id: number
  title: string
  subtitle: string | null
  content: string
  excerpt: string
  featuredImage: string
  featuredImageAlt: string | null
  thumbnailImage: string | null
  /** Present when coming from /api/blogs/listBlogs — may be a string or nested object */
  category?: string | { id: number; name: string; slug?: string }
  tags: RawApiTag[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED"
  featured: boolean
  viewCount: number
  publishedAt: string | null
  readingTime: number
  slug: string
  createdAt: string
  updatedAt: string
  active: boolean
  author?: {
    id: number
    name: string
    bio?: string
    avatar?: string
  }
}

interface RawApiCategory {
  id: number
  name: string
  blogs: RawApiBlog[]
  createdAt: string
  updatedAt: string
}

// ─── Internal Helpers ──────────────────────────────────────────────────────────
/**
 * The backend returns `category` as either a plain string or a nested object.
 * Always extract just the name string so React can render it without errors.
 */
function extractCategoryName(category: unknown): string {
  if (!category) return ""
  if (typeof category === "string") return category
  if (typeof category === "object") {
    const obj = category as Record<string, unknown>
    return (obj.name as string) || ""
  }
  return ""
}
/**
 * Resolve image src attributes in blog HTML content.
 * Finds <img src="filename.jpg"> tags where src is not a full URL
 * and resolves them to presigned S3 URLs via getGenericFile.
 */
async function resolveContentImages(htmlContent: string, authToken?: string): Promise<string> {
  // Match all img src attributes that are NOT full URLs
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi
  const matches: { fullMatch: string; src: string }[] = []
  let match: RegExpExecArray | null

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const src = match[1]
    // Skip if already a full URL
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) {
      continue
    }
    matches.push({ fullMatch: match[0], src })
  }

  if (matches.length === 0) return htmlContent

  // Resolve all filenames in parallel
  const resolved = await Promise.all(
    matches.map(async (m) => {
      const url = await resolveFileUrl(m.src, "FOLDER_TYPE_BLOG_ASSETS", authToken)
      return { ...m, resolvedUrl: url }
    })
  )

  // Replace in the HTML
  let result = htmlContent
  for (const r of resolved) {
    if (r.resolvedUrl && r.resolvedUrl !== r.src) {
      result = result.replace(r.src, r.resolvedUrl)
    }
  }

  return result
}

/**
 * Normalize a raw blog from the listCategories response into our BlogPost type.
 * categoryName must be threaded in from the parent category object.
 */
function normalizeBlog(raw: RawApiBlog, categoryName: string): BlogPost {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    subtitle: raw.subtitle || undefined,
    excerpt: raw.excerpt,
    content: raw.content,
    featuredImage: raw.featuredImage, // filename — resolved to URL after fetching
    featuredImageAlt: raw.featuredImageAlt || undefined,
    category: categoryName,
    tagList: Array.isArray(raw.tags) ? raw.tags.map((t) => t.name) : [],
    status: raw.status,
    featured: raw.featured,
    readingTime: raw.readingTime,
    metaTitle: raw.metaTitle || undefined,
    metaDescription: raw.metaDescription || undefined,
    viewCount: raw.viewCount,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    author: raw.author ? {
      id: raw.author.id,
      name: raw.author.name,
      bio: raw.author.bio,
      avatar: raw.author.avatar,
    } : undefined,
  }
}

/**
 * Fetch all published blogs by loading listCategories and flattening the nested
 * blogs array from each category. Resolves all featuredImage filenames to full
 * presigned URLs in parallel.
 *
 * Used as a fallback by getBlogBySlug. listPublishedBlogs now uses /api/blogs/listBlogs directly.
 */
async function getAllBlogsFromCategories(): Promise<BlogPost[]> {
  const res = await fetch(
    `${EXTERNAL_API_BASE_URL}/api/blogs/listCategories`,
    { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
  )
  const data = await res.json()
  const rawCategories: RawApiCategory[] = Array.isArray(data?.data) ? data.data : []

  // Flatten: walk each category → walk its blogs → normalize with the category name
  const seen = new Set<number>()
  const blogs: BlogPost[] = []
  for (const cat of rawCategories) {
    if (!Array.isArray(cat.blogs)) continue
    for (const raw of cat.blogs) {
      if (seen.has(raw.id)) continue // de-duplicate (safety)
      seen.add(raw.id)
      if (raw.status === "PUBLISHED") {
        blogs.push(normalizeBlog(raw, cat.name))
      }
    }
  }

  // Resolve all featuredImage filenames → presigned URLs in one parallel batch
  const token = getAvailableAuthToken()
  const resolved = await Promise.all(
    blogs.map(async (blog) => {
      const imageUrl = await resolveFileUrl(blog.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token)
      // Also resolve author avatar if present
      let resolvedAuthor = blog.author
      if (resolvedAuthor?.avatar) {
        resolvedAuthor = {
          ...resolvedAuthor,
          avatar: await resolveFileUrl(resolvedAuthor.avatar, "FOLDER_TYPE_BLOG_AUTHOR_AVATAR", token),
        }
      }
      // Resolve images inside HTML content
      let resolvedContent = blog.content
      if (resolvedContent) {
        resolvedContent = await resolveContentImages(resolvedContent, token)
      }
      return { ...blog, featuredImage: imageUrl, author: resolvedAuthor, content: resolvedContent }
    })
  )

  return resolved
}

// ─── API Functions ─────────────────────────────────────────────────────────────

// ─── Page Helper ──────────────────────────────────────────────────────────────

function emptyPageResult(page: number, size: number): BlogListResponse {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: page,
    size,
    first: page === 0,
    last: true,
    empty: true,
  }
}

/**
 * List published blog posts using the /api/blogs/listBlogs endpoint.
 * Filtering, sorting, and pagination are all handled server-side.
 *
 * @param params.page  0-indexed page number (converted to 1-based internally)
 */
export async function listPublishedBlogs(
  params: ListBlogsParams = {}
): Promise<ApiResponse<BlogListResponse>> {
  const {
    page = 0,
    pageSize = 12,
    category,
    tag,
    search,
    featured,
    sortBy = "publishedAt",
    sortOrder = "DESC",
  } = params

  try {
    // Build query string — the API uses 1-based page numbers
    const qs = new URLSearchParams()
    qs.set("page", String(page + 1))
    qs.set("pageSize", String(pageSize))
    qs.set("status", "PUBLISHED")
    qs.set("sortBy", sortBy)
    qs.set("sortOrder", sortOrder)
    if (category && category !== "All") qs.set("category", category)
    if (tag) qs.set("tag", tag)
    if (search?.trim()) qs.set("search", search.trim())
    if (featured !== undefined) qs.set("featured", String(featured))

    const res = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?${qs.toString()}`,
      { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
    )
    const data = await res.json()

    if (!res.ok || (data?.status && data.status >= 400)) {
      console.error("[Blog API] listBlogs returned error:", data)
      return {
        status: data?.status || res.status,
        message: data?.message || "Failed to fetch blogs",
        data: emptyPageResult(page, pageSize),
      }
    }

    // Handle Spring Page<Blog> wrapped in { status, message, data }
    const pageData = data?.data ?? {}
    const rawBlogs: RawApiBlog[] = pageData.content ?? pageData.blogs ?? pageData.items ?? []
    const totalElements: number = pageData.totalElements ?? rawBlogs.length
    const apiTotalPages: number =
      pageData.totalPages ?? Math.max(1, Math.ceil(totalElements / pageSize))

    // Resolve featured images and author avatars in parallel
    const token = getAvailableAuthToken()
    const blogs = await Promise.all(
      rawBlogs.map(async (raw) => {
        // Extract category name defensively (string or nested object)
        const catName = extractCategoryName(raw.category)

        const blog = normalizeBlog(raw, catName)

        // Resolve featured image key to a presigned URL
        const imageUrl = blog.featuredImage
          ? await resolveFileUrl(blog.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token)
          : ""

        // Resolve author avatar if present
        let resolvedAuthor = blog.author
        if (resolvedAuthor?.avatar) {
          resolvedAuthor = {
            ...resolvedAuthor,
            avatar: await resolveFileUrl(
              resolvedAuthor.avatar,
              "FOLDER_TYPE_BLOG_AUTHOR_AVATAR",
              token
            ),
          }
        }

        return { ...blog, featuredImage: imageUrl, author: resolvedAuthor }
      })
    )

    return {
      status: 200,
      message: "Success",
      data: {
        content: blogs,
        totalElements,
        totalPages: apiTotalPages,
        number: page,
        size: pageSize,
        first: page === 0,
        last: page >= apiTotalPages - 1,
        empty: blogs.length === 0,
      },
    }
  } catch (error) {
    console.error("[Blog API] Error fetching blogs from /listBlogs:", error)
    return {
      status: 500,
      message: "Network error while fetching blogs",
      data: emptyPageResult(page, pageSize),
    }
  }
}

/**
 * Get a single blog post by its slug.
 * Tries the direct getBlogBySlug endpoint first; falls back to getAllBlogsFromCategories.
 */
export async function getBlogBySlug(
  slug: string
): Promise<ApiResponse<BlogPost | null>> {
  try {
    // Try the direct endpoint first
    const res = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/blogs/getBlogBySlug?slug=${encodeURIComponent(slug)}`,
      { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
    )
    const data = await res.json()
    if (res.ok && data?.data?.slug) {
      const token = getAvailableAuthToken()
      const imageUrl = await resolveFileUrl(data.data.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token)
      // Also resolve author avatar if present
      let resolvedAuthor = data.data.author
      if (resolvedAuthor?.avatar) {
        resolvedAuthor = {
          ...resolvedAuthor,
          avatar: await resolveFileUrl(resolvedAuthor.avatar, "FOLDER_TYPE_BLOG_AUTHOR_AVATAR", token),
        }
      }
      // Resolve images in content HTML
      let resolvedContent = data.data.content
      if (resolvedContent) {
        resolvedContent = await resolveContentImages(resolvedContent, token)
      }
      return {
        status: 200,
        message: "Success",
        // Normalize category: API may return an object {id, name, ...} instead of a plain string
        data: {
          ...data.data,
          category: extractCategoryName(data.data.category),
          featuredImage: imageUrl,
          author: resolvedAuthor,
          content: resolvedContent,
        },
      }
    }

    // Fallback: find in categories data (works even when listBlogs is broken)
    const blogs = await getAllBlogsFromCategories()
    const blog = blogs.find((b) => b.slug === slug || b.slug === slug.toLowerCase())
    if (blog) return { status: 200, message: "Success", data: blog }

    return { status: 404, message: "Blog not found", data: null }
  } catch (error) {
    console.error("[Blog API] Error fetching blog by slug:", error)
    return { status: 500, message: "Network error while fetching blog", data: null }
  }
}

/**
 * Get a single blog post by its ID
 */
export async function getBlogById(
  id: number
): Promise<ApiResponse<BlogPost | null>> {
  try {
    const url = `${EXTERNAL_API_BASE_URL}/api/blogs/getBlogById?blogId=${id}`
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    const data = await response.json()

    if (response.ok && data.data) {
      return {
        status: 200,
        message: "Success",
        data: data.data,
      }
    }

    return {
      status: data.status || 404,
      message: data.message || "Blog not found",
      data: null,
    }
  } catch (error) {
    console.error("[Blog API] Error fetching blog by ID:", error)
    return {
      status: 500,
      message: "Network error while fetching blog",
      data: null,
    }
  }
}

/**
 * Increment blog view count
 */
export async function incrementBlogViewCount(blogId: number): Promise<void> {
  try {
    await fetch(
      `${EXTERNAL_API_BASE_URL}/api/blogs/incrementViewCount?blogId=${blogId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("[Blog API] Error incrementing view count:", error)
  }
}

/**
 * List all blog categories
 */
export async function listBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/blogs/listCategories`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    )

    const data = await response.json()

    // Handle different response shapes
    let categories: BlogCategory[] = []
    if (Array.isArray(data?.data)) {
      categories = data.data
    } else if (Array.isArray(data?.data?.content)) {
      categories = data.data.content
    } else if (Array.isArray(data)) {
      categories = data
    }

    return {
      status: 200,
      message: "Success",
      data: categories,
    }
  } catch (error) {
    console.error("[Blog API] Error fetching categories:", error)
    return {
      status: 500,
      message: "Error fetching categories",
      data: [],
    }
  }
}

/**
 * List all blog authors
 */
export async function listBlogAuthors(): Promise<ApiResponse<BlogAuthor[]>> {
  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    )

    const data = await response.json()

    let authors: BlogAuthor[] = []
    if (Array.isArray(data?.data)) {
      authors = data.data
    } else if (Array.isArray(data)) {
      authors = data
    }

    return {
      status: 200,
      message: "Success",
      data: authors,
    }
  } catch (error) {
    console.error("[Blog API] Error fetching authors:", error)
    return {
      status: 500,
      message: "Error fetching authors",
      data: [],
    }
  }
}

/**
 * Format a blog date string for display
 */
export function formatBlogDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  } catch {
    return dateString
  }
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (!minutes || minutes <= 0) return "1 min read"
  return `${minutes} min read`
}
