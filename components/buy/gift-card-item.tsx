"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GiftCard, getCategoryName, getLogoUrl, getPriceRange } from "@/lib/api/gift-cards"
import { cn } from "@/lib/utils"

interface GiftCardItemProps {
  card: GiftCard
  showTypeBadge?: boolean
}

// Generate a consistent background color based on card name
function getCardBackground(name: string): string {
  const colors = [
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-yellow-500 to-yellow-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
  ]
  
  // Use card name to generate consistent color (handle undefined/null)
  const safeName = name || "default"
  let hash = 0
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Format price range
function formatPriceRange(min: number, max: number, currency: string = "USD"): string {
  const symbol = currency === "USD" ? "$" : currency
  if (min === max) {
    return `${symbol}${min}`
  }
  return `${symbol}${min} - ${symbol}${max}`
}

export default function GiftCardItem({ card, showTypeBadge = false }: GiftCardItemProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  // Get values from API structure
  const productName = card.productName || "Gift Card"
  const brandName = card.brand?.brandName || productName
  const logoUrl = getLogoUrl(card)
  const categoryName = getCategoryName(card)
  const { min: minPrice, max: maxPrice } = getPriceRange(card)
  const discount = card.discountPercentage || 0
  const currency = card.recipientCurrencyCode || "USD"

  const handleBuyClick = () => {
    // Build checkout URL with all necessary parameters
    const params = new URLSearchParams({
      productId: card.productId.toString(),
      productName: productName,
      brandName: brandName,
      discount: discount.toString(),
      denominationType: card.denominationType || "RANGE",
      minDenomination: (card.minRecipientDenomination || 5).toString(),
      maxDenomination: (card.maxRecipientDenomination || 500).toString(),
    })
    
    // Add logo URL if available
    if (logoUrl) {
      params.append("logoUrl", logoUrl)
    }
    
    // Add fixed denominations if available
    if (card.fixedRecipientDenominations && card.fixedRecipientDenominations.length > 0) {
      params.append("fixedDenominations", card.fixedRecipientDenominations.join(","))
    }
    
    // Add redeem instruction if available
    if (card.redeemInstruction?.verbose) {
      params.append("redeemInstruction", card.redeemInstruction.verbose)
    } else if (card.redeemInstruction?.concise) {
      params.append("redeemInstruction", card.redeemInstruction.concise)
    }
    
    router.push(`/checkout?${params.toString()}`)
  }

  const bgColor = getCardBackground(productName)
  const priceRange = formatPriceRange(minPrice, maxPrice, currency)
  const hasLogo = logoUrl && !imageError
  
  return (
    <div className="group cursor-pointer">
      {/* Logo Background Card - No Border */}
      <div 
        className={cn(
          "relative p-8 flex items-center justify-center min-h-[180px] overflow-hidden rounded-t-xl",
          bgColor
        )}
      >
        {/* Type Badge - Only shown for MERCHANT/ADMIN users */}
        {showTypeBadge && (
          <div className={cn(
            "absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold z-10 uppercase tracking-wide",
            card.type === "open" 
              ? "bg-blue-500 text-white" 
              : "bg-emerald-500 text-white"
          )}>
            {card.type === "open" ? "Open Loop" : "Closed Loop"}
          </div>
        )}
        
        {/* Discount Sticker */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            {discount}% OFF
          </div>
        )}

        {/* Logo */}
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 ease-out">
          {hasLogo ? (
            <Image
              src={logoUrl}
              alt={productName}
              width={120}
              height={120}
              className="object-contain drop-shadow-lg rounded-lg bg-white/90 p-2"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-white/90 flex items-center justify-center shadow-lg">
              <CreditCard className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Content - With Border */}
      <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{productName}</h3>
        
        {/* Category */}
        {categoryName && (
          <span className="inline-block text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded mb-2">
            {categoryName}
          </span>
        )}

        {/* Description - Use redeem instruction or fallback */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[40px]">
          {card.redeemInstruction?.concise || `Purchase ${brandName} gift cards`}
        </p>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs text-muted-foreground font-medium">Available Range</span>
          <span className="text-sm font-bold text-primary">{priceRange}</span>
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
