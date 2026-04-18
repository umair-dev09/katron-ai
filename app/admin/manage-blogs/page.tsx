"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminProtectedGuard } from "@/components/admin/admin-auth-guard"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Type,
  User,
  Tag,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Filter,
  Upload,
  Save,
  Globe,
  EyeOff,
  Settings,
  Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { resolveFileUrl } from "@/lib/api/storage"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

interface BlogAuthor {
  id: number
  name: string
  bio?: string
  avatar?: string
}

interface BlogCategory {
  id: number
  name: string
}

interface RawApiTag {
  id: number
  name: string
  slug: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  subtitle?: string
  excerpt: string
  content: string
  featuredImage: string
  featuredImageAlt?: string
  thumbnailImage?: string
  category: string | { id: number; name: string; slug?: string }
  tags?: RawApiTag[]
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

function extractCategoryName(category: unknown): string {
  if (!category) return ""
  if (typeof category === "string") return category
  if (typeof category === "object") {
    const obj = category as Record<string, unknown>
    return (obj.name as string) || ""
  }
  return ""
}

function extractStoredKey(apiData: unknown, fallback: string): string {
  if (typeof apiData !== "string" || !apiData) return fallback
  if (!apiData.startsWith("http")) {
    const last = apiData.split("/").filter(Boolean).pop()
    return last || fallback
  }
  try {
    const pathname = decodeURIComponent(new URL(apiData).pathname)
    const lastSegment = pathname.split("/").filter(Boolean).pop()
    return lastSegment || fallback
  } catch {
    return fallback
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function ManageBlogsContent() {
  const { logout } = useAdminAuth()
  const router = useRouter()

  // List State
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Edit State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    featuredImageAlt: "",
    category: "",
    tags: "",
    authorId: "",
    metaTitle: "",
    metaDescription: "",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    featured: false,
    readingTime: 5,
  })
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState("")

  // Delete State
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Preview State
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [previewContent, setPreviewContent] = useState("")

  // Categories + Authors
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [authors, setAuthors] = useState<BlogAuthor[]>([])

  // Manage Categories/Authors State
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)
  const [showAuthorsDialog, setShowAuthorsDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newAuthorData, setNewAuthorData] = useState({ name: "", bio: "", avatar: "" })
  const [isManagingAuthCat, setIsManagingAuthCat] = useState(false)
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null)
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState("")

  // Image preview URLs map for the list
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({})

  const getToken = () => localStorage.getItem("admin_auth_token")

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = getToken()
      const qs = new URLSearchParams()
      qs.set("page", String(currentPage + 1))
      qs.set("pageSize", String(pageSize))
      qs.set("sortBy", "createdAt")
      qs.set("sortOrder", "DESC")

      if (statusFilter !== "ALL") qs.set("status", statusFilter)
      else qs.set("status", "PUBLISHED") // Default to published
      if (categoryFilter !== "ALL") qs.set("category", categoryFilter)
      if (searchQuery.trim()) qs.set("search", searchQuery.trim())

      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?${qs.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })
      const data = await res.json()

      if (data?.status === 200 && data?.data) {
        const pageData = data.data
        const rawBlogs: BlogPost[] = pageData.content ?? []
        setBlogs(rawBlogs)
        setTotalPages(pageData.totalPages ?? 0)
        setTotalElements(pageData.totalElements ?? 0)

        // Resolve image URLs in parallel
        const urls: Record<number, string> = {}
        await Promise.all(
          rawBlogs.map(async (blog) => {
            if (blog.featuredImage) {
              urls[blog.id] = await resolveFileUrl(blog.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token || undefined)
            }
          })
        )
        setImageUrls(urls)
      } else {
        // Try fetching all statuses if the specific filter returned nothing
        if (statusFilter !== "ALL") {
          setBlogs([])
          setTotalPages(0)
          setTotalElements(0)
        }
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      toast.error("Failed to load blogs")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter, categoryFilter, searchQuery])

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listCategories`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.status === 200 && Array.isArray(data.data)) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  // Fetch authors
  const fetchAuthors = async () => {
    try {
      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.status === 200 && Array.isArray(data.data)) {
        const adminToken = getToken() || undefined
        const resolved = await Promise.all(
          data.data.map(async (author: BlogAuthor) => ({
            ...author,
            avatar: author.avatar
              ? await resolveFileUrl(author.avatar, "FOLDER_TYPE_BLOG_AUTHOR_AVATAR", adminToken)
              : undefined,
          }))
        )
        setAuthors(resolved)
      }
    } catch (error) {
      console.error("Failed to fetch authors:", error)
    }
  }

  const checkIfCategoryInUse = async (categoryName: string) => {
    try {
      for (const status of ["PUBLISHED", "DRAFT", "ARCHIVED"]) {
        const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?page=1&pageSize=1&category=${encodeURIComponent(categoryName)}&status=${status}`)
        const data = await res.json()
        if (data?.data?.totalElements > 0) return true
      }
      return false
    } catch {
      return true
    }
  }

  const checkIfAuthorInUse = async (authorId: number) => {
    try {
      for(const status of ["PUBLISHED", "DRAFT", "ARCHIVED"]) {
         const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listBlogs?page=1&pageSize=1000&status=${status}`)
         const data = await res.json()
         if (data?.data?.content) {
             const blogs: BlogPost[] = data.data.content
             if (blogs.some(b => b.authorId === authorId || b.author?.id === authorId)) {
                 return true
             }
         }
      }
      return false
    } catch {
       return true
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    setIsManagingAuthCat(true)
    try {
      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Category created successfully")
        setNewCategoryName("")
        fetchCategories()
      } else {
        toast.error(data.message || "Failed to create category (API might not be available)")
      }
    } catch(e) {
      toast.error("Error creating category")
    } finally {
      setIsManagingAuthCat(false)
    }
  }

  const handleDeleteCategory = async (cat: BlogCategory) => {
    setIsManagingAuthCat(true)
    try {
      const inUse = await checkIfCategoryInUse(cat.name)
      if (inUse) {
        toast.error("Cannot delete category because it is linked to one or more blogs.")
        return
      }

      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/deleteCategory?categoryId=${cat.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok || data.status === 200) {
        toast.success("Category deleted successfully")
        fetchCategories()
      } else {
        toast.error(data.message || "Failed to delete category (API might not be available)")
      }
    } catch(e) {
      toast.error("Error deleting category")
    } finally {
      setIsManagingAuthCat(false)
    }
  }

  const handleCreateAuthor = async () => {
    if (!newAuthorData.name.trim()) return
    setIsManagingAuthCat(true)

    try {
      const token = getToken()
      let finalAvatarUrl = ""

      if (authorAvatarFile) {
        const uniqueFileName = `${Date.now()}-${authorAvatarFile.name.replace(/\s+/g, "-")}`
        const presignRes = await fetch(
          `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent("FOLDER_TYPE_BLOG_AUTHOR_AVATAR")}&fileName=${encodeURIComponent(uniqueFileName)}`,
          { method: "POST", headers: { Authorization: `Bearer ${token}` } }
        )
        const presignData = await presignRes.json()
        if (presignData.status === 200 && presignData.data) {
          const s3Res = await fetch(presignData.data, {
            method: "PUT",
            headers: { "Content-Type": authorAvatarFile.type || "image/png" },
            body: authorAvatarFile,
          })
          if (s3Res.ok) {
            finalAvatarUrl = extractStoredKey(presignData.data, uniqueFileName)
          }
        }
      }

      const payload = {
        name: newAuthorData.name.trim(),
        bio: newAuthorData.bio.trim(),
        avatar: finalAvatarUrl
      }

      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createBlogAuthor`, {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok || data?.status === 200) {
        toast.success("Author created successfully")
        setNewAuthorData({ name: "", bio: "", avatar: "" })
        setAuthorAvatarFile(null)
        setAuthorAvatarPreview("")
        fetchAuthors()
      } else {
        toast.error(data.message || "Failed to create author")
      }
    } catch(e) {
      toast.error("Error creating author")
    } finally {
      setIsManagingAuthCat(false)
    }
  }

  const handleDeleteAuthor = async (author: BlogAuthor) => {
    setIsManagingAuthCat(true)
    try {
      const inUse = await checkIfAuthorInUse(author.id)
      if (inUse) {
        toast.error("Cannot delete author because they are linked to one or more blogs.")
        return
      }

      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/deleteAuthor?authorId=${author.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok || data.status === 200) {
        toast.success("Author deleted successfully")
        fetchAuthors()
      } else {
        toast.error(data.message || "Failed to delete author (API might not be available)")
      }
    } catch(e) {
      toast.error("Error deleting author")
    } finally {
      setIsManagingAuthCat(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [])

  // Open Edit Dialog
  const openEditDialog = async (blog: BlogPost) => {
    const catName = extractCategoryName(blog.category)
    const tagNames = Array.isArray(blog.tags)
      ? blog.tags.map((t) => t.name).join(", ")
      : Array.isArray(blog.tagList)
        ? blog.tagList.join(", ")
        : ""

    setEditFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      subtitle: blog.subtitle || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featuredImage: blog.featuredImage || "",
      featuredImageAlt: blog.featuredImageAlt || "",
      category: catName,
      tags: tagNames,
      authorId: blog.authorId ? String(blog.authorId) : blog.author?.id ? String(blog.author.id) : "",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      status: blog.status || "PUBLISHED",
      featured: blog.featured || false,
      readingTime: blog.readingTime || 5,
    })

    // Resolve the featured image for previewing
    if (blog.featuredImage) {
      const token = getToken()
      const url = await resolveFileUrl(blog.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token || undefined)
      setEditImagePreviewUrl(url)
    } else {
      setEditImagePreviewUrl("")
    }

    setEditingBlog(blog)
    setShowEditDialog(true)
  }

  // Handle Image Upload in Edit
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const token = getToken()
      const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
      const contentType = file.type || "image/png"

      const presignRes = await fetch(
        `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent("FOLDER_TYPE_BLOG_ASSETS")}&fileName=${encodeURIComponent(uniqueFileName)}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      )
      const presignData = await presignRes.json()

      if (presignData.status !== 200 || !presignData.data) {
        toast.error(presignData.message || "Failed to get upload URL")
        return
      }

      const s3Res = await fetch(presignData.data, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      })

      if (!s3Res.ok) {
        toast.error("Failed to upload image to S3")
        return
      }

      const storedKey = extractStoredKey(presignData.data, uniqueFileName)
      const presignedPreviewUrl = await resolveFileUrl(storedKey, "FOLDER_TYPE_BLOG_ASSETS", token || undefined)

      setEditFormData((prev) => ({ ...prev, featuredImage: storedKey }))
      setEditImagePreviewUrl(presignedPreviewUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  // Save Blog Edits
  const handleSaveEdit = async () => {
    if (!editingBlog) return

    setIsUpdating(true)
    try {
      const token = getToken()

      const tagsArray = editFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      const plainText = stripHtml(editFormData.content)
      const wordCount = plainText ? plainText.split(/\s+/).length : 0
      const readingTime = Math.max(1, Math.ceil(wordCount / 200))

      const excerptText = editFormData.excerpt.trim()
      const firstSentence = excerptText.split(/[.!?]/)[0].trim()
      const subtitle = editFormData.subtitle.trim() || firstSentence || excerptText || editFormData.title.trim()

      const updatePayload: Record<string, unknown> = {
        id: editingBlog.id,
        title: editFormData.title.trim(),
        slug: editFormData.slug.trim(),
        subtitle,
        content: editFormData.content,
        excerpt: excerptText,
        featuredImage: editFormData.featuredImage,
        featuredImageAlt: editFormData.featuredImageAlt.trim() || editFormData.title.trim(),
        thumbnailImage: editFormData.featuredImage,
        category: editFormData.category,
        tagList: tagsArray,
        metaTitle: editFormData.metaTitle.trim() || editFormData.title.trim(),
        metaDescription: editFormData.metaDescription.trim() || excerptText,
        metaKeywordList: tagsArray,
        status: editFormData.status,
        featured: editFormData.featured,
        readingTime,
      }

      if (editFormData.authorId) {
        updatePayload.authorId = parseInt(editFormData.authorId)
      }

      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/updateBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      })

      const rawBody = await res.text()
      let data: Record<string, unknown> = {}
      try {
        data = rawBody ? JSON.parse(rawBody) : {}
      } catch {
        console.error("Non-JSON response:", rawBody.slice(0, 500))
      }

      if (data.status === 200 || res.ok) {
        toast.success("Blog updated successfully!")
        setShowEditDialog(false)
        setEditingBlog(null)
        fetchBlogs()
      } else {
        const apiError = (data.message as string) || rawBody.slice(0, 200) || `HTTP ${res.status}`
        toast.error(`Failed to update: ${apiError}`)
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update blog")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle Status Change
  const handleStatusChange = async (blog: BlogPost, newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    try {
      const token = getToken()
      const res = await fetch(
        `${EXTERNAL_API_BASE_URL}/api/blogs/changeStatusOfTheBlog?blogId=${blog.id}&blogStatus=${newStatus}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data.status === 200 || res.ok) {
        toast.success(`Blog status changed to ${newStatus}`)
        fetchBlogs()
      } else {
        toast.error(data.message || "Failed to change status")
      }
    } catch (error) {
      console.error("Status change error:", error)
      toast.error("Failed to change blog status")
    }
  }

  // Delete Blog
  const handleDelete = async () => {
    if (!deletingBlog) return

    setIsDeleting(true)
    try {
      const token = getToken()
      const res = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/deleteBlog?blogId=${deletingBlog.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.status === 200 || res.ok) {
        toast.success("Blog deleted successfully")
        setShowDeleteDialog(false)
        setDeletingBlog(null)
        fetchBlogs()
      } else {
        toast.error(data.message || "Failed to delete blog")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete blog")
    } finally {
      setIsDeleting(false)
    }
  }

  // Preview Blog
  const openPreview = async (blog: BlogPost) => {
    setPreviewBlog(blog)
    const token = getToken()
    if (blog.featuredImage) {
      const url = await resolveFileUrl(blog.featuredImage, "FOLDER_TYPE_BLOG_ASSETS", token || undefined)
      setPreviewImageUrl(url)
    } else {
      setPreviewImageUrl("")
    }
    // Resolve images inside blog content
    setPreviewContent(blog.content || "")
    setShowPreviewDialog(true)
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/auth")
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-600/10 text-green-600 border-green-600/20 hover:bg-green-600/20"><Globe className="h-3 w-3 mr-1" />Published</Badge>
      case "DRAFT":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>
      case "ARCHIVED":
        return <Badge variant="outline" className="bg-muted text-muted-foreground"><Archive className="h-3 w-3 mr-1" />Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  // Content stats for editor
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const editPlainText = stripHtml(editFormData.content)
  const editWordCount = editPlainText ? editPlainText.split(/\s+/).length : 0
  const editReadingTime = Math.max(1, Math.ceil(editWordCount / 200))

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm hidden sm:inline">Back to Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-border" />
                <Image
                  src="/katron-ai-logo-bg-transparent.png"
                  alt="Katron AI"
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchBlogs()}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reload blog list</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowCategoriesDialog(true)} className="gap-2">
                       <Tag className="h-4 w-4" />
                       <span className="hidden xl:inline">Categories</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Manage Categories</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowAuthorsDialog(true)} className="gap-2">
                       <User className="h-4 w-4" />
                       <span className="hidden xl:inline">Authors</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Manage Authors</TooltipContent>
                </Tooltip>

                <Link href="/admin/create-blog">
                  <Button size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">New Blog</span>
                  </Button>
                </Link>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign out of admin</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                Manage Blog Posts
              </h1>
              <p className="text-muted-foreground mt-2">
                View, edit, delete, and manage status of all blog posts • {totalElements} total posts
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(0)
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v)
                      setCurrentPage(0)
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Category Filter */}
                  <Select
                    value={categoryFilter}
                    onValueChange={(v) => {
                      setCategoryFilter(v)
                      setCurrentPage(0)
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blog List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">No blog posts found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? "Try a different search term" : "Create your first blog post to get started"}
                  </p>
                  <Link href="/admin/create-blog" className="mt-4">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      Create Blog Post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : viewMode === "list" ? (
              /* List View */
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="group hover:border-primary/30 hover:shadow-sm transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="hidden sm:block w-24 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {imageUrls[blog.id] ? (
                            <img
                              src={imageUrls[blog.id]}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {blog.excerpt || blog.subtitle || "No excerpt"}
                              </p>
                            </div>

                            {/* Actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => openPreview(blog)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(blog)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {blog.status !== "PUBLISHED" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(blog, "PUBLISHED")}>
                                    <Globe className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                {blog.status !== "DRAFT" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(blog, "DRAFT")}>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Move to Draft
                                  </DropdownMenuItem>
                                )}
                                {blog.status !== "ARCHIVED" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(blog, "ARCHIVED")}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setDeletingBlog(blog)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {statusBadge(blog.status)}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {extractCategoryName(blog.category) || "Uncategorized"}
                            </span>
                            {blog.author?.name && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {blog.author.name}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(blog.createdAt)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {blog.viewCount ?? 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="group overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                    {/* Image */}
                    <div className="relative h-44 bg-muted overflow-hidden">
                      {imageUrls[blog.id] ? (
                        <img
                          src={imageUrls[blog.id]}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {statusBadge(blog.status)}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {blog.excerpt || blog.subtitle || "No excerpt"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openPreview(blog)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(blog)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {blog.status !== "PUBLISHED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(blog, "PUBLISHED")}>
                                <Globe className="h-4 w-4 mr-2" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            {blog.status !== "DRAFT" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(blog, "DRAFT")}>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Move to Draft
                              </DropdownMenuItem>
                            )}
                            {blog.status !== "ARCHIVED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(blog, "ARCHIVED")}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setDeletingBlog(blog)
                                setShowDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-muted-foreground">
                  Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage < 3 ? i : currentPage - 2 + i
                      if (page >= totalPages) return null
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* =================== EDIT DIALOG =================== */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Edit Blog Post
              </DialogTitle>
              <DialogDescription>Modify any field and save your changes</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => {
                      setEditFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/blog/</span>
                    <Input
                      id="edit-slug"
                      value={editFormData.slug}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Description / Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Category, Tags, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(v) => setEditFormData((prev) => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(v) => setEditFormData((prev) => ({ ...prev, status: v as "DRAFT" | "PUBLISHED" | "ARCHIVED" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Select
                    value={editFormData.authorId}
                    onValueChange={(v) => setEditFormData((prev) => ({ ...prev, authorId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={String(author.id)}>
                          <div className="flex items-center gap-2">
                            {author.avatar ? (
                              <img src={author.avatar} alt={author.name} className="h-5 w-5 rounded-full object-cover" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            {author.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="edit-tags" className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="Comma-separated tags"
                />
                {editFormData.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editFormData.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  Featured Image
                </Label>
                {editImagePreviewUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-border group">
                    <img
                      src={editImagePreviewUrl}
                      alt="Featured"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditFormData((prev) => ({ ...prev, featuredImage: "" }))
                        setEditImagePreviewUrl("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="edit-image-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 border-border hover:border-primary/50 hover:bg-primary/5 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload</p>
                        </>
                      )}
                    </div>
                    <input
                      id="edit-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Content
                  </Label>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Type className="h-3 w-3" />
                      {editWordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {editReadingTime} min
                    </span>
                  </div>
                </div>
                <RichTextEditor
                  content={editFormData.content}
                  onChange={(html) => setEditFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Edit your blog content..."
                  disabled={isUpdating}
                />
              </div>

              {/* SEO */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">SEO Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-metaTitle">Meta Title</Label>
                    <Input
                      id="edit-metaTitle"
                      value={editFormData.metaTitle}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-metaDescription">Meta Description</Label>
                    <Input
                      id="edit-metaDescription"
                      value={editFormData.metaDescription}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isUpdating || isUploading} className="gap-2">
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* =================== DELETE DIALOG =================== */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete Blog Post
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{deletingBlog?.title}&rdquo;? This action cannot be undone.
                The blog post will be permanently removed from the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Permanently
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* =================== PREVIEW DIALOG =================== */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Blog Preview
              </DialogTitle>
              <DialogDescription>
                Preview how this blog post appears
              </DialogDescription>
            </DialogHeader>
            {previewBlog && (
              <div className="mt-4 space-y-6">
                {/* Preview Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg flex-wrap">
                  <div className="flex items-center gap-1.5">{statusBadge(previewBlog.status)}</div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{previewBlog.readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{previewBlog.viewCount ?? 0} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>{extractCategoryName(previewBlog.category)}</span>
                  </div>
                </div>

                {previewImageUrl && (
                  <img
                    src={previewImageUrl}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div className="space-y-4">
                  <h1 className="text-3xl font-bold">{previewBlog.title}</h1>
                  {previewBlog.subtitle && (
                    <p className="text-lg text-muted-foreground">{previewBlog.subtitle}</p>
                  )}
                  <p className="text-muted-foreground leading-relaxed">
                    {previewBlog.excerpt}
                  </p>

                  {previewBlog.author && (
                    <div className="flex items-center gap-3 py-3 border-y">
                      {previewBlog.author.avatar ? (
                        <img src={previewBlog.author.avatar} alt={previewBlog.author.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{previewBlog.author.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(previewBlog.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 prose prose-neutral dark:prose-invert max-w-none">
                    <div
                      className="font-sans"
                      dangerouslySetInnerHTML={{ __html: previewContent }}
                    />
                  </div>

                  {/* Tags */}
                  {previewBlog.tags && previewBlog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {previewBlog.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* =================== CATEGORIES DIALOG =================== */}
        <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Manage Categories
              </DialogTitle>
              <DialogDescription>
                Add new categories or delete existing ones (if unused).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
               <div className="flex items-end gap-2">
                 <div className="flex-1 space-y-1">
                   <Label>New Category Name</Label>
                   <Input 
                     value={newCategoryName} 
                     onChange={(e) => setNewCategoryName(e.target.value)} 
                     placeholder="e.g. Technology" 
                     onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                   />
                 </div>
                 <Button onClick={handleCreateCategory} disabled={isManagingAuthCat || !newCategoryName.trim()}>
                   {isManagingAuthCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                   <span className="ml-2">Add</span>
                 </Button>
               </div>
               
               <div className="border rounded-md max-h-[300px] overflow-y-auto mt-4">
                  {categories.length === 0 ? (
                     <div className="p-4 text-center text-sm text-muted-foreground">No categories found.</div>
                  ) : (
                     <div className="divide-y">
                       {categories.map((cat) => (
                           <div key={cat.id} className="p-3 bg-card hover:bg-muted/50 flex justify-between items-center transition-colors">
                             <span className="text-sm font-medium">{cat.name}</span>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-destructive hover:bg-destructive/10"
                               onClick={() => handleDeleteCategory(cat)}
                               disabled={isManagingAuthCat}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                       ))}
                     </div>
                  )}
               </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowCategoriesDialog(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* =================== AUTHORS DIALOG =================== */}
        <Dialog open={showAuthorsDialog} onOpenChange={setShowAuthorsDialog}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Manage Authors
              </DialogTitle>
              <DialogDescription>
                Add new authors or delete existing ones (if unused).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
               {/* Add Author Form */}
               <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium">Add New Author</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="shrink-0 flex flex-col items-center gap-2">
                        <Label>Avatar</Label>
                        <label className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors ${!authorAvatarPreview ? 'bg-muted' : ''}`}>
                          {authorAvatarPreview ? (
                            <img src={authorAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAuthorAvatarFile(file);
                                setAuthorAvatarPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                     </div>
                     <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <Label>Name <span className="text-destructive">*</span></Label>
                          <Input 
                            value={newAuthorData.name} 
                            onChange={(e) => setNewAuthorData(prev => ({...prev, name: e.target.value}))} 
                            placeholder="Author Name" 
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Bio / Description</Label>
                          <Input 
                            value={newAuthorData.bio} 
                            onChange={(e) => setNewAuthorData(prev => ({...prev, bio: e.target.value}))} 
                            placeholder="Brief bio..." 
                          />
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <Button onClick={handleCreateAuthor} disabled={isManagingAuthCat || !newAuthorData.name.trim()}>
                       {isManagingAuthCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                       <span className="ml-2">Create Author</span>
                     </Button>
                  </div>
               </div>
               
               {/* Author List */}
               <div className="border rounded-md">
                  <div className="bg-muted px-4 py-2 text-sm font-medium">Existing Authors</div>
                  {authors.length === 0 ? (
                     <div className="p-4 text-center text-sm text-muted-foreground">No authors found.</div>
                  ) : (
                     <div className="divide-y max-h-[300px] overflow-y-auto">
                       {authors.map((author) => (
                           <div key={author.id} className="p-3 hover:bg-muted/30 flex justify-between items-center transition-colors">
                             <div className="flex items-center gap-3">
                               {author.avatar ? (
                                  <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border" />
                               ) : (
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                     <span className="text-primary font-medium text-sm">{author.name.charAt(0).toUpperCase()}</span>
                                  </div>
                               )}
                               <div>
                                  <p className="text-sm font-medium">{author.name}</p>
                                  {author.bio && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{author.bio}</p>}
                               </div>
                             </div>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-destructive hover:bg-destructive/10"
                               onClick={() => handleDeleteAuthor(author)}
                               disabled={isManagingAuthCat}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                       ))}
                     </div>
                  )}
               </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowAuthorsDialog(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default function ManageBlogsPage() {
  return (
    <AdminProtectedGuard>
      <ManageBlogsContent />
    </AdminProtectedGuard>
  )
}
