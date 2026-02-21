"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth-context"

interface AdminLoginFormProps {
  onLoginSuccess: () => void
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const { login, isLoading: authLoading } = useAdminAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const result = await login(email.trim().toLowerCase(), password)

      if (result.success) {
        toast.success(result.message || "Welcome to the admin portal!")
        onLoginSuccess()
      } else {
        toast.error(result.message || "Login failed. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loading = isLoading || authLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="admin-email" className="text-sm font-medium">
          Admin Email
        </Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
          }}
          disabled={loading}
          className={`h-10 md:h-11 text-sm md:text-base border ${errors.email ? "border-red-500" : "border-border"} focus:border-primary focus:outline-none transition-colors duration-200`}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
            }}
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
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
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
            Signing in...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Access Admin Portal
          </>
        )}
      </Button>

      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          This portal is restricted to authorized administrators only.
          <br />
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </form>
  )
}
