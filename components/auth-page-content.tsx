"use client"

import { useSearchParams } from "next/navigation"
import { AuthContainer } from "@/components/auth-container"

export function AuthPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "initial"

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-10">
      <div className="w-full max-w-lg md:max-w-4xl flex flex-col">
        <AuthContainer initialMode={mode as "initial" | "login" | "signup"} />
        <p className="text-xs md:text-sm text-muted-foreground text-center mt-6 px-4">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
