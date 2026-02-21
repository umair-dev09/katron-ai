"use client"

import { Suspense } from "react"
import MerchantApiPageContent from "@/components/merchant-api/merchant-api-page-content"
import { ProtectedGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

export default function MerchantApiPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<PageLoader message="Loading API profile..." />}>
        <MerchantApiPageContent />
      </Suspense>
    </ProtectedGuard>
  )
}
