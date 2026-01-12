"use client"

import { useState, useEffect } from "react"
import GiftCardGrid from "@/components/buy/gift-card-grid"
import GiftCardFilters from "@/components/buy/gift-card-filters"
import SearchAndFilters from "@/components/buy/search-and-filters"
import GiftCardPagination from "@/components/buy/gift-card-pagination"
import SeoContentSection from "@/components/buy/seo-content-section"

export default function BuyPageContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLoop, setSelectedLoop] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState({
    stores: [],
    categories: [],
  })

  const totalPages = 5 // You can make this dynamic based on your data

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of gift cards section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      />

      {/* Main Content */}
      <div className="flex gap-6 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Sidebar Filters - 20% */}
        <aside className="w-full md:w-1/5 hidden md:block sticky top-4 self-start">
          <GiftCardFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        </aside>

        {/* Gift Cards Grid - 80% */}
        <section className="w-full md:w-4/5">
          <GiftCardGrid isLoading={isLoading} searchTerm={searchTerm} />
          
          {/* Pagination */}
          {!isLoading && (
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
