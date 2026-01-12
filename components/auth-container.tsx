"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { UserTypeSelection } from "./auth/user-type-selection"
import { LoginSection } from "./auth/login-section"
import { SignupSection } from "./auth/signup-section"
import Image from "next/image"
type AuthMode = "initial" | "login" | "signup"
type UserType = "merchant" | "user" | null

interface AuthContainerProps {
  initialMode: AuthMode
}

export function AuthContainer({ initialMode }: AuthContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<UserType>(null)
  const [mode, setMode] = useState<AuthMode>(initialMode === "initial" ? "initial" : initialMode)

  const handleUserTypeSelect = useCallback(
    (type: UserType) => {
      setUserType(type)
      const newMode = initialMode === "initial" ? "login" : initialMode
      setMode(newMode)
      const params = new URLSearchParams(searchParams)
      params.set("mode", newMode)
      router.push(`/auth?${params.toString()}`)
    },
    [initialMode, searchParams, router],
  )

  const handleToggleMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode)
      const params = new URLSearchParams(searchParams)
      params.set("mode", newMode)
      router.push(`/auth?${params.toString()}`)
    },
    [searchParams, router],
  )

  const handleBackToInitial = useCallback(() => {
    setUserType(null)
    setMode("initial")
    router.push("/auth")
  }, [router])

  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="flex flex-col justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
          {mode === "initial" ? (
            <UserTypeSelection onSelect={handleUserTypeSelect} />
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Welcome back</h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  {mode === "login" ? "Enter your credentials to continue" : "Create your account"}
                </p>
              </div>
              <button
                onClick={handleBackToInitial}
                className="text-xs md:text-sm text-primary hover:underline font-medium transition-colors"
              >
                ← Change account type
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12 bg-background">
          {mode === "initial" ? (
            <div className="flex flex-col items-center text-center space-y-3">
               <Image
                      src="/katron-ai-logo-bg-transparent.png"
                      alt="Logo"
                      width={120}
                      height={50}
                      className="h-42 w-48 object-fill"
                      priority
                    />
              <h3 className="text-xl font-bold text-foreground">Katron AI</h3>
              <p className="text-sm md:text-base text-muted-foreground">Select your account type to continue</p>
            </div>
          ) : (
            <>
              {mode === "login" && <LoginSection userType={userType} onToggleMode={handleToggleMode} />}
              {mode === "signup" && <SignupSection userType={userType} onToggleMode={handleToggleMode} />}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
