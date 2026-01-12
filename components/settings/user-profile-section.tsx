"use client"

import { useState } from "react"
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function UserProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    password: "********",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s()+\-]+$/
    return phoneRegex.test(phone)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleSave = () => {
    // Validate all fields
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors)
      toast.error("Please fix the errors before saving")
      return
    }

    // Save logic - integrate with backend here
    console.log("Saving user data:", formData)
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values if needed
    setErrors({
      name: "",
      email: "",
      phone: "",
      password: "",
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="text-sm font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              className={`pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800 ${
                errors.name ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              } ${!isEditing ? "cursor-not-allowed opacity-75" : ""}`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className={`pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800 ${
                errors.email ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              } ${!isEditing ? "cursor-not-allowed opacity-75" : ""}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className={`pl-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800 ${
                errors.phone ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              } ${!isEditing ? "cursor-not-allowed opacity-75" : ""}`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={!isEditing}
              className={`pl-11 pr-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800 ${
                errors.password ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              } ${!isEditing ? "cursor-not-allowed opacity-75" : ""}`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              Leave blank to keep your current password
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSave}
            className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Save Changes
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 sm:flex-none h-11 px-6 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 font-semibold"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
