"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, CheckCircle2, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface EmailVerificationSectionProps {
  email: string
  onVerificationSuccess: () => void
  onBackToLogin: () => void
}

export function EmailVerificationSection({ 
  email, 
  onVerificationSuccess,
  onBackToLogin 
}: EmailVerificationSectionProps) {
  const { verifyEmail, resendVerificationOtp, isLoading } = useAuth()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend button
  useEffect(() => {
    // Start with 60 second cooldown
    setResendCooldown(60)
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== "")) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("")
    
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    setIsVerifying(true)
    try {
      const result = await verifyEmail(otpCode)
      
      if (result.success) {
        toast.success(result.message || "Email verified successfully!")
        onVerificationSuccess()
      } else {
        toast.error(result.message || "Verification failed")
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setIsResending(true)
    try {
      const result = await resendVerificationOtp()
      
      if (result.success) {
        toast.success(result.message || "Verification code sent!")
        setResendCooldown(60)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      } else {
        toast.error(result.message || "Failed to resend code")
      }
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3")

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Verify your email
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-sm md:text-base font-medium text-foreground">
          {maskedEmail}
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-center block">
          Enter verification code
        </Label>
        <div className="flex justify-center gap-2 md:gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isVerifying || isLoading}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-semibold border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
            />
          ))}
        </div>
      </div>

      <Button
        onClick={() => handleVerify()}
        disabled={otp.some(d => d === "") || isVerifying || isLoading}
        className="w-full h-11 md:h-12 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isVerifying || isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verify Email
          </>
        )}
      </Button>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="text-primary hover:text-primary/80 font-medium disabled:opacity-50"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend in {resendCooldown}s
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Code
            </>
          )}
        </Button>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          Wrong email?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-primary font-semibold hover:underline transition-colors duration-200"
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  )
}
