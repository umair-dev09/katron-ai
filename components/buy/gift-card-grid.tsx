"use client"

import GiftCardItem from "./gift-card-item"
import GiftCardSkeleton from "./gift-card-skeleton"
import { GiftCard } from "@/lib/api/gift-cards"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"

interface GiftCardGridProps {
  cards: GiftCard[]
  isLoading: boolean
  error: string | null
  totalCount: number
  onRetry: () => void
  showTypeBadge?: boolean
}

export default function GiftCardGrid({ cards, isLoading, error, totalCount, onRetry, showTypeBadge = false }: GiftCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <GiftCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-foreground text-lg font-medium mb-2">Failed to load gift cards</p>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg mb-2">No gift cards found</p>
        <p className="text-muted-foreground text-sm">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {cards.length} of {totalCount} gift cards
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <GiftCardItem 
            key={card.productId ? `${card.productId}-${index}` : `card-${index}`} 
            card={card} 
            showTypeBadge={showTypeBadge}
          />
        ))}
      </div>
    </div>
  )
}
