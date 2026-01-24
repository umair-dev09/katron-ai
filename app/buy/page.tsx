"use client"

import { Suspense } from "react"
import BuyPageContent from "@/components/buy/buy-page-content"
import BuyPageLoading from "@/components/buy/buy-page-loading"
import { ProtectedGuard } from "@/components/auth/auth-guard"

export default function BuyPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<BuyPageLoading />}>
        <BuyPageContent />
      </Suspense>
    </ProtectedGuard>
  )
}
