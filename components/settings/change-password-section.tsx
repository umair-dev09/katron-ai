"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export default function ChangePasswordSection() {
  const { changePassword, isLoading } = useAuth()
  const [isChanging, setIsChanging] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" }
    if (score <= 4) return { score: 2, label: "Medium", color: "bg-yellow-500" }
    if (score <= 5) return { score: 3, label: "Strong", color: "bg-green-500" }
    return { score: 4, label: "Very Strong", color: "bg-green-600" }
  }

  const passwordStrength = calculatePasswordStrength(formData.newPassword)

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" })
    }
    // Reset success state when user starts typing
    if (isSuccess) {
      setIsSuccess(false)
    }
  }

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      isValid = false
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from current password"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setIsChanging(true)
    try {
      const result = await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })

      if (result.success) {
        setIsSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast.success(result.message || "Password changed successfully!")
      } else {
        toast.error(result.message || "Failed to change password")
        if (result.message?.toLowerCase().includes("current") || 
            result.message?.toLowerCase().includes("incorrect") ||
            result.message?.toLowerCase().includes("wrong")) {
          setErrors({ ...errors, currentPassword: "Incorrect password" })
        }
      }
    } catch (error) {
      console.error("Change password error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsChanging(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsSuccess(false)
  }

  const hasChanges = formData.currentPassword || formData.newPassword || formData.confirmPassword

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Change Password</h2>
          <p className="text-xs text-muted-foreground">Update your password to keep your account secure</p>
        </div>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            <p className="text-sm font-medium text-green-600 dark:text-green-500">
              Password changed successfully!
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              disabled={isChanging || isLoading}
              className={cn(
                "pl-11 pr-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                errors.currentPassword ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("current")}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPasswords.new ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              disabled={isChanging || isLoading}
              className={cn(
                "pl-11 pr-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                errors.newPassword ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("new")}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.newPassword}
            </p>
          )}
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      passwordStrength.color
                    )}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  passwordStrength.score <= 1 && "text-red-500",
                  passwordStrength.score === 2 && "text-yellow-500",
                  passwordStrength.score >= 3 && "text-green-500"
                )}>
                  {passwordStrength.label}
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className={cn(formData.newPassword.length >= 8 && "text-green-500")}>
                  • At least 8 characters
                </li>
                <li className={cn(/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) && "text-green-500")}>
                  • Upper and lowercase letters
                </li>
                <li className={cn(/[0-9]/.test(formData.newPassword) && "text-green-500")}>
                  • At least one number
                </li>
                <li className={cn(/[^a-zA-Z0-9]/.test(formData.newPassword) && "text-green-500")}>
                  • At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={isChanging || isLoading}
              className={cn(
                "pl-11 pr-11 h-12 text-sm bg-background border-gray-200 dark:border-gray-800",
                errors.confirmPassword ? "border-red-500 focus:border-red-500" : "focus:border-primary",
                formData.confirmPassword && 
                  formData.newPassword === formData.confirmPassword && 
                  "border-green-500 focus:border-green-500"
              )}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirm")}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isChanging || isLoading}
              className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isChanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isChanging || isLoading}
              className="flex-1 sm:flex-none h-11 px-6 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 font-semibold"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
