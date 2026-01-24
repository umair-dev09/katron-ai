"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, AlertCircle, CheckCircle, Loader2, Badge, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import ProfilePhotoUpload from "./profile-photo-upload"
import PhoneVerificationDialog from "./phone-verification-dialog"
import { cn } from "@/lib/utils"

export default function UserProfileSection() {
  const { user, updateProfile, isLoading, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    about: "",
  })
  const [originalData, setOriginalData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    about: "",
  })
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  })

  // Initialize form data from user context
  useEffect(() => {
    if (user) {
      const userData = {
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        phone: user.phone || "",
        about: user.about || "",
      }
      setFormData(userData)
      setOriginalData(userData)
    }
  }, [user])

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true // Phone is optional for validation (but required for saving)
    // Allow various phone formats
    const phoneRegex = /^[\d\s()+\-]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 9
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const hasChanges = () => {
    return (
      formData.firstname !== originalData.firstname ||
      formData.lastname !== originalData.lastname ||
      formData.phone !== originalData.phone ||
      formData.about !== originalData.about
    )
  }

  const validateForm = (): boolean => {
    const newErrors = {
      firstname: "",
      lastname: "",
      phone: "",
    }
    let isValid = true

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required"
      isValid = false
    } else if (formData.firstname.trim().length < 2) {
      newErrors.firstname = "First name must be at least 2 characters"
      isValid = false
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required"
      isValid = false
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters"
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 9 digits)"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving")
      return
    }

    setIsSaving(true)
    try {
      const result = await updateProfile({
        id: user?.id,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        phone: formData.phone.trim(),
        about: formData.about.trim() || undefined,
      })

      if (result.success) {
        setIsEditing(false)
        setOriginalData(formData)
        toast.success(result.message || "Profile updated successfully!")
        // Refresh user data
        await refreshUser()
      } else {
        toast.error(result.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("An error occurred while saving your profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
    setErrors({
      firstname: "",
      lastname: "",
      phone: "",
    })
  }

  const handlePhoneVerified = () => {
    refreshUser()
  }

  const fullName = user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : ""

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full sm:w-auto text-sm font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Photo Section */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <ProfilePhotoUpload
          currentPhoto={user?.profilePhoto}
          userName={fullName}
        />
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
        {/* Name Fields - Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter first name"
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                disabled={!isEditing || isSaving}
                className={cn(
                  "pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                  errors.firstname ? "border-red-500 focus:border-red-500" : "focus:border-primary",
                  !isEditing && "cursor-not-allowed opacity-75"
                )}
              />
            </div>
            {errors.firstname && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstname}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter last name"
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                disabled={!isEditing || isSaving}
                className={cn(
                  "pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                  errors.lastname ? "border-red-500 focus:border-red-500" : "focus:border-primary",
                  !isEditing && "cursor-not-allowed opacity-75"
                )}
              />
            </div>
            {errors.lastname && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.lastname}
              </p>
            )}
          </div>
        </div>

        {/* Email Field - Read Only */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            Email Address
            {user?.emailVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 text-[10px] font-semibold uppercase">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="pl-11 h-12 text-sm bg-muted/50 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-75"
            />
            <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Cannot be changed
              </span>
            </div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            Phone Number
            {user?.phoneVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 text-[10px] font-semibold uppercase">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 text-[10px] font-semibold uppercase">
                <AlertCircle className="w-3 h-3" />
                Not Verified
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing || isSaving}
                className={cn(
                  "pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                  errors.phone ? "border-red-500 focus:border-red-500" : "focus:border-primary",
                  !isEditing && "cursor-not-allowed opacity-75"
                )}
              />
            </div>
            {!user?.phoneVerified && user?.phone && (
              <Button
                type="button"
                onClick={() => setShowPhoneVerification(true)}
                variant="outline"
                className="h-12 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium"
                disabled={isEditing || isSaving || isLoading}
              >
                Verify
              </Button>
            )}
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
          {!user?.phoneVerified && user?.phone && !isEditing && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" />
              Verify your phone number to enable additional features
            </p>
          )}
        </div>

        {/* About Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            About <span className="text-muted-foreground/60">(Optional)</span>
          </label>
          <Textarea
            placeholder="Tell us a little about yourself..."
            value={formData.about}
            onChange={(e) => handleInputChange("about", e.target.value)}
            disabled={!isEditing || isSaving}
            rows={3}
            maxLength={500}
            className={cn(
              "text-sm bg-background border-gray-200 dark:border-gray-800 focus:border-primary resize-none",
              !isEditing && "cursor-not-allowed opacity-75"
            )}
          />
          {isEditing && (
            <p className="text-xs text-muted-foreground text-right">
              {formData.about.length}/500 characters
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || !hasChanges()}
            className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSaving}
            className="flex-1 sm:flex-none h-11 px-6 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 font-semibold"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Phone Verification Dialog */}
      <PhoneVerificationDialog
        open={showPhoneVerification}
        onOpenChange={setShowPhoneVerification}
        phoneNumber={user?.phone}
      />
    </div>
  )
}
