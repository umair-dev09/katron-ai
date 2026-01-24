"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Phone, CheckCircle, Loader2, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface PhoneVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber?: string
}

type Step = "confirm" | "verify" | "success"

export default function PhoneVerificationDialog({
  open,
  onOpenChange,
  phoneNumber,
}: PhoneVerificationDialogProps) {
  const { sendPhoneOtp, verifyPhone, resendPhoneOtp, isLoading } = useAuth()
  const [step, setStep] = useState<Step>("confirm")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Reset after dialog closes
      setTimeout(() => {
        setStep("confirm")
        setOtp(["", "", "", "", "", ""])
        setResendCooldown(0)
      }, 200)
    }
  }, [open])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSendOtp = async () => {
    setIsSending(true)
    try {
      const result = await sendPhoneOtp()
      
      if (result.success) {
        setStep("verify")
        setResendCooldown(60)
        toast.success(result.message || "Verification code sent!")
        // Focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      } else {
        toast.error(result.message || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSending) return
    
    setIsSending(true)
    try {
      const result = await resendPhoneOtp()
      
      if (result.success) {
        setResendCooldown(60)
        setOtp(["", "", "", "", "", ""])
        toast.success(result.message || "Verification code resent!")
        inputRefs.current[0]?.focus()
      } else {
        toast.error(result.message || "Failed to resend code")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("")
    
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete verification code")
      return
    }

    setIsVerifying(true)
    try {
      const result = await verifyPhone(otpCode)
      
      if (result.success) {
        setStep("success")
        toast.success(result.message || "Phone number verified!")
        // Auto close after success
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
      } else {
        toast.error(result.message || "Invalid verification code")
        // Clear OTP and focus first input
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
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
      
      // Focus last filled input or first empty
      const focusIndex = Math.min(digits.length, 5)
      inputRefs.current[focusIndex]?.focus()
      
      // Auto-submit if all digits entered
      if (digits.length === 6) {
        setTimeout(() => handleVerifyOtp(), 100)
      }
      return
    }

    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all filled
    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      setTimeout(() => handleVerifyOtp(), 100)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const maskedPhone = phoneNumber
    ? `${phoneNumber.slice(0, 4)}****${phoneNumber.slice(-3)}`
    : "your phone"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl">Verify Phone Number</DialogTitle>
              <DialogDescription className="text-center">
                We'll send a verification code to <span className="font-medium text-foreground">{maskedPhone}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  A 6-digit verification code will be sent to your phone number via SMS. Standard message rates may apply.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendOtp}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSending || isLoading}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <button
                onClick={() => setStep("confirm")}
                className="absolute left-4 top-4 p-1 rounded-md hover:bg-muted transition-colors"
                disabled={isVerifying}
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <DialogTitle className="text-center text-xl">Enter Verification Code</DialogTitle>
              <DialogDescription className="text-center">
                Enter the 6-digit code sent to {maskedPhone}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {/* OTP Input */}
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
                    disabled={isVerifying}
                    className={cn(
                      "w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold",
                      "border-2 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      digit && "border-primary bg-primary/5"
                    )}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOtp}
                className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
                disabled={otp.join("").length !== 6 || isVerifying || isLoading}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Phone Number"
                )}
              </Button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-foreground font-medium">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={isSending || isLoading}
                      className="text-primary font-medium hover:underline disabled:opacity-50"
                    >
                      {isSending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="w-9 h-9 text-green-600 dark:text-green-500" />
              </div>
              <DialogTitle className="text-center text-xl text-green-600 dark:text-green-500">
                Verified Successfully!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your phone number has been verified. This window will close automatically.
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
