"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GiftCardItemProps {
  card: {
    id: number
    name: string
    description: string
    discount: string
    bgColor: string
    logo: string
    priceRange?: string
  }
}

export default function GiftCardItem({ card }: GiftCardItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const handleBuyClick = () => {
    // Create URL-friendly brand name
    const brandSlug = card.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    router.push(`/checkout?brand=${brandSlug}`)
  }

  return (
    <div className="group cursor-pointer">
      {/* Logo Background Card - No Border */}
      <div className={`relative ${card.bgColor} p-12 flex items-center justify-center min-h-[200px] overflow-hidden rounded-t-xl`}>
        {/* Discount Sticker */}
        <div className="absolute bottom-3 left-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          {card.discount}% OFF
        </div>

        {/* Logo with hover zoom effect */}
        <div className="text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 ease-out">{card.logo}</div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Content - With Border */}
      <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
        {/* Brand Name */}
        <h3 className="text-lg font-bold text-foreground mb-1.5 line-clamp-1">{card.name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{card.description}</p>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs text-muted-foreground font-medium">Available Range</span>
          <span className="text-sm font-bold text-primary">{card.priceRange || "$5 - $200"}</span>
        </div>

        {/* Buy Button */}
        <Button
          onClick={handleBuyClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}
