"use client"

import GiftCardItem from "./gift-card-item"
import GiftCardSkeleton from "./gift-card-skeleton"

const DUMMY_GIFT_CARDS = [
  {
    id: 1,
    name: "Cleartrip",
    description: "Book flights and hotels at great rates",
    discount: "22.3",
    bgColor: "bg-orange-500",
    logo: "✈️",
  },
  {
    id: 2,
    name: "Amazon",
    description: "Shop anything from electronics to books",
    discount: "15.5",
    bgColor: "bg-yellow-400",
    logo: "🛍️",
  },
  {
    id: 3,
    name: "Spotify",
    description: "Stream millions of songs and podcasts",
    discount: "10",
    bgColor: "bg-green-500",
    logo: "🎵",
  },
  {
    id: 4,
    name: "Netflix",
    description: "Watch movies, series, and documentaries",
    discount: "18.7",
    bgColor: "bg-red-600",
    logo: "🎬",
  },
  {
    id: 5,
    name: "Uber Eats",
    description: "Order food from your favorite restaurants",
    discount: "25",
    bgColor: "bg-black",
    logo: "🍔",
  },
  {
    id: 6,
    name: "Swiggy",
    description: "Food delivery at your doorstep",
    discount: "12.5",
    bgColor: "bg-orange-600",
    logo: "🚚",
  },
  {
    id: 7,
    name: "Zomato",
    description: "Discover the best food experiences",
    discount: "20",
    bgColor: "bg-red-500",
    logo: "🍽️",
  },
  {
    id: 8,
    name: "Booking.com",
    description: "Find hotels and accommodations worldwide",
    discount: "14.2",
    bgColor: "bg-blue-500",
    logo: "🏨",
  },
  {
    id: 9,
    name: "App Store & iTunes US",
    description: "Music, movies, and apps in one place",
    discount: "8.5",
    bgColor: "bg-slate-700",
    logo: "🎵",
  },
]

interface GiftCardGridProps {
  isLoading: boolean
  searchTerm: string
}

export default function GiftCardGrid({ isLoading, searchTerm }: GiftCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <GiftCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const filteredCards = DUMMY_GIFT_CARDS.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <GiftCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg mb-2">No gift cards found</p>
          <p className="text-muted-foreground text-sm">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  )
}
