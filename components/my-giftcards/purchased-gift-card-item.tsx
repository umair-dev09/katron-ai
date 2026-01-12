"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderDetailsDialog from "./order-details-dialog"

interface PurchasedGiftCardItemProps {
  card: {
    id: number
    name: string
    description: string
    bgColor: string
    logo: string
    purchaseDate: string
    amount: string
    status: "pending" | "completed" | "failed"
    payarcTransactionId: string
    reloadlyTransactionId: string
  }
}

export default function PurchasedGiftCardItem({ card }: PurchasedGiftCardItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const router = useRouter()

  const handlePurchaseAgain = () => {
    // Create URL-friendly brand name
    const brandSlug = card.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    router.push(`/checkout?brand=${brandSlug}`)
  }

  const handleCompletePayment = () => {
    // TODO: Connect to backend to complete payment
    console.log("Complete payment for order:", card.id)
    // Redirect to payment page or open payment modal
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <>
      <div className="group cursor-pointer">
        {/* Logo Background Card - No Border */}
        <div className={`relative ${card.bgColor} p-10 flex items-center justify-center min-h-[200px] overflow-hidden rounded-t-xl`}>
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold capitalize z-10 ${getStatusColor(card.status)}`}>
            {card.status}
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

        {/* Purchase Info */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{card.purchaseDate}</span>
          </div>
          <div className="text-sm font-bold text-primary">
            ${card.amount}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {card.status === "pending" ? (
            <Button
              onClick={handleCompletePayment}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Complete Payment
            </Button>
          ) : (
            <Button
              onClick={handlePurchaseAgain}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
            >
              Purchase Again
            </Button>
          )}
          <Button
            onClick={() => setShowDetails(true)}
            variant="outline"
            size="icon"
            className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/20"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    {/* Order Details Dialog */}
    <OrderDetailsDialog isOpen={showDetails} onClose={() => setShowDetails(false)} order={card} />
  </>
  )
}
