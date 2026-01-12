"use client"

import { Suspense } from "react"
import { AuthPageContent } from "@/components/auth-page-content"

function AuthPageLoading() {
  return null
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <AuthPageContent />
    </Suspense>
  )
}
