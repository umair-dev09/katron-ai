"use client"

import { useState, useEffect, useCallback } from "react"
import SearchAndHeader from "@/components/my-giftcards/search-and-header"
import PurchasedGiftCardsGrid from "@/components/my-giftcards/purchased-gift-cards-grid"
import { useAuth } from "@/lib/auth-context"
import {
  getOrders,
  calculateOrderStats,
  type GiftCardOrder,
  type OrderStats,
} from "@/lib/api/orders"

export default function MyGiftCardsPageContent() {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<GiftCardOrder[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("[MyGiftCards] Fetching orders for user:", user?.accountType)
      const response = await getOrders()
      
      console.log("[MyGiftCards] Orders response:", response)
      
      // Handle the response data - it could be an array or wrapped in data
      let ordersList: GiftCardOrder[] = []
      
      if (Array.isArray(response.data)) {
        ordersList = response.data
      } else if (response.data && typeof response.data === 'object') {
        // Check if data contains an array
        const dataObj = response.data as Record<string, unknown>
        if (Array.isArray(dataObj.orders)) {
          ordersList = dataObj.orders
        } else if (Array.isArray(dataObj.data)) {
          ordersList = dataObj.data
        }
      }
      
      console.log("[MyGiftCards] Processed orders:", ordersList)
      
      setOrders(ordersList)
      setStats(calculateOrderStats(ordersList))
    } catch (err: any) {
      console.error("[MyGiftCards] Error fetching orders:", err)
      setError(err.message || "Failed to load orders. Please try again.")
      setOrders([])
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.accountType])

  // Initial fetch
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Handle order update (from refresh status)
  const handleOrderUpdated = useCallback((updatedOrder: GiftCardOrder) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => 
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
      // Recalculate stats
      setStats(calculateOrderStats(newOrders))
      return newOrders
    })
  }, [])

  // Handle retry/refresh
  const handleRetry = useCallback(() => {
    // Reset filters and refetch
    setSearchTerm("")
    setStatusFilter("all")
    fetchOrders()
  }, [fetchOrders])

  return (
    <main className="min-h-screen bg-background pt-24 md:pt-28">
      {/* Header and Search */}
      <SearchAndHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stats={stats}
        isLoading={isLoading}
      />

      {/* Gift Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <PurchasedGiftCardsGrid 
          orders={orders}
          isLoading={isLoading} 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          error={error}
          onRetry={handleRetry}
          onOrderUpdated={handleOrderUpdated}
        />
      </div>
    </main>
  )
}
