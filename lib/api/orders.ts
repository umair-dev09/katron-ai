// Orders API Service for Katron AI Gift Card Platform
// Handles order history and order management

import { EXTERNAL_API_BASE_URL, type ApiResponse, AuthApiError } from "./auth"

// ==================== Types ====================

// Order status types
export type OrderStatus = 
  | "PENDING" 
  | "PROCESSING" 
  | "COMPLETED" 
  | "FAILED" 
  | "CANCELLED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "GIFT_CARD_PENDING"
  | "GIFT_CARD_DELIVERED"

export type PaymentStatus = 
  | "PENDING" 
  | "PAID" 
  | "FAILED" 
  | "REFUNDED"
  | "PROCESSING"
  | "COMPLETED"

// Gift card details within an order
export interface GiftCardDetails {
  productId?: number
  productName?: string
  brandName?: string
  brandLogo?: string
  countryCode?: string
  countryName?: string
  currencyCode?: string
  redemptionInstructions?: string
  termsAndConditions?: string
  // Fixed denominations or range info
  denominationType?: string
  fixedRecipientDenominations?: number[]
  minRecipientDenomination?: number
  maxRecipientDenomination?: number
}

// Order response from the backend
export interface GiftCardOrder {
  // Core order identifiers
  id: number
  orderId?: string
  
  // Gift card details
  giftCardId?: number
  productId?: number
  productName?: string
  brandName?: string
  brandLogo?: string
  // Multiple logo URL formats the API might return
  productPhoto?: string
  logoUrl?: string
  logoUrls?: string[]
  logo?: string
  imageUrl?: string
  image?: string
  
  // Order quantities and pricing
  quantity?: number
  unitPrice?: number
  totalAmount?: number
  discountAmount?: number
  discount?: number
  finalAmount?: number
  fee?: number
  
  // Recipient info
  recipientEmail?: string
  recipientName?: string
  email?: string
  name?: string
  
  // Status fields
  status?: OrderStatus | string
  orderStatus?: string
  paymentStatus?: PaymentStatus | string
  giftCardStatus?: string
  
  // Gift card credentials (only for completed orders)
  cardNumber?: string
  giftCardCode?: string
  giftCardPin?: string
  pinCode?: string
  cardPin?: string
  
  // Transaction references
  payarcTransactionId?: string
  reloadlyTransactionId?: string
  transactionId?: string
  
  // Payment URLs (for pending payment orders - USER flow)
  paymentFormUrl?: string
  paymentUrl?: string
  
  // Timestamps
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  purchaseDate?: string
  orderDate?: string
  
  // User info
  userId?: number
  userType?: "MERCHANT" | "USER"
  
  // Additional metadata
  currencyCode?: string
  senderName?: string
  countryCode?: string
}

// Stats for header
export interface OrderStats {
  totalOrders: number
  totalValue: number
  completedOrders: number
  pendingOrders: number
  failedOrders: number
}

// Resend credentials response
export interface ResendCredentialsResponse {
  success: boolean
  message: string
}

// ==================== Helpers ====================

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return ""
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json()
  
  console.log("[Orders API handleResponse] Raw data from server:", data)
  
  const isError = !response.ok || (data.status && data.status >= 400)
  
  if (isError) {
    throw new AuthApiError(
      data.message || "An error occurred",
      data.status || response.status
    )
  }
  
  return {
    status: data.status || response.status,
    message: data.message || "",
    data: data.data || data,
  }
}

// ==================== Order APIs ====================

/**
 * Get all orders for the current user
 * GET /api/orders (proxied to /api/giftCards/listAllOrders)
 */
export async function getOrders(): Promise<ApiResponse<GiftCardOrder[]>> {
  const response = await fetch(`${getBaseUrl()}/api/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<GiftCardOrder[]>(response)
}

/**
 * Get a single order by ID
 * GET /api/orders/:orderId
 */
export async function getOrderById(orderId: number | string): Promise<ApiResponse<GiftCardOrder>> {
  const response = await fetch(`${getBaseUrl()}/api/orders/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<GiftCardOrder>(response)
}

/**
 * Check order status and update
 * POST /api/orders/check-status
 */
export async function checkOrderStatus(orderId: number | string): Promise<ApiResponse<GiftCardOrder>> {
  const response = await fetch(`${getBaseUrl()}/api/orders/check-status?giftCardOrderId=${orderId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<GiftCardOrder>(response)
}

/**
 * Resend gift card credentials to recipient email
 * POST /api/orders/resend-credentials
 */
export async function resendGiftCardCredentials(orderId: number | string): Promise<ApiResponse<ResendCredentialsResponse>> {
  const response = await fetch(`${getBaseUrl()}/api/orders/resend-credentials?giftCardOrderId=${orderId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<ResendCredentialsResponse>(response)
}

// ==================== Helper Functions ====================

/**
 * Normalize order data from different API response formats
 */
export function normalizeOrder(order: GiftCardOrder): GiftCardOrder {
  return {
    ...order,
    // Normalize IDs
    id: order.id,
    orderId: order.orderId || String(order.id),
    
    // Normalize product info
    productName: order.productName || order.brandName || "Unknown Gift Card",
    brandName: order.brandName || order.productName || "Unknown Brand",
    
    // Normalize pricing
    unitPrice: order.unitPrice || 0,
    quantity: order.quantity || 1,
    totalAmount: order.totalAmount || order.unitPrice || 0,
    finalAmount: order.finalAmount || order.totalAmount || order.unitPrice || 0,
    
    // Normalize recipient
    recipientEmail: order.recipientEmail || order.email || "",
    recipientName: order.recipientName || order.name || "",
    
    // Normalize status
    status: normalizeStatus(order.status || order.orderStatus || "PENDING"),
    paymentStatus: normalizePaymentStatus(order.paymentStatus || "PENDING"),
    
    // Normalize dates
    createdAt: order.createdAt || order.orderDate || order.purchaseDate || new Date().toISOString(),
  }
}

/**
 * Normalize status string to standard format
 */
export function normalizeStatus(status?: string): OrderStatus {
  if (!status) return "PENDING"
  
  const upperStatus = status.toUpperCase().replace(/\s+/g, "_")
  
  switch (upperStatus) {
    case "COMPLETED":
    case "SUCCESS":
    case "DELIVERED":
    case "GIFT_CARD_DELIVERED":
      return "COMPLETED"
    case "PENDING":
    case "PAYMENT_PENDING":
    case "AWAITING_PAYMENT":
      return "PENDING"
    case "PROCESSING":
    case "IN_PROGRESS":
    case "GIFT_CARD_PENDING":
      return "PROCESSING"
    case "FAILED":
    case "ERROR":
    case "REJECTED":
      return "FAILED"
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED"
    default:
      return "PENDING"
  }
}

/**
 * Normalize payment status string to standard format
 */
export function normalizePaymentStatus(status?: string): PaymentStatus {
  if (!status) return "PENDING"
  
  const upperStatus = status.toUpperCase().replace(/\s+/g, "_")
  
  switch (upperStatus) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
    case "PAYMENT_COMPLETED":
      return "PAID"
    case "PENDING":
    case "AWAITING":
    case "PAYMENT_PENDING":
      return "PENDING"
    case "FAILED":
    case "ERROR":
    case "REJECTED":
      return "FAILED"
    case "REFUNDED":
    case "REFUND":
      return "REFUNDED"
    case "PROCESSING":
      return "PROCESSING"
    default:
      return "PENDING"
  }
}

/**
 * Calculate order stats from list of orders
 */
export function calculateOrderStats(orders: GiftCardOrder[]): OrderStats {
  const stats: OrderStats = {
    totalOrders: orders.length,
    totalValue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
  }
  
  for (const order of orders) {
    const normalizedOrder = normalizeOrder(order)
    stats.totalValue += normalizedOrder.finalAmount || normalizedOrder.unitPrice || 0
    
    switch (normalizedOrder.status) {
      case "COMPLETED":
        stats.completedOrders++
        break
      case "PENDING":
      case "PROCESSING":
        stats.pendingOrders++
        break
      case "FAILED":
      case "CANCELLED":
        stats.failedOrders++
        break
    }
  }
  
  return stats
}

/**
 * Format date for display
 */
export function formatOrderDate(dateString?: string): string {
  if (!dateString) return "N/A"
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount?: number, currencyCode?: string): string {
  if (amount === undefined || amount === null) return "$0.00"
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  })
  
  return formatter.format(amount)
}

/**
 * Get status color classes for badges
 */
export function getStatusColor(status?: string): string {
  const normalizedStatus = normalizeStatus(status)
  
  switch (normalizedStatus) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

/**
 * Get payment status color classes for badges
 */
export function getPaymentStatusColor(status?: string): string {
  const normalizedStatus = normalizePaymentStatus(status)
  
  switch (normalizedStatus) {
    case "PAID":
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

/**
 * Get status display label
 */
export function getStatusLabel(status?: string): string {
  const normalizedStatus = normalizeStatus(status)
  
  switch (normalizedStatus) {
    case "COMPLETED":
      return "Completed"
    case "PENDING":
      return "Pending"
    case "PROCESSING":
      return "Processing"
    case "FAILED":
      return "Failed"
    case "CANCELLED":
      return "Cancelled"
    default:
      return status || "Unknown"
  }
}

/**
 * Check if order has gift card credentials
 */
export function hasGiftCardCredentials(order: GiftCardOrder): boolean {
  return !!(order.giftCardCode || order.cardNumber || order.giftCardPin || order.pinCode)
}

/**
 * Get gift card credentials from order
 */
export function getGiftCardCredentials(order: GiftCardOrder): { code?: string; pin?: string } {
  return {
    code: order.giftCardCode || order.cardNumber,
    pin: order.giftCardPin || order.pinCode || order.cardPin,
  }
}

/**
 * Get logo URL from order (handles various API response formats)
 */
export function getOrderLogoUrl(order: GiftCardOrder): string | undefined {
  // Check various possible field names for logo URL - productPhoto is primary from API
  if (order.productPhoto) return order.productPhoto
  if (order.brandLogo) return order.brandLogo
  if (order.logoUrl) return order.logoUrl
  if (order.logo) return order.logo
  if (order.imageUrl) return order.imageUrl
  if (order.image) return order.image
  if (order.logoUrls && order.logoUrls.length > 0) return order.logoUrls[0]
  return undefined
}

/**
 * Check if order is actionable (can complete payment, retry, etc.)
 */
export function isOrderActionable(order: GiftCardOrder): boolean {
  const normalizedStatus = normalizeStatus(order.status || order.orderStatus)
  const normalizedPaymentStatus = normalizePaymentStatus(order.paymentStatus)
  
  // Payment can be completed if pending and has payment URL
  if (normalizedStatus === "PENDING" && (order.paymentFormUrl || order.paymentUrl)) {
    return true
  }
  
  // Payment is pending
  if (normalizedPaymentStatus === "PENDING") {
    return true
  }
  
  return false
}

/**
 * Get background color for gift card display based on brand
 * Uses a hash-based approach to generate consistent colors for the same brand name
 * This ensures the same card always gets the same color (good UX)
 */
export function getBrandBgColor(brandName?: string): string {
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-fuchsia-500",
    "bg-lime-500",
  ]
  
  // Use brand name to generate consistent color (handle undefined/null)
  const safeName = brandName || "default"
  let hash = 0
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Get logo emoji for gift card based on brand
 */
export function getBrandLogo(brandName?: string): string {
  if (!brandName) return "🎁"
  
  const brand = brandName.toLowerCase()
  
  const brandLogos: Record<string, string> = {
    amazon: "🛍️",
    spotify: "🎵",
    netflix: "🎬",
    uber: "🚗",
    "uber eats": "🍔",
    google: "🔍",
    apple: "🍎",
    itunes: "🎧",
    playstation: "🎮",
    xbox: "🎮",
    steam: "🎮",
    starbucks: "☕",
    walmart: "🛒",
    target: "🎯",
    "best buy": "🖥️",
    ebay: "🛒",
    visa: "💳",
    mastercard: "💳",
    airbnb: "🏠",
    doordash: "🍕",
    grubhub: "🍔",
    instacart: "🛒",
    lyft: "🚗",
    hulu: "📺",
    disney: "🏰",
    sephora: "💄",
    nike: "👟",
    adidas: "👟",
    "home depot": "🔨",
    lowes: "🔧",
    travel: "✈️",
    hotel: "🏨",
    food: "🍽️",
    restaurant: "🍽️",
    coffee: "☕",
    movie: "🎬",
    game: "🎮",
    music: "🎵",
    book: "📚",
    clothing: "👕",
    fashion: "👗",
    beauty: "💄",
    fitness: "💪",
    sports: "⚽",
    entertainment: "🎉",
  }
  
  // Check for partial matches
  for (const [key, logo] of Object.entries(brandLogos)) {
    if (brand.includes(key)) {
      return logo
    }
  }
  
  return "🎁"
}

/**
 * Sort orders by date (newest first)
 */
export function sortOrdersByDate(orders: GiftCardOrder[]): GiftCardOrder[] {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.orderDate || a.purchaseDate || 0).getTime()
    const dateB = new Date(b.createdAt || b.orderDate || b.purchaseDate || 0).getTime()
    return dateB - dateA
  })
}

/**
 * Filter orders by search term
 */
export function filterOrders(orders: GiftCardOrder[], searchTerm: string): GiftCardOrder[] {
  if (!searchTerm.trim()) return orders
  
  const term = searchTerm.toLowerCase()
  
  return orders.filter(order => {
    const searchableFields = [
      order.productName,
      order.brandName,
      order.recipientEmail,
      order.recipientName,
      order.email,
      order.name,
      order.orderId,
      String(order.id),
      order.giftCardCode,
      order.payarcTransactionId,
      order.reloadlyTransactionId,
      order.transactionId,
    ]
    
    return searchableFields.some(field => 
      field && field.toLowerCase().includes(term)
    )
  })
}

/**
 * Filter orders by status
 */
export function filterOrdersByStatus(orders: GiftCardOrder[], status: string): GiftCardOrder[] {
  if (!status || status === "all") return orders
  
  return orders.filter(order => {
    const normalizedStatus = normalizeStatus(order.status || order.orderStatus)
    return normalizedStatus.toLowerCase() === status.toLowerCase()
  })
}
