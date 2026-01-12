"use client"

import { Suspense } from "react"
import MyGiftCardsPageContent from "@/components/my-giftcards/my-giftcards-page-content"
import MyGiftCardsLoading from "@/components/my-giftcards/my-giftcards-loading"

export default function MyGiftCardsPage() {
  return (
    <Suspense fallback={<MyGiftCardsLoading />}>
      <MyGiftCardsPageContent />
    </Suspense>
  )
}
