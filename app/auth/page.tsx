"use client"

import { Suspense } from "react"
import { AuthPageContent } from "@/components/auth-page-content"
import { GuestGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

function AuthPageLoading() {
  return <PageLoader message="Loading..." />
}

export default function AuthPage() {
  return (
    <GuestGuard>
      <Suspense fallback={<AuthPageLoading />}>
        <AuthPageContent />
      </Suspense>
    </GuestGuard>
  )
}
