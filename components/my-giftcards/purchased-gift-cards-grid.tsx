"use client"

import { PackageX, RefreshCw, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import PurchasedGiftCardItem from "./purchased-gift-card-item"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  type GiftCardOrder,
  filterOrders,
  filterOrdersByStatus,
  sortOrdersByDate,
} from "@/lib/api/orders"

interface PurchasedGiftCardsGridProps {
  orders: GiftCardOrder[]
  isLoading: boolean
  searchTerm: string
  statusFilter: string
  error: string | null
  onRetry: () => void
  onOrderUpdated: (order: GiftCardOrder) => void
}

export default function PurchasedGiftCardsGrid({ 
  orders,
  isLoading, 
  searchTerm,
  statusFilter,
  error,
  onRetry,
  onOrderUpdated
}: PurchasedGiftCardsGridProps) {
  const router = useRouter()

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-full p-4 mb-4">
          <PackageX className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Orders</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">{error}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  // Filter and sort orders
  let filteredCards = filterOrders(orders, searchTerm)
  filteredCards = filterOrdersByStatus(filteredCards, statusFilter)
  filteredCards = sortOrdersByDate(filteredCards)

  // Empty state - no orders at all
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 dark:bg-gray-900/30 rounded-full p-4 mb-4">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          You haven't purchased any gift cards yet. Explore our collection and find the perfect gift!
        </p>
        <Button onClick={() => router.push("/buy")}>
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Gift Cards
        </Button>
      </div>
    )
  }

  // Empty state - no matching results
  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 dark:bg-gray-900/30 rounded-full p-4 mb-4">
          <PackageX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          {searchTerm 
            ? `No orders matching "${searchTerm}" were found.`
            : statusFilter !== "all"
              ? `No ${statusFilter.toLowerCase()} orders found.`
              : "No orders match your current filters."
          }
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            // This will trigger parent to reset filters
            onRetry()
          }}
        >
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCards.length}</span> of{" "}
          <span className="font-semibold text-foreground">{orders.length}</span> order
          {orders.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
          )}
          {statusFilter !== "all" && (
            <span> with status "<span className="font-medium capitalize">{statusFilter}</span>"</span>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((order) => (
          <PurchasedGiftCardItem 
            key={order.id} 
            card={order}
            onOrderUpdated={onOrderUpdated}
          />
        ))}
      </div>
    </div>
  )
}
