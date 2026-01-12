"use client"

import { Suspense } from "react"
import CheckoutPageContent from "@/components/checkout/checkout-page-content"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CheckoutPageContent />
    </Suspense>
  )
}
