"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar, Info, ExternalLink, RefreshCw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import OrderDetailsDialog from "./order-details-dialog"
import {
  type GiftCardOrder,
  getStatusColor,
  getStatusLabel,
  formatOrderDate,
  formatCurrency,
  getBrandBgColor,
  getBrandLogo,
  getOrderLogoUrl,
  normalizeStatus,
  normalizePaymentStatus,
  checkOrderStatus,
} from "@/lib/api/orders"

interface PurchasedGiftCardItemProps {
  card: GiftCardOrder
  onOrderUpdated?: (order: GiftCardOrder) => void
}

export default function PurchasedGiftCardItem({ card, onOrderUpdated }: PurchasedGiftCardItemProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const normalizedStatus = normalizeStatus(card.status || card.orderStatus)
  const normalizedPaymentStatus = normalizePaymentStatus(card.paymentStatus)
  const logoUrl = getOrderLogoUrl(card)
  // Use productName first (from API), then brandName as fallback
  const cardName = card.productName || card.brandName || "Gift Card"
  const bgColor = getBrandBgColor(cardName)
  
  // Debug log to check what's happening
  console.log("[GiftCardItem] Card:", cardName, "bgColor:", bgColor)

  const handlePurchaseAgain = () => {
    // Navigate to checkout with the gift card info
    if (card.giftCardId || card.productId) {
      router.push(`/checkout?productId=${card.giftCardId || card.productId}`)
    } else {
      // Fallback to buy page
      router.push("/buy")
    }
  }

  const handleCompletePayment = () => {
    // If we have a payment URL, redirect to it
    if (card.paymentFormUrl || card.paymentUrl) {
      window.open(card.paymentFormUrl || card.paymentUrl, "_blank")
    } else {
      toast.error("Payment link not available. Please try again or contact support.")
    }
  }

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      const response = await checkOrderStatus(card.id)
      if (response.data && onOrderUpdated) {
        onOrderUpdated(response.data)
      }
      toast.success("Order status refreshed")
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh status")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefreshOrder = async (orderId: number) => {
    try {
      const response = await checkOrderStatus(orderId)
      if (response.data && onOrderUpdated) {
        onOrderUpdated(response.data)
      }
    } catch (error) {
      throw error
    }
  }

  // Determine which action button to show
  const renderActionButton = () => {
    switch (normalizedStatus) {
      case "PENDING":
        if (normalizedPaymentStatus === "PENDING" && (card.paymentFormUrl || card.paymentUrl)) {
          return (
            <Button
              onClick={handleCompletePayment}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          )
        }
        return (
          <Button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Check Status
          </Button>
        )
      
      case "PROCESSING":
        return (
          <Button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Status
          </Button>
        )
      
      case "COMPLETED":
        return (
          <Button
            onClick={handlePurchaseAgain}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Purchase Again
          </Button>
        )
      
      case "FAILED":
      case "CANCELLED":
        return (
          <Button
            onClick={handlePurchaseAgain}
            variant="outline"
            className="flex-1 font-semibold py-2 rounded-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )
      
      default:
        return (
          <Button
            onClick={handlePurchaseAgain}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
          >
            Purchase Again
          </Button>
        )
    }
  }

  return (
    <>
      <div className="group cursor-pointer">
        {/* Logo Background Card - Colored background always visible, bg-slate-600 as fallback */}
        <div className={`relative bg-slate-600 ${bgColor} p-8 flex items-center justify-center min-h-[200px] overflow-hidden rounded-t-xl`}>
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold capitalize z-10 ${getStatusColor(card.status)}`}>
            {getStatusLabel(card.status)}
          </div>

          {/* Logo/Image - sized to always show colored background around it */}
          {logoUrl && !imageError ? (
            <img 
              src={logoUrl} 
              alt={card.brandName || card.productName || "Gift Card"} 
              className="max-h-[120px] max-w-[140px] w-auto h-auto object-contain rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback emoji when no logo or logo fails to load */
            <div className="text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 ease-out">
              {getBrandLogo(card.brandName || card.productName)}
            </div>
          )}
        </div>

        {/* Content - With Border */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
          {/* Brand Name */}
          <h3 className="text-lg font-bold text-foreground mb-1.5 line-clamp-1">
            {card.brandName || card.productName || "Gift Card"}
          </h3>

          {/* Product Name (if different from brand) */}
          {card.productName && card.brandName && card.productName !== card.brandName && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{card.productName}</p>
          )}

          {/* Purchase Info */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatOrderDate(card.createdAt || card.orderDate || card.purchaseDate)}</span>
            </div>
            <div className="text-sm font-bold text-primary">
              {formatCurrency(card.unitPrice || card.totalAmount, card.currencyCode)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {renderActionButton()}
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
      <OrderDetailsDialog 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        order={card}
        onRefreshOrder={handleRefreshOrder}
      />
    </>
  )
}
