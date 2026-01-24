"use client"

import { Suspense } from "react"
import MyGiftCardsPageContent from "@/components/my-giftcards/my-giftcards-page-content"
import MyGiftCardsLoading from "@/components/my-giftcards/my-giftcards-loading"
import { ProtectedGuard } from "@/components/auth/auth-guard"

export default function MyGiftCardsPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<MyGiftCardsLoading />}>
        <MyGiftCardsPageContent />
      </Suspense>
    </ProtectedGuard>
  )
}
