"use client"

import { useState, useEffect, useRef } from "react"
import { User, Mail, Phone, AlertCircle, CheckCircle, Loader2, Badge, Info, Camera, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import PhoneVerificationDialog from "./phone-verification-dialog"
import { cn } from "@/lib/utils"

export default function UserProfileSection() {
  const { user, updateProfile, updateProfilePhoto, uploadProfilePhoto, isLoading, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", about: "" })
  const [originalData, setOriginalData] = useState({ firstname: "", lastname: "", phone: "", about: "" })
  const [errors, setErrors] = useState({ firstname: "", lastname: "", phone: "" })

  // Photo staged locally — only committed on Save
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)

  useEffect(() => {
    if (user) {
      const d = { firstname: user.firstname || "", lastname: user.lastname || "", phone: user.phone || "", about: user.about || "" }
      setFormData(d)
      setOriginalData(d)
    }
  }, [user])

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const fullName = user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : ""

  // What to show in the avatar: pending preview > remove = null > current user photo
  const displayPhoto = removePhoto ? null : (pendingPhotoPreview ?? (user?.profilePhoto || null))

  const validatePhone = (phone: string) => {
    if (!phone) return true
    const phoneRegex = /^[\d\s()+\-]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 9
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field as keyof typeof errors]) setErrors({ ...errors, [field]: "" })
  }

  const hasChanges = () =>
    formData.firstname !== originalData.firstname ||
    formData.lastname !== originalData.lastname ||
    formData.phone !== originalData.phone ||
    formData.about !== originalData.about ||
    pendingPhotoFile !== null ||
    removePhoto

  const validateForm = () => {
    const newErrors = { firstname: "", lastname: "", phone: "" }
    let isValid = true
    if (!formData.firstname.trim()) { newErrors.firstname = "First name is required"; isValid = false }
    else if (formData.firstname.trim().length < 2) { newErrors.firstname = "First name must be at least 2 characters"; isValid = false }
    if (!formData.lastname.trim()) { newErrors.lastname = "Last name is required"; isValid = false }
    else if (formData.lastname.trim().length < 2) { newErrors.lastname = "Last name must be at least 2 characters"; isValid = false }
    // Phone is required by the backend — only enforce when text fields will actually be sent
    const willSaveText =
      formData.firstname !== originalData.firstname ||
      formData.lastname !== originalData.lastname ||
      formData.phone !== originalData.phone ||
      formData.about !== originalData.about
    const effectivePhone = formData.phone.trim() || user?.phone || ""
    if (willSaveText && !effectivePhone) { newErrors.phone = "Phone number is required to save profile changes"; isValid = false }
    else if (formData.phone.trim() && !validatePhone(formData.phone)) { newErrors.phone = "Please enter a valid phone number (at least 9 digits)"; isValid = false }
    setErrors(newErrors)
    return isValid
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF, WebP)")
      return
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return }
    if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview)
    setPendingPhotoFile(file)
    setPendingPhotoPreview(URL.createObjectURL(file))
    setRemovePhoto(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemovePhoto = () => {
    if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview)
    setPendingPhotoFile(null)
    setPendingPhotoPreview(null)
    setRemovePhoto(true)
  }

  const textFieldsChanged = () =>
    formData.firstname !== originalData.firstname ||
    formData.lastname !== originalData.lastname ||
    formData.phone !== originalData.phone ||
    formData.about !== originalData.about

  const handleSave = async () => {
    if (!validateForm()) { toast.error("Please fix the errors before saving"); return }
    setIsSaving(true)
    try {
      // 1. Upload / remove photo if staged
      if (pendingPhotoFile || removePhoto) {
        let photoKey = ""
        if (pendingPhotoFile) {
          const uploadResult = await uploadProfilePhoto(pendingPhotoFile)
          if (!uploadResult.success) { toast.error(uploadResult.message || "Failed to upload photo"); setIsSaving(false); return }
          photoKey = uploadResult.fileName || ""
        }
        const photoResult = await updateProfilePhoto(photoKey)
        if (!photoResult.success) { toast.error(photoResult.message || "Failed to update photo"); setIsSaving(false); return }
      }

      // 2. Only call updateProfile if text fields actually changed.
      // phone is required by the backend — fall back to the user's existing phone
      // so we never send an empty string for that field.
      if (textFieldsChanged()) {
        const phone = formData.phone.trim() || user?.phone || ""
        const result = await updateProfile({
          id: user?.id,
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          phone,
          about: formData.about.trim() || undefined,
        })
        if (!result.success) { toast.error(result.message || "Failed to update profile"); setIsSaving(false); return }
      }

      setOriginalData(formData)
      if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview)
      setPendingPhotoFile(null)
      setPendingPhotoPreview(null)
      setRemovePhoto(false)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
      // No need to call refreshUser() here — both updateProfilePhoto() and
      // updateProfile() already trigger refreshUser() internally.
    } catch (error) {
      console.error("Save error:", error)
      toast.error("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setErrors({ firstname: "", lastname: "", phone: "" })
    if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview)
    setPendingPhotoFile(null)
    setPendingPhotoPreview(null)
    setRemovePhoto(false)
    setIsEditing(false)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto text-sm font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50">
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Photo */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
              <AvatarImage className="object-cover" src={displayPhoto || undefined} alt={fullName || "Profile"} />
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Camera overlay — edit mode only */}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Remove button — edit mode, only when there is a photo */}
            {isEditing && displayPhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isSaving}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handlePhotoSelect} className="hidden" />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Profile Photo</h3>
            {isEditing ? (
              <div className="text-xs text-muted-foreground max-w-[220px] space-y-1">
                <p>Click the photo to choose a new image. JPG, PNG, GIF up to 5MB.</p>
                {pendingPhotoFile && <p className="text-primary font-medium">New photo selected — save to apply.</p>}
                {removePhoto && <p className="text-red-500 font-medium">Photo will be removed on save.</p>}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Click &quot;Edit Profile&quot; to change your photo.</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Type Badge */}
      {user?.accountType && (
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Badge className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {user.accountType === "MERCHANT" ? "Merchant Account" : "Personal Account"}
            </span>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="text" placeholder="Enter first name" value={formData.firstname} onChange={(e) => handleInputChange("firstname", e.target.value)} disabled={!isEditing || isSaving}
                className={cn("pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800", errors.firstname ? "border-red-500" : "focus:border-primary", !isEditing && "cursor-not-allowed opacity-75")} />
            </div>
            {errors.firstname && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstname}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="text" placeholder="Enter last name" value={formData.lastname} onChange={(e) => handleInputChange("lastname", e.target.value)} disabled={!isEditing || isSaving}
                className={cn("pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800", errors.lastname ? "border-red-500" : "focus:border-primary", !isEditing && "cursor-not-allowed opacity-75")} />
            </div>
            {errors.lastname && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastname}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            Email Address
            {user?.emailVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 text-[10px] font-semibold uppercase">
                <CheckCircle className="w-3 h-3" />Verified
              </span>
            )}
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="email" value={user?.email || ""} disabled className="pl-11 h-12 text-sm bg-muted/50 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-75" />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" />Cannot be changed</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="tel" placeholder="Enter phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} disabled={!isEditing || isSaving}
              className={cn("pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800", errors.phone ? "border-red-500" : "focus:border-primary", !isEditing && "cursor-not-allowed opacity-75")} />
          </div>
          {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            About <span className="text-muted-foreground/60">(Optional)</span>
          </label>
          <Textarea placeholder="Tell us a little about yourself..." value={formData.about} onChange={(e) => handleInputChange("about", e.target.value)}
            disabled={!isEditing || isSaving} rows={3} maxLength={500}
            className={cn("text-sm bg-background border-gray-200 dark:border-gray-800 focus:border-primary resize-none", !isEditing && "cursor-not-allowed opacity-75")} />
          {isEditing && <p className="text-xs text-muted-foreground text-right">{formData.about.length}/500 characters</p>}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handleSave} disabled={isSaving || isLoading || !hasChanges()}
            className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
          </Button>
          <Button onClick={handleCancel} variant="outline" disabled={isSaving}
            className="flex-1 sm:flex-none h-11 px-6 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 font-semibold">
            Cancel
          </Button>
        </div>
      )}

      <PhoneVerificationDialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification} phoneNumber={user?.phone} />
    </div>
  )
}
