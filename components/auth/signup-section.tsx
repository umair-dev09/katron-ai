"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { isGoogleAuthConfigured } from "@/components/google-oauth-provider"
import type { RegisterModel } from "@/lib/api/auth"

interface SignupSectionProps {
  userType: "merchant" | "user" | null
  onToggleMode: (mode: "login" | "signup") => void
  onNeedsVerification: (email: string) => void
  onSignupSuccess?: () => void
}

export function SignupSection({ userType, onToggleMode, onNeedsVerification, onSignupSuccess }: SignupSectionProps) {
  const { register, googleLogin, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation (min 9 characters as per API)
    const phoneClean = formData.phone.replace(/\D/g, "")
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (phoneClean.length < 9) {
      newErrors.phone = "Phone number must be at least 9 digits"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    if (!userType) {
      toast.error("Please select an account type")
      return
    }

    setIsLoading(true)
    try {
      const registerData: RegisterModel = {
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.replace(/\D/g, ""), // Remove non-digits
        accountType: userType.toUpperCase() as "MERCHANT" | "USER",
        address: {
          addressLine1: "Not provided", // Default address as it's required by API
          country: "US", // Default country code
        },
      }

      const result = await register(registerData)

      if (result.success || result.needsVerification) {
        toast.success(result.message || "Registration successful! Please verify your email.")
        // Small delay to let the toast show, then redirect
        setTimeout(() => {
          onNeedsVerification(result.email || formData.email)
        }, 500)
      } else {
        toast.error(result.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Google Sign Up Success Handler
  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Failed to get Google credentials. Please try again.")
      return
    }

    if (!userType) {
      toast.error("Please select an account type first")
      return
    }

    setIsGoogleLoading(true)
    try {
      const accountType = userType === "merchant" ? "MERCHANT" : "USER"
      const result = await googleLogin(credentialResponse.credential, accountType)

      if (result.success) {
        toast.success("Account created successfully!")
        if (onSignupSuccess) {
          onSignupSuccess()
        }
      } else if (result.needsVerification) {
        toast.info(result.message || "Please verify your email")
        setTimeout(() => {
          onNeedsVerification(result.email || "")
        }, 500)
      } else {
        toast.error(result.message || "Google signup failed. Please try again.")
      }
    } catch (error) {
      console.error("[GoogleSignup] Error:", error)
      toast.error("Google signup failed. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
  }, [userType, googleLogin, onSignupSuccess, onNeedsVerification])

  // Google Sign Up Error Handler
  const handleGoogleError = useCallback(() => {
    toast.error("Google signup failed. Please try again or use email signup.")
    setIsGoogleLoading(false)
  }, [])

  const loading = isLoading || authLoading || isGoogleLoading
  const googleConfigured = isGoogleAuthConfigured()

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={loading}
            className={`h-10 md:h-11 text-sm md:text-base border ${errors.firstName ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={loading}
            className={`h-10 md:h-11 text-sm md:text-base border ${errors.lastName ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          className={`h-10 md:h-11 text-sm md:text-base border ${errors.email ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={loading}
          className={`h-10 md:h-11 text-sm md:text-base border ${errors.phone ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            className={`h-10 md:h-11 text-sm md:text-base border ${errors.password ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-red-500">{errors.password}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Min 8 chars with uppercase, lowercase & number</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          disabled={loading}
          className={`h-10 md:h-11 text-sm md:text-base border ${errors.confirmPassword ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 md:h-11 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="relative my-3 md:my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      {/* Google Sign Up */}
      {googleConfigured ? (
        <div className="flex justify-center">
          {isGoogleLoading ? (
            <Button
              type="button"
              variant="outline"
              disabled
              className="w-full h-10 md:h-11 rounded-lg"
            >
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Signing up with Google...
            </Button>
          ) : (
            <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&_iframe]:!w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
                logo_alignment="center"
              />
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled
          className="w-full h-10 md:h-11 rounded-lg opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google (Not Configured)
        </Button>
      )}

      <p className="text-center text-xs md:text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onToggleMode("login")}
          className="text-primary font-semibold hover:underline transition-colors duration-200"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
