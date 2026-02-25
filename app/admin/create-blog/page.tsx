"use client"

import { useState, useEffect } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  LogOut, 
  ArrowLeft, 
  Image as ImageIcon, 
  FileText, 
  Eye,
  X,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Hash,
  Type,
  User,
  Tag,
  Sparkles,
  Save,
  Upload,
  Info,
  CheckCircle2,
  XCircle
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
import { Progress } from "@/components/ui/progress"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

interface BlogAuthor {
  id: number
  name: string
  bio?: string
  avatar?: string // API uses 'avatar' not 'avatarUrl'
}

interface BlogCategory {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

function CreateBlogContent() {
  const { logout } = useAdminAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [authors, setAuthors] = useState<BlogAuthor[]>([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true)
  const [showCreateAuthor, setShowCreateAuthor] = useState(false)
  const [newAuthor, setNewAuthor] = useState({ name: "", bio: "", avatar: "" })
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false)
  
  // Categories state
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "", // Maps to 'excerpt' in API
    content: "",
    blogImage: "", // Maps to 'featuredImage' in API
    category: "",
    tags: "", // Maps to 'tagList' in API
    authorId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Computed values for UI feedback
  const isBusy = isSubmitting || isUploading || isUploadingAvatar || isCreatingAuthor
  const isLoading = isLoadingAuthors || isLoadingCategories
  
  // Content statistics - strip HTML tags for accurate word count
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const plainTextContent = stripHtml(formData.content)
  const wordCount = plainTextContent ? plainTextContent.split(/\s+/).length : 0
  const charCount = plainTextContent.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  
  // Check if content has actual text (not just empty HTML tags)
  const hasContent = plainTextContent.length > 0
  
  // Form completion tracking
  const requiredFields = {
    title: !!formData.title.trim(),
    slug: !!formData.slug.trim(),
    description: !!formData.description.trim(),
    content: hasContent,
    blogImage: !!formData.blogImage,
    category: !!formData.category,
  }
  const completedFields = Object.values(requiredFields).filter(Boolean).length
  const totalRequiredFields = Object.keys(requiredFields).length
  const completionPercentage = Math.round((completedFields / totalRequiredFields) * 100)
  const isFormComplete = completedFields === totalRequiredFields
  
  // Parse tags for display
  const parsedTags = formData.tags
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }))
    }
  }, [formData.title])

  // Fetch authors and categories on mount
  useEffect(() => {
    fetchAuthors()
    fetchCategories()
  }, [])

  const fetchAuthors = async () => {
    setIsLoadingAuthors(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listAuthors`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.status === 200 && Array.isArray(data.data)) {
        setAuthors(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch authors:", error)
    } finally {
      setIsLoadingAuthors(false)
    }
  }

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/listCategories`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      // Handle different response structures
      if (data.status === 200 && Array.isArray(data.data)) {
        setCategories(data.data)
      } else if (Array.isArray(data)) {
        setCategories(data)
      } else if (data.data && Array.isArray(data.data.content)) {
        // Paginated response
        setCategories(data.data.content)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      // Step 1: Get presigned URL from API
      const presignedResponse = await fetch(
        `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent("FOLDER_TYPE_BLOG_ASSETS")}&fileName=${encodeURIComponent(uniqueFileName)}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const presignedData = await presignedResponse.json()

      if (presignedData.status !== 200 || !presignedData.data) {
        toast.error(presignedData.message || "Failed to get upload URL")
        return
      }

      const presignedUrl = presignedData.data
      const baseS3Url = presignedUrl.split("?")[0]

      // Step 2: Upload file directly to S3
      const fileBuffer = await file.arrayBuffer()
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: fileBuffer,
      })

      if (!uploadResponse.ok) {
        toast.error("Failed to upload file to storage")
        return
      }

      setFormData(prev => ({ ...prev, blogImage: baseS3Url }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, blogImage: "" }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 2MB for avatars)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image should be less than 2MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      const uniqueFileName = `avatar-${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      // Step 1: Get presigned URL from API
      const presignedResponse = await fetch(
        `${EXTERNAL_API_BASE_URL}/api/storage/uploadGenericFile?folderName=${encodeURIComponent("FOLDER_TYPE_BLOG_AUTHOR_AVATAR")}&fileName=${encodeURIComponent(uniqueFileName)}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const presignedData = await presignedResponse.json()

      if (presignedData.status !== 200 || !presignedData.data) {
        toast.error(presignedData.message || "Failed to get upload URL")
        return
      }

      const presignedUrl = presignedData.data
      const baseS3Url = presignedUrl.split("?")[0]

      // Step 2: Upload file directly to S3
      const fileBuffer = await file.arrayBuffer()
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: fileBuffer,
      })

      if (!uploadResponse.ok) {
        toast.error("Failed to upload avatar to storage")
        return
      }

      setNewAuthor(prev => ({ ...prev, avatar: baseS3Url }))
      toast.success("Avatar uploaded successfully")
    } catch (error) {
      console.error("Avatar upload error:", error)
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = () => {
    setNewAuthor(prev => ({ ...prev, avatar: "" }))
  }

  const handleCreateAuthor = async () => {
    if (!newAuthor.name.trim()) {
      toast.error("Author name is required")
      return
    }

    setIsCreatingAuthor(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createBlogAuthor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newAuthor.name,
          bio: newAuthor.bio || undefined,
          avatar: newAuthor.avatar || undefined,
        }),
      })

      const data = await response.json()
      console.log("[Create Author] Response:", data)
      
      if (data.status === 200) {
        toast.success("Author created successfully")
        setShowCreateAuthor(false)
        setNewAuthor({ name: "", bio: "", avatar: "" })
        await fetchAuthors()
        // Select the newly created author
        if (data.data?.id) {
          setFormData(prev => ({ ...prev, authorId: String(data.data.id) }))
        }
      } else {
        toast.error(data.message || "Failed to create author")
      }
    } catch (error) {
      console.error("Create author error:", error)
      toast.error("Failed to create author")
    } finally {
      setIsCreatingAuthor(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }
    
    if (!formData.blogImage) {
      newErrors.blogImage = "Featured image is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("admin_auth_token")
      
      // Parse tags into array
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Calculate reading time (approx words per minute)
      const wordCount = formData.content.split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(wordCount / 200))

      // Map to API field names
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        subtitle: "", // Optional
        excerpt: formData.description, // API uses 'excerpt' not 'description'
        content: formData.content,
        featuredImage: formData.blogImage, // API uses 'featuredImage' not 'blogImage'
        featuredImageAlt: formData.title, // Alt text for image
        category: formData.category,
        tagList: tagsArray.length > 0 ? tagsArray : undefined, // API uses 'tagList' not 'tags'
        authorId: formData.authorId ? parseInt(formData.authorId) : undefined,
        status: "PUBLISHED", // DRAFT, PUBLISHED, or ARCHIVED
        featured: false,
        readingTime: readingTime,
        metaTitle: formData.title,
        metaDescription: formData.description,
      }

      console.log("Publishing blog:", blogData)

      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/blogs/createBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      })

      const data = await response.json()
      
      if (data.status === 200) {
        toast.success("Blog published successfully!")
        router.push("/admin")
      } else {
        toast.error(data.message || "Failed to publish blog")
      }
    } catch (error) {
      console.error("Publish error:", error)
      toast.error("Failed to publish blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/auth")
  }

  // Categories are now fetched from the API

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
              {/* Status Indicators */}
              <div className="hidden md:flex items-center gap-3 mr-2">
                {isBusy && (
                  <Badge variant="secondary" className="gap-1.5 animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Processing...
                  </Badge>
                )}
                {isFormComplete && !isBusy && (
                  <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready to Publish
                  </Badge>
                )}
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    disabled={isBusy}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview your blog post</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    disabled={isBusy}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign out of admin</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Form completion: {completedFields}/{totalRequiredFields} required fields
              </span>
              <span className={`font-medium ${completionPercentage === 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {completionPercentage}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  Create New Blog Post
                </h1>
                <p className="text-muted-foreground mt-2">
                  Write and publish a new blog article for your audience
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 text-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Type className="h-4 w-4" />
                      <span>{wordCount} words</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Total word count</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Estimated reading time</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the main details of your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a compelling title for your blog post"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/blog/</span>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="url-friendly-slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={errors.slug ? "border-destructive" : ""}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.slug}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description / Excerpt <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Write a short summary of your blog post (this appears in previews and search results)"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/300 characters recommended
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>
                    Category <span className="text-destructive">*</span>
                  </Label>
                  {!showNewCategoryInput ? (
                    <div className="space-y-2">
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          if (value === "__create_new__") {
                            setShowNewCategoryInput(true)
                            setFormData(prev => ({ ...prev, category: "" }))
                          } else {
                            handleSelectChange("category", value)
                          }
                        }}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                            </div>
                          ) : (
                            <>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="__create_new__" className="text-primary font-medium">
                                <span className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  Create New Category
                                </span>
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {categories.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} available
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter new category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className={errors.category ? "border-destructive" : ""}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (newCategoryName.trim()) {
                              setFormData(prev => ({ ...prev, category: newCategoryName.trim() }))
                              setShowNewCategoryInput(false)
                              setNewCategoryName("")
                            }
                          }}
                          disabled={!newCategoryName.trim()}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setShowNewCategoryInput(false)
                            setNewCategoryName("")
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter a name for the new category. It will be created when you publish the blog.
                      </p>
                    </div>
                  )}
                  {formData.category && !showNewCategoryInput && !categories.find(c => c.name === formData.category) && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      New category "{formData.category}" will be created
                    </p>
                  )}
                  {errors.category && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="gift cards, rewards, savings (comma separated)"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                  {parsedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parsedTags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas • {parsedTags.length} tag{parsedTags.length !== 1 ? 's' : ''} added
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Featured Image
                  {formData.blogImage && (
                    <Badge variant="outline" className="ml-auto text-green-600 border-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Upload a cover image for your blog post (required)</CardDescription>
              </CardHeader>
              <CardContent>
                {formData.blogImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-border group">
                    <img
                      src={formData.blogImage}
                      alt="Featured image preview"
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleRemoveImage}
                      disabled={isBusy}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      errors.blogImage 
                        ? "border-destructive bg-destructive/5" 
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    } ${isUploading || isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <div className="relative mb-4">
                            <Upload className="h-10 w-10 text-primary" />
                            <Loader2 className="h-5 w-5 text-primary animate-spin absolute -bottom-1 -right-1" />
                          </div>
                          <p className="text-sm font-medium text-primary">Uploading image...</p>
                          <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-muted rounded-full mb-4">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm text-foreground">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading || isBusy}
                    />
                  </label>
                )}
                {errors.blogImage && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <AlertCircle className="h-3 w-3" />
                    {errors.blogImage}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Content
                    </CardTitle>
                    <CardDescription>Write your blog post using the rich text editor below</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Type className="h-4 w-4" />
                      <span>{wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) => {
                      setFormData(prev => ({ ...prev, content: html }))
                      if (errors.content) {
                        setErrors(prev => ({ ...prev, content: "" }))
                      }
                    }}
                    placeholder="Start writing your blog content... Use the toolbar above for formatting."
                    disabled={isBusy}
                    error={!!errors.content}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {charCount} characters • {wordCount} words
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Author
                  <Badge variant="outline" className="ml-2 font-normal">Optional</Badge>
                </CardTitle>
                <CardDescription>Select an existing author or create a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Select Author</Label>
                    <Select
                      value={formData.authorId}
                      onValueChange={(value) => handleSelectChange("authorId", value)}
                      disabled={isLoadingAuthors || isBusy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingAuthors ? "Loading authors..." : "Select an author (optional)"} />
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
                  
                  <Dialog open={showCreateAuthor} onOpenChange={setShowCreateAuthor}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2" disabled={isBusy}>
                        <Plus className="h-4 w-4" />
                        New Author
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Author</DialogTitle>
                        <DialogDescription>
                          Add a new author to your blog
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="authorName">
                            Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="authorName"
                            placeholder="Author name"
                            value={newAuthor.name}
                            onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="authorBio">Bio</Label>
                          <Textarea
                            id="authorBio"
                            placeholder="Short author bio"
                            value={newAuthor.bio}
                            onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Avatar</Label>
                          {newAuthor.avatar ? (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                              <img
                                src={newAuthor.avatar}
                                alt="Author avatar"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-0 right-0 h-6 w-6"
                                onClick={handleRemoveAvatar}
                                type="button"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <label
                              htmlFor="avatar-upload"
                              className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              {isUploadingAvatar ? (
                                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              )}
                              <input
                                id="avatar-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar || isCreatingAuthor}
                              />
                            </label>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {isUploadingAvatar ? "Uploading avatar..." : "Click to upload avatar (max 2MB)"}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateAuthor(false)}
                          disabled={isCreatingAuthor || isUploadingAvatar}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateAuthor}
                          disabled={isCreatingAuthor || isUploadingAvatar || !newAuthor.name.trim()}
                          className="gap-2"
                        >
                          {isCreatingAuthor ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : isUploadingAvatar ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading Avatar...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Create Author
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {authors.length === 0 && !isLoadingAuthors && (
                  <p className="text-xs text-muted-foreground">
                    No authors available yet. Create one using the button above.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Publish Section */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {isFormComplete ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Ready to Publish
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                          Complete Required Fields
                        </>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isFormComplete 
                        ? "Your blog post is ready to be published."
                        : `${totalRequiredFields - completedFields} required field${totalRequiredFields - completedFields !== 1 ? 's' : ''} remaining`
                      }
                    </p>
                    {!isFormComplete && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {!requiredFields.title && <Badge variant="outline" className="text-xs">Title</Badge>}
                        {!requiredFields.slug && <Badge variant="outline" className="text-xs">Slug</Badge>}
                        {!requiredFields.description && <Badge variant="outline" className="text-xs">Description</Badge>}
                        {!requiredFields.content && <Badge variant="outline" className="text-xs">Content</Badge>}
                        {!requiredFields.blogImage && <Badge variant="outline" className="text-xs">Image</Badge>}
                        {!requiredFields.category && <Badge variant="outline" className="text-xs">Category</Badge>}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/admin")}
                      disabled={isBusy}
                      className="flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex-1 sm:flex-none">
                          <Button
                            onClick={handlePublish}
                            disabled={isBusy || !isFormComplete}
                            className="gap-2 min-w-[160px] w-full"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Publishing...
                              </>
                            ) : isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading Image...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Publish Blog
                              </>
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!isFormComplete && (
                        <TooltipContent>
                          Complete all required fields to publish
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Blog Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your blog post will look when published
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Preview Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Type className="h-4 w-4" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              {parsedTags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{parsedTags.length} tags</span>
                </div>
              )}
            </div>
            
            {formData.blogImage && (
              <img
                src={formData.blogImage}
                alt="Featured"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {formData.category && (
                  <Badge variant="default" className="text-sm">
                    {formData.category}
                  </Badge>
                )}
                {formData.category && !categories.find(c => c.name === formData.category) && (
                  <Badge variant="outline" className="text-xs text-primary">
                    <Plus className="h-3 w-3 mr-1" />
                    New Category
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">
                {formData.title || "Untitled Blog Post"}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {formData.description || "No description provided"}
              </p>
              
              {/* Author Preview */}
              {formData.authorId && (
                <div className="flex items-center gap-3 py-3 border-y border-border">
                  {(() => {
                    const selectedAuthor = authors.find(a => String(a.id) === formData.authorId)
                    if (!selectedAuthor) return null
                    return (
                      <>
                        {selectedAuthor.avatar ? (
                          <img src={selectedAuthor.avatar} alt={selectedAuthor.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{selectedAuthor.name}</p>
                          {selectedAuthor.bio && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{selectedAuthor.bio}</p>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
              
              <div className="pt-4 prose prose-neutral dark:prose-invert max-w-none">
                {hasContent ? (
                  <div 
                    className="font-sans"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">No content yet</p>
                )}
              </div>
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {parsedTags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  )
}

export default function CreateBlogPage() {
  return (
    <AdminProtectedGuard>
      <CreateBlogContent />
    </AdminProtectedGuard>
  )
}
