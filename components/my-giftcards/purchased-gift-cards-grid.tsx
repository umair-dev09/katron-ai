"use client"

import PurchasedGiftCardItem from "./purchased-gift-card-item"
import { Skeleton } from "@/components/ui/skeleton"

const PURCHASED_GIFT_CARDS = [
  {
    id: 1,
    name: "Amazon",
    description: "Shop anything from electronics to books",
    bgColor: "bg-yellow-400",
    logo: "🛍️",
    purchaseDate: "Dec 15, 2025",
    amount: "50",
    status: "completed" as const,
    payarcTransactionId: "PAYARC-2025-AMZ-001",
    reloadlyTransactionId: "RELOADLY-AMZ-7891234",
  },
  {
    id: 2,
    name: "Spotify",
    description: "Stream millions of songs and podcasts",
    bgColor: "bg-green-500",
    logo: "🎵",
    purchaseDate: "Dec 10, 2025",
    amount: "25",
    status: "pending" as const,
    payarcTransactionId: "PAYARC-2025-SPT-002",
    reloadlyTransactionId: "RELOADLY-SPT-7891235",
  },
  {
    id: 3,
    name: "Netflix",
    description: "Watch movies, series, and documentaries",
    bgColor: "bg-red-600",
    logo: "🎬",
    purchaseDate: "Dec 5, 2025",
    amount: "100",
    status: "completed" as const,
    payarcTransactionId: "PAYARC-2025-NFX-003",
    reloadlyTransactionId: "RELOADLY-NFX-7891236",
  },
  {
    id: 4,
    name: "Cleartrip",
    description: "Book flights and hotels at great rates",
    bgColor: "bg-orange-500",
    logo: "✈️",
    purchaseDate: "Nov 28, 2025",
    amount: "150",
    status: "failed" as const,
    payarcTransactionId: "PAYARC-2025-CLT-004",
    reloadlyTransactionId: "RELOADLY-CLT-7891237",
  },
  {
    id: 5,
    name: "Uber Eats",
    description: "Order food from your favorite restaurants",
    bgColor: "bg-black",
    logo: "🍔",
    purchaseDate: "Nov 20, 2025",
    amount: "50",
    status: "completed" as const,
    payarcTransactionId: "PAYARC-2025-UBR-005",
    reloadlyTransactionId: "RELOADLY-UBR-7891238",
  },
  {
    id: 6,
    name: "Swiggy",
    description: "Food delivery at your doorstep",
    bgColor: "bg-orange-600",
    logo: "🚚",
    purchaseDate: "Nov 15, 2025",
    amount: "75",
    status: "completed" as const,
    payarcTransactionId: "PAYARC-2025-SWG-006",
    reloadlyTransactionId: "RELOADLY-SWG-7891239",
  },
  {
    id: 7,
    name: "Zomato",
    description: "Discover the best food experiences",
    bgColor: "bg-red-500",
    logo: "🍽️",
    purchaseDate: "Nov 10, 2025",
    amount: "50",
    status: "pending" as const,
    payarcTransactionId: "PAYARC-2025-ZMT-007",
    reloadlyTransactionId: "RELOADLY-ZMT-7891240",
  },
  {
    id: 8,
    name: "Booking.com",
    description: "Find hotels and accommodations worldwide",
    bgColor: "bg-blue-500",
    logo: "🏨",
    purchaseDate: "Nov 1, 2025",
    amount: "200",
    status: "completed" as const,
    payarcTransactionId: "PAYARC-2025-BKG-008",
    reloadlyTransactionId: "RELOADLY-BKG-7891241",
  },
]

interface PurchasedGiftCardsGridProps {
  isLoading: boolean
  searchTerm: string
}

export default function PurchasedGiftCardsGrid({ isLoading, searchTerm }: PurchasedGiftCardsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-t-xl" />
            <div className="space-y-2 px-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const filteredCards = PURCHASED_GIFT_CARDS.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      {filteredCards.length > 0 ? (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCards.length}</span> gift card
              {filteredCards.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <PurchasedGiftCardItem key={card.id} card={card} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-muted-foreground text-lg mb-2">No gift cards found</p>
          <p className="text-muted-foreground text-sm">
            {searchTerm ? "Try adjusting your search" : "You haven't purchased any gift cards yet"}
          </p>
        </div>
      )}
    </div>
  )
}
