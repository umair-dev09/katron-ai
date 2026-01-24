"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, ArrowLeft, Mail, CheckCircle, Lock, AlertCircle } from "lucide-react"
import { forgotPassword, resetPassword, resendResetPasswordOtp, AuthApiError } from "@/lib/api/auth"
import { cn } from "@/lib/utils"

type Step = "form" | "otp" | "success"

interface ForgotPasswordSectionProps {
  onBackToLogin: () => void
  onResetSuccess: () => void
}

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export function ForgotPasswordSection({ onBackToLogin, onResetSuccess }: ForgotPasswordSectionProps) {
  const [step, setStep] = useState<Step>("form")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tempToken, setTempToken] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

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

  const passwordStrength = calculatePasswordStrength(newPassword)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // Password validation
    if (!newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 1: Submit form and send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const result = await forgotPassword(email.trim().toLowerCase())
      
      if (result.status === 200) {
        // Store the temp token from the response
        const token = result.data?.token
        if (token) {
          setTempToken(token)
        }
        toast.success("Reset code sent to your email!")
        setStep("otp")
        setResendCooldown(60)
        // Focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      } else {
        toast.error(result.message || "Failed to send reset code. Please try again.")
      }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An error occurred. Please try again."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return
    
    if (!tempToken) {
      toast.error("Session expired. Please start over.")
      setStep("form")
      return
    }
    
    setIsLoading(true)
    try {
      const result = await resendResetPasswordOtp(tempToken)
      
      if (result.status === 200) {
        toast.success("Reset code resent successfully!")
        setResendCooldown(60)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      } else {
        toast.error(result.message || "Failed to resend code. Please try again.")
      }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An error occurred. Please try again."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newOtp = [...otp]
    
    // Handle paste
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6)
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || ""
      }
      setOtp(newOtp)
      
      // Focus last filled input
      const focusIndex = Math.min(digits.length - 1, 5)
      inputRefs.current[focusIndex]?.focus()
      return
    }

    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Step 2: Verify OTP and reset password in one go
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }
    
    if (!tempToken) {
      toast.error("Session expired. Please start over.")
      setStep("form")
      setOtp(["", "", "", "", "", ""])
      return
    }
    
    setIsLoading(true)
    try {
      const result = await resetPassword(otpCode, newPassword, confirmPassword, tempToken)
      
      if (result.status === 200) {
        setStep("success")
        toast.success("Password reset successfully!")
        setTempToken(null)
      } else {
        toast.error(result.message || "Failed to reset password. Please try again.")
        // Check for OTP/code errors or access denied (wrong OTP)
        const errorMsg = result.message?.toLowerCase() || ""
        if (errorMsg.includes("otp") || errorMsg.includes("code") || errorMsg.includes("access denied") || errorMsg.includes("invalid")) {
          setOtp(["", "", "", "", "", ""])
          inputRefs.current[0]?.focus()
        }
      }
    } catch (error) {
      const message = error instanceof AuthApiError 
        ? error.message 
        : "An error occurred. Please try again."
      toast.error(message)
      
      // If OTP error or access denied, clear OTP
      const errorMsg = message.toLowerCase()
      if (errorMsg.includes("otp") || errorMsg.includes("code") || errorMsg.includes("invalid") || errorMsg.includes("access denied")) {
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Form Step - Email + New Password + Confirm Password
  if (step === "form") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email and new password. We&apos;ll send you a code to verify.
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
              }}
              disabled={isLoading}
              className={`pl-10 h-10 md:h-11 text-sm md:text-base border ${errors.email ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }))
              }}
              disabled={isLoading}
              className={`pl-10 pr-10 h-10 md:h-11 text-sm md:text-base border ${errors.newPassword ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.newPassword}
            </p>
          )}
          
          {/* Password Strength */}
          {newPassword && (
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
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
              }}
              disabled={isLoading}
              className={cn(
                "pl-10 pr-10 h-10 md:h-11 text-sm md:text-base border transition-colors duration-200",
                errors.confirmPassword ? "border-red-500" : "border-border",
                confirmPassword && newPassword === confirmPassword && "border-green-500",
                "focus:border-primary focus:outline-none"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {confirmPassword && newPassword === confirmPassword && (
              <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 md:h-11 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Code...
            </>
          ) : (
            "Send Verification Code"
          )}
        </Button>

        <p className="text-center text-xs md:text-sm text-muted-foreground">
          Remember your password?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-primary font-semibold hover:underline transition-colors duration-200"
          >
            Sign in
          </button>
        </p>
      </form>
    )
  }

  // OTP Step - Verify and Reset
  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyAndReset} className="space-y-5">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className={cn(
                  "w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold",
                  "border-2 focus:border-primary focus:ring-2 focus:ring-primary/20",
                  digit && "border-primary bg-primary/5"
                )}
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full h-10 md:h-11 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying & Resetting...
              </>
            ) : (
              "Verify & Reset Password"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-foreground font-medium">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Resend Code"}
                </button>
              )}
            </p>
          </div>
        </div>
      </form>
    )
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-600 dark:text-green-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Password Reset!</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>

        <Button
          type="button"
          onClick={onResetSuccess}
          className="w-full h-10 md:h-11 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200"
        >
          Sign In
        </Button>
      </div>
    )
  }

  return null
}
