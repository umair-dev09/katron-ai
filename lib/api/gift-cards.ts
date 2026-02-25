import { ApiResponse, EXTERNAL_API_BASE_URL } from "./auth"

// Gift Card Types - API expects 'open' for Open Loop (Visa/MC) and 'close' for Closed Loop (brand-specific)
export type GiftCardType = "open" | "close"

// Category structure from API
export interface GiftCardCategory {
  id: number
  name: string
}

// Brand structure from API
export interface GiftCardBrand {
  brandId: number
  brandName: string
}

// Country structure from API
export interface GiftCardCountry {
  isoName: string
  name: string
  flagUrl: string
}

// Gift Card interface based on actual API response
export interface GiftCard {
  productId: number
  productName: string
  global: boolean
  status: string
  supportsPreOrder: boolean
  senderFee: number
  senderFeePercentage: number
  discountPercentage: number
  denominationType: "FIXED" | "RANGE"
  recipientCurrencyCode: string
  minRecipientDenomination: number | null
  maxRecipientDenomination: number | null
  senderCurrencyCode: string
  minSenderDenomination: number | null
  maxSenderDenomination: number | null
  fixedRecipientDenominations: number[]
  fixedSenderDenominations: number[] | null
  fixedRecipientToSenderDenominationsMap: Record<string, number | null> | null
  logoUrls: string[]
  brand: GiftCardBrand
  category: GiftCardCategory
  country: GiftCardCountry
  redeemInstruction: {
    concise: string
    verbose: string
  }
  additionalRequirements: {
    userIdRequired: boolean
  }
  recipientCurrencyToSenderCurrencyExchangeRate: number
  // Optional type field (for distinguishing open/close loop)
  type?: GiftCardType
}

// Helper to get category name from a card
export function getCategoryName(card: GiftCard): string {
  return card.category?.name || ""
}

// Helper to get brand name from a card
export function getBrandName(card: GiftCard): string {
  return card.brand?.brandName || card.productName || ""
}

// Helper to get logo URL from a card
export function getLogoUrl(card: GiftCard): string | undefined {
  return card.logoUrls?.[0]
}

// Helper to get price range
export function getPriceRange(card: GiftCard): { min: number; max: number } {
  if (card.denominationType === "RANGE") {
    return {
      min: card.minRecipientDenomination || 5,
      max: card.maxRecipientDenomination || 500
    }
  }
  // For FIXED denomination type, get min/max from fixed amounts
  const denominations = card.fixedRecipientDenominations || []
  if (denominations.length === 0) {
    return { min: 5, max: 500 }
  }
  return {
    min: Math.min(...denominations),
    max: Math.max(...denominations)
  }
}

// API Response for gift cards list
export interface GiftCardsListResponse {
  giftCards: GiftCard[]
  totalCount?: number
  page?: number
  pageSize?: number
}

// Get auth headers
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

/**
 * List all gift cards by type
 * GET /api/giftCards/listAllGiftCards?type={type}
 * 
 * @param type - "OPEN_LOOP" | "CLOSED_LOOP"
 * - OPEN_LOOP: Visa/Mastercard prepaid cards that can be used anywhere
 * - CLOSED_LOOP: Brand-specific gift cards (Amazon, Starbucks, etc.)
 * 
 * Note: 
 * - Merchants typically see OPEN_LOOP cards
 * - Regular users typically see CLOSED_LOOP cards
 * - Some users may see both based on permissions
 */
export async function listGiftCards(type: GiftCardType): Promise<ApiResponse<GiftCard[]>> {
  // Map frontend type values to backend enum: 'open' → 'OPEN', 'close' → 'CLOSE'
  const backendType = type === "open" ? "OPEN" : "CLOSE"
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/giftCards/listAllGiftCards?type=${backendType}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  const data = await response.json()
  return data
}

/**
 * List all gift cards (both types) for users who can see everything
 * Makes two calls and combines results, tagging each card with its type
 */
export async function listAllGiftCards(): Promise<ApiResponse<GiftCard[]>> {
  try {
    const [openLoopResult, closedLoopResult] = await Promise.all([
      listGiftCards("open"),
      listGiftCards("close"),
    ])
    
    const allCards: GiftCard[] = []
    
    if (openLoopResult.status === 200 && openLoopResult.data) {
      const openCards = Array.isArray(openLoopResult.data) ? openLoopResult.data : []
      // Tag open loop cards with their type
      allCards.push(...openCards.map(card => ({ ...card, type: "open" as const })))
    }
    
    if (closedLoopResult.status === 200 && closedLoopResult.data) {
      const closedCards = Array.isArray(closedLoopResult.data) ? closedLoopResult.data : []
      // Tag closed loop cards with their type
      allCards.push(...closedCards.map(card => ({ ...card, type: "close" as const })))
    }
    
    return {
      status: 200,
      message: "Success",
      data: allCards,
    }
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Failed to fetch gift cards",
      data: [],
    }
  }
}

/**
 * Get gift cards based on user type
 * - MERCHANT: Gets OPEN_LOOP cards (Visa/MC prepaid)
 * - USER: Gets CLOSED_LOOP cards (brand-specific)
 * - ADMIN/SUPER_ADMIN: Gets all cards
 */
export async function getGiftCardsForUserType(
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN",
  loopFilter?: "all" | "open" | "closed"
): Promise<ApiResponse<GiftCard[]>> {
  // If specific filter is set, use that
  if (loopFilter === "open") {
    return listGiftCards("open")
  }
  if (loopFilter === "closed") {
    return listGiftCards("close")
  }
  
  // Otherwise, determine based on account type
  switch (accountType) {
    case "MERCHANT":
      // Merchants see Open Loop cards by default
      return listGiftCards("open")
    case "USER":
      // Regular users see Closed Loop cards by default
      return listGiftCards("close")
    case "ADMIN":
    case "SUPER_ADMIN":
      // Admins can see all
      return listAllGiftCards()
    default:
      // Default to closed loop for unknown types
      return listGiftCards("close")
  }
}

// Sort options
export type SortOption = "popularity" | "a-z" | "z-a" | "newest" | "discount" | "price-low" | "price-high"

/**
 * Sort gift cards locally
 */
export function sortGiftCards(cards: GiftCard[], sortBy: SortOption): GiftCard[] {
  const sorted = [...cards]
  
  switch (sortBy) {
    case "a-z":
      return sorted.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""))
    case "z-a":
      return sorted.sort((a, b) => (b.productName || "").localeCompare(a.productName || ""))
    case "newest":
      // API doesn't provide created date, keep original order
      return sorted
    case "discount":
      return sorted.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
    case "price-low":
      return sorted.sort((a, b) => {
        const aMin = getPriceRange(a).min
        const bMin = getPriceRange(b).min
        return aMin - bMin
      })
    case "price-high":
      return sorted.sort((a, b) => {
        const aMax = getPriceRange(a).max
        const bMax = getPriceRange(b).max
        return bMax - aMax
      })
    case "popularity":
    default:
      // For popularity, we keep the original order (API should return popular first)
      return sorted
  }
}

/**
 * Filter gift cards by search term
 */
export function filterGiftCardsBySearch(cards: GiftCard[], searchTerm: string): GiftCard[] {
  if (!searchTerm.trim()) return cards
  
  const term = searchTerm.toLowerCase().trim()
  return cards.filter(card => 
    (card.productName?.toLowerCase().includes(term)) ||
    (card.brand?.brandName?.toLowerCase().includes(term)) ||
    (getCategoryName(card).toLowerCase().includes(term))
  )
}

/**
 * Filter gift cards by category
 */
export function filterGiftCardsByCategory(cards: GiftCard[], categories: string[]): GiftCard[] {
  if (categories.length === 0) return cards
  
  return cards.filter(card => {
    const cardCategory = getCategoryName(card)
    return cardCategory && categories.some(cat => 
      cat.toLowerCase() === cardCategory.toLowerCase()
    )
  })
}

/**
 * Filter gift cards by store/brand
 */
export function filterGiftCardsByStore(cards: GiftCard[], stores: string[]): GiftCard[] {
  if (stores.length === 0) return cards
  
  return cards.filter(card => 
    stores.some(store => 
      store.toLowerCase() === card.productName?.toLowerCase() ||
      store.toLowerCase() === card.brand?.brandName?.toLowerCase()
    )
  )
}

/**
 * Get unique categories from gift cards
 */
export function getUniqueCategories(cards: GiftCard[]): string[] {
  const categories = new Set<string>()
  cards.forEach(card => {
    const categoryName = getCategoryName(card)
    if (categoryName) {
      categories.add(categoryName)
    }
  })
  return Array.from(categories).sort()
}

/**
 * Get unique store/brand names from gift cards
 */
export function getUniqueStores(cards: GiftCard[]): string[] {
  const stores = new Set<string>()
  cards.forEach(card => {
    const brandName = card.brand?.brandName
    if (brandName) {
      stores.add(brandName)
    }
  })
  return Array.from(stores).sort()
}
