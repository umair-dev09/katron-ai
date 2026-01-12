"use client"

import { useState, useEffect } from "react"
import SearchAndHeader from "@/components/my-giftcards/search-and-header"
import PurchasedGiftCardsGrid from "@/components/my-giftcards/purchased-gift-cards-grid"

export default function MyGiftCardsPageContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header and Search */}
      <SearchAndHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Gift Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <PurchasedGiftCardsGrid isLoading={isLoading} searchTerm={searchTerm} />
      </div>
    </main>
  )
}
