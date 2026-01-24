// Checkout API Service for Katron AI Gift Card Platform
// Handles payment card management and gift card purchases

import { EXTERNAL_API_BASE_URL, type ApiResponse, AuthApiError } from "./auth"

// ==================== Types ====================

// Card types for PayArc integration
export interface CardCreateRequestModel {
  cardNumber: string
  cardExpiryDate: string // Format: MM/YY
  cardholderName: string
  cardIssuerType: string // "VISA", "MASTERCARD", etc.
  cvv: string
}

export interface SavedCard {
  id: number
  cardId?: string // PayArc card ID (if available)
  cardNumber: string // Masked format: "401200....5439"
  cardExpiryDate: string // Format: "12/26"
  cardholderName: string
  cardType: string // e.g., "card_type_payarc"
  cardIssuer?: string | null
  active?: boolean
  createdAt: string
  updatedAt?: string
  userId?: number
  // Legacy fields for backward compatibility
  lastFour?: string
  cardBrand?: string
  expiryMonth?: string
  expiryYear?: string
  isDefault?: boolean
}

// Gift card order request for MERCHANT users
export interface GiftcardOrderRequestMerchant {
  giftCardId: number // productId from the gift card
  quantity: number
  unitPrice: number // The amount/denomination selected
  email: string // Recipient email
  name: string // Recipient name
}

// Gift card order request for regular USER
export interface GiftcardOrderRequest {
  giftCardId: number
  quantity: number
  unitPrice: number
  successUrl: string // Redirect URL on successful payment
  failureUrl: string // Redirect URL on failed payment
}

// Order response types
export interface GiftCardOrder {
  id: number
  orderId: string
  giftCardId: number
  productName: string
  brandName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  recipientEmail: string
  recipientName: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  giftCardCode?: string
  giftCardPin?: string
  createdAt: string
  completedAt?: string
}

// Payment status check response
export interface PaymentStatus {
  orderId: string
  status: "PENDING" | "SUCCESS" | "FAILED"
  message: string
  redirectUrl?: string
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
  
  console.log("[Checkout API handleResponse] Raw data from server:", data)
  console.log("[Checkout API handleResponse] data.data:", data.data)
  console.log("[Checkout API handleResponse] data.data?.paymentFormUrl:", data.data?.paymentFormUrl)
  
  const isError = !response.ok || (data.status && data.status >= 400)
  
  if (isError) {
    throw new AuthApiError(
      data.message || "An error occurred",
      data.status || response.status
    )
  }
  
  const result = {
    status: data.status || response.status,
    message: data.message || "",
    data: data.data || data,
  }
  
  console.log("[Checkout API handleResponse] Returning result:", result)
  console.log("[Checkout API handleResponse] result.data.paymentFormUrl:", (result.data as any)?.paymentFormUrl)
  
  return result
}

// ==================== Card Management APIs ====================

/**
 * Add a new card to PayArc for the merchant
 * POST /api/checkout/add-card (proxied)
 */
export async function addCardToPayArc(cardData: CardCreateRequestModel): Promise<ApiResponse<SavedCard>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/add-card`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cardData),
  })
  
  return handleResponse<SavedCard>(response)
}

/**
 * Get all saved cards for the current user
 * GET /api/checkout/cards (proxied)
 */
export async function getSavedCards(): Promise<ApiResponse<SavedCard[]>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/cards`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<SavedCard[]>(response)
}

/**
 * Delete a saved card
 * DELETE /api/checkout/cards/:cardId (proxied)
 */
export async function deleteCard(cardId: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/cards/${cardId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<null>(response)
}

// ==================== Merchant Purchase APIs ====================

/**
 * Purchase a gift card as a MERCHANT (direct card charge)
 * POST /api/checkout/purchase-merchant (proxied)
 */
export async function purchaseGiftCardMerchant(
  orderData: GiftcardOrderRequestMerchant
): Promise<ApiResponse<GiftCardOrder>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/purchase-merchant`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  })
  
  return handleResponse<GiftCardOrder>(response)
}

// ==================== Regular User Purchase APIs ====================

// Response type for create order - API may return different formats
export interface CreateOrderResponse {
  orderId?: string
  id?: number | string
  paymentFormUrl?: string // PayArc payment form URL
  paymentUrl?: string
  payment_url?: string
  redirectUrl?: string
  redirect_url?: string
  url?: string
  [key: string]: unknown // Allow additional properties
}

/**
 * Create a gift card order for regular USER (redirects to payment page)
 * POST /api/checkout/create-order (proxied)
 */
export async function createGiftCardOrder(
  orderData: GiftcardOrderRequest
): Promise<ApiResponse<CreateOrderResponse>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/create-order`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  })
  
  return handleResponse<CreateOrderResponse>(response)
}

/**
 * Check payment status for an order
 * POST /api/checkout/check-payment-status (proxied)
 */
export async function checkPaymentStatus(orderId: string): Promise<ApiResponse<PaymentStatus>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/check-payment-status`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId }),
  })
  
  return handleResponse<PaymentStatus>(response)
}

/**
 * Check for both payment and gift card delivery status
 * POST /api/checkout/check-order-status (proxied)
 */
export async function checkOrderStatus(orderId: string): Promise<ApiResponse<GiftCardOrder>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/check-order-status`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId }),
  })
  
  return handleResponse<GiftCardOrder>(response)
}

// ==================== Order History APIs ====================

/**
 * Get all orders for the current user
 * GET /api/checkout/orders (proxied)
 */
export async function getUserOrders(): Promise<ApiResponse<GiftCardOrder[]>> {
  const response = await fetch(`${getBaseUrl()}/api/checkout/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<GiftCardOrder[]>(response)
}

// ==================== Helper Functions ====================

/**
 * Detect card type from card number
 */
export function detectCardType(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, "")
  
  // Visa
  if (/^4/.test(cleanNumber)) {
    return "VISA"
  }
  // Mastercard
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return "MASTERCARD"
  }
  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return "AMEX"
  }
  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return "DISCOVER"
  }
  
  return "UNKNOWN"
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  
  if (parts.length) {
    return parts.join(" ")
  }
  
  return value
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  
  if (v.length >= 2) {
    return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "")
  }
  
  return v
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, "")
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false
  }
  
  // Luhn algorithm
  let sum = 0
  let isEven = false
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  
  const month = parseInt(match[1], 10)
  const year = parseInt("20" + match[2], 10)
  
  if (month < 1 || month > 12) return false
  
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

/**
 * Validate CVV
 */
export function validateCvv(cvv: string, cardType: string): boolean {
  if (cardType === "AMEX") {
    return /^\d{4}$/.test(cvv)
  }
  return /^\d{3}$/.test(cvv)
}

/**
 * Calculate final price with discount
 */
export function calculateFinalPrice(amount: number, discountPercentage: number): number {
  const discount = (amount * discountPercentage) / 100
  return Number((amount - discount).toFixed(2))
}
