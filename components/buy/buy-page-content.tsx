"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import GiftCardGrid from "@/components/buy/gift-card-grid"
import GiftCardFilters from "@/components/buy/gift-card-filters"
import SearchAndFilters from "@/components/buy/search-and-filters"
import GiftCardPagination from "@/components/buy/gift-card-pagination"
import SeoContentSection from "@/components/buy/seo-content-section"
import { useAuth } from "@/lib/auth-context"
import { 
  GiftCard, 
  listGiftCards, 
  listAllGiftCards,
  sortGiftCards, 
  filterGiftCardsBySearch,
  filterGiftCardsByCategory,
  filterGiftCardsByStore,
  getUniqueCategories,
  getUniqueStores,
  SortOption
} from "@/lib/api/gift-cards"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 12

export default function BuyPageContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Data state
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter/search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLoop, setSelectedLoop] = useState<"all" | "open" | "closed">("closed")
  const [sortBy, setSortBy] = useState<SortOption>("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState({
    stores: [] as string[],
    categories: [] as string[],
  })

  // Fetch gift cards based on user type and loop filter
  const fetchGiftCards = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let result
      let fetchedType: "open" | "close" | "all" = "close"
      
      // Determine what to fetch based on loop filter
      if (selectedLoop === "open") {
        result = await listGiftCards("open")
        fetchedType = "open"
      } else if (selectedLoop === "closed") {
        result = await listGiftCards("close")
        fetchedType = "close"
      } else {
        // "all" - show both open and closed loop cards combined
        if (!isAuthenticated || !user) {
          // Not logged in - show closed loop only
          result = await listGiftCards("close")
          fetchedType = "close"
        } else if (user.accountType === "MERCHANT" || user.accountType === "ADMIN" || user.accountType === "SUPER_ADMIN") {
          // Merchant and Admin - show all cards (both types combined)
          result = await listAllGiftCards()
          fetchedType = "all"
        } else {
          // Regular user - show closed loop only
          result = await listGiftCards("close")
          fetchedType = "close"
        }
      }
      
      if (result.status === 200 && result.data) {
        let cards = Array.isArray(result.data) ? result.data : []
        
        // Tag cards with their type (API doesn't include this field)
        if (fetchedType !== "all") {
          cards = cards.map(card => ({ ...card, type: fetchedType as "open" | "close" }))
        }
        // For "all", cards from listAllGiftCards are already mixed, 
        // we need to tag them based on which API they came from
        // This is handled in listAllGiftCards function
        
        setGiftCards(cards)
      } else {
        setError(result.message || "Failed to load gift cards")
        toast.error(result.message || "Failed to load gift cards")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedLoop, isAuthenticated, user])

  // Fetch on mount and when filters change
  useEffect(() => {
    if (!authLoading) {
      fetchGiftCards()
    }
  }, [fetchGiftCards, authLoading])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedLoop, sortBy, selectedFilters])

  // Get unique categories and stores for filter dropdowns
  const availableCategories = useMemo(() => getUniqueCategories(giftCards), [giftCards])
  const availableStores = useMemo(() => getUniqueStores(giftCards), [giftCards])

  // Apply filters and sorting
  const filteredAndSortedCards = useMemo(() => {
    let result = [...giftCards]
    
    // Apply search filter
    result = filterGiftCardsBySearch(result, searchTerm)
    
    // Apply category filter
    result = filterGiftCardsByCategory(result, selectedFilters.categories)
    
    // Apply store filter
    result = filterGiftCardsByStore(result, selectedFilters.stores)
    
    // Apply sorting
    result = sortGiftCards(result, sortBy)
    
    return result
  }, [giftCards, searchTerm, selectedFilters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCards.length / ITEMS_PER_PAGE)
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedCards.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedCards, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Determine which loop filters to show based on user type
  // Only MERCHANT and ADMIN users can switch between open/closed loop
  const showLoopFilters = useMemo(() => {
    if (!isAuthenticated || !user) {
      // Not logged in - don't show loop filters
      return false
    }
    
    switch (user.accountType) {
      case "MERCHANT":
        // Merchants can switch between open and closed loop
        return true
      case "ADMIN":
      case "SUPER_ADMIN":
        // Admins can see everything
        return true
      case "USER":
      default:
        // Regular users only see closed loop, no filter needed
        return false
    }
  }, [isAuthenticated, user])

  // Determine if we should show type badge on cards
  const showTypeBadge = showLoopFilters

  return (
    <main className="min-h-screen bg-background">
      {/* Header and Search */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLoop={selectedLoop}
        setSelectedLoop={setSelectedLoop}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showLoopFilters={showLoopFilters}
        userType={user?.accountType}
      />

      {/* Main Content */}
      <div className="flex gap-6 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Sidebar Filters - 20% */}
        <aside className="w-full md:w-1/5 hidden md:block sticky top-4 self-start">
          <GiftCardFilters 
            selectedFilters={selectedFilters} 
            setSelectedFilters={setSelectedFilters}
            availableCategories={availableCategories}
            availableStores={availableStores}
          />
        </aside>

        {/* Gift Cards Grid - 80% */}
        <section className="w-full md:w-4/5">
          <GiftCardGrid 
            cards={paginatedCards}
            isLoading={isLoading || authLoading} 
            error={error}
            totalCount={filteredAndSortedCards.length}
            onRetry={fetchGiftCards}
            showTypeBadge={showTypeBadge}
          />
          
          {/* Pagination */}
          {!isLoading && !error && filteredAndSortedCards.length > 0 && (
            <GiftCardPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>

      {/* SEO Content Section - Full Width, No Sidebar */}
      <SeoContentSection />
    </main>
  )
}
