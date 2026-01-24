"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, User, Upload, X, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface ProfilePhotoUploadProps {
  currentPhoto?: string | null
  userName?: string
  onPhotoChange?: (url: string) => void
}

export default function ProfilePhotoUpload({ currentPhoto, userName, onPhotoChange }: ProfilePhotoUploadProps) {
  const { uploadProfilePhoto, updateProfilePhoto, isLoading } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when currentPhoto changes
  useEffect(() => {
    if (currentPhoto) {
      setPreviewUrl(currentPhoto)
    }
  }, [currentPhoto])

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return "Image size must be less than 5MB"
    }

    return null
  }

  const processFile = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast.error(error)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create preview immediately
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload the file
      const uploadResult = await uploadProfilePhoto(file)
      clearInterval(progressInterval)

      console.log("[ProfilePhoto] Upload result:", uploadResult)

      if (uploadResult.success && uploadResult.url) {
        setUploadProgress(95)
        
        console.log("[ProfilePhoto] Photo URL to save:", uploadResult.url)
        
        // Update user profile with the new photo URL
        const updateResult = await updateProfilePhoto(uploadResult.url)
        
        if (updateResult.success) {
          setUploadProgress(100)
          setPreviewUrl(uploadResult.url)
          onPhotoChange?.(uploadResult.url)
          toast.success("Profile photo updated successfully!")
        } else {
          // Revert preview if update fails
          setPreviewUrl(currentPhoto || null)
          toast.error(updateResult.message || "Failed to update profile photo")
        }
      } else {
        // Revert preview if upload fails
        setPreviewUrl(currentPhoto || null)
        toast.error(uploadResult.message || "Failed to upload photo")
      }

      // Clean up the object URL
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Upload error:", error)
      setPreviewUrl(currentPhoto || null)
      toast.error("An error occurred while uploading your photo")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [currentPhoto, uploadProfilePhoto, updateProfilePhoto, onPhotoChange])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const handleRemovePhoto = async () => {
    if (!previewUrl || isUploading) return

    try {
      setIsUploading(true)
      const result = await updateProfilePhoto("")
      
      if (result.success) {
        setPreviewUrl(null)
        onPhotoChange?.("")
        toast.success("Profile photo removed")
      } else {
        toast.error(result.message || "Failed to remove photo")
      }
    } catch (error) {
      console.error("Remove error:", error)
      toast.error("An error occurred while removing your photo")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Avatar with upload overlay */}
      <div
        className={cn(
          "relative group cursor-pointer rounded-full",
          isDragging && "ring-2 ring-primary ring-offset-2"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg object-cover">
          <AvatarImage className="object-cover" src={previewUrl || undefined} alt={userName || "Profile"} />
          <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-black/60 flex items-center justify-center transition-opacity",
            isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs text-white font-medium">{uploadProgress}%</span>
            </div>
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Remove button */}
        {previewUrl && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRemovePhoto()
            }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || isLoading}
        />
      </div>

      {/* Upload instructions */}
      <div className="text-center sm:text-left space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Profile Photo</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Click or drag and drop to upload a new photo. JPG, PNG, GIF up to 5MB.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isLoading}
          className="h-8 text-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Photo
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
