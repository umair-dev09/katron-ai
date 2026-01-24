"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortOption } from "@/lib/api/gift-cards"

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedLoop: "all" | "open" | "closed"
  setSelectedLoop: (loop: "all" | "open" | "closed") => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  showLoopFilters?: boolean
  userType?: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN"
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  selectedLoop,
  setSelectedLoop,
  sortBy,
  setSortBy,
  showLoopFilters = false,
  userType,
}: SearchAndFiltersProps) {
  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {userType === "MERCHANT" ? "Buy Prepaid Cards" : "Buy Gift Cards"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {userType === "MERCHANT" 
              ? "Purchase Visa/Mastercard prepaid gift cards for your business needs"
              : "Choose from hundreds of popular brand gift cards"
            }
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gift cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-900/20 text-foreground placeholder:text-muted-foreground focus:border-primary border-gray-200 dark:border-gray-800"
            />
          </div>
        </div>

        {/* Filter and Sort Row */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Loop Filters - Only show for MERCHANT/ADMIN users */}
          {showLoopFilters && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLoop("all")}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all text-[15px] ${
                  selectedLoop === "all"
                    ? "bg-primary text-primary-foreground border border-gray-800"
                    : "bg-gray-50 dark:bg-gray-900/20 text-foreground border dark:border-gray-800 hover:bg-gray-100  dark:hover:bg-gray-900/30 "
                }`}
              >
                All Cards
              </button>
              <button
                onClick={() => setSelectedLoop("open")}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-[15px] ${
                  selectedLoop === "open"
                    ? "bg-primary text-primary-foreground border border-gray-800 "
                    : "bg-gray-50 dark:bg-gray-900/20 text-foreground border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/30 "
                }`}
                title="Visa/Mastercard prepaid cards usable anywhere"
              >
                Open Loop
              </button>
              <button
                onClick={() => setSelectedLoop("closed")}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-[15px] ${
                selectedLoop === "closed"
                  ? "bg-primary text-primary-foreground border border-gray-800"
                  : "bg-gray-50 dark:bg-gray-900/20 text-foreground border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/30"
                }`}
                title="Brand-specific gift cards"
              >
                Closed Loop
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-foreground font-medium text-sm whitespace-nowrap">Sort by</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full md:w-44 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <SelectItem value="popularity" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Popularity</SelectItem>
                <SelectItem value="a-z" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">A - Z</SelectItem>
                <SelectItem value="z-a" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Z - A</SelectItem>
                <SelectItem value="newest" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Newest</SelectItem>
                <SelectItem value="discount" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Highest Discount</SelectItem>
                <SelectItem value="price-low" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
