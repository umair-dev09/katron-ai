"use client"

import { Suspense } from "react"
import CheckoutPageContent from "@/components/checkout/checkout-page-content"
import { ProtectedGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

export default function CheckoutPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<PageLoader message="Loading checkout..." />}>
        <CheckoutPageContent />
      </Suspense>
    </ProtectedGuard>
  )
}
