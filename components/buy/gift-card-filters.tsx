"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface GiftCardFiltersProps {
  selectedFilters: {
    stores: string[]
    categories: string[]
  }
  setSelectedFilters: (filters: any) => void
}

const STORES = ["10kya", "1&1 Ionos", "123apps", "12GO", "1Hour Bazaar", "Cleartrip", "Amazon", "Spotify"]

const CATEGORIES = ["Baby & Kids", "Books", "Education", "Electronics", "Fashion", "Food & Dining", "Gaming", "Travel"]

export default function GiftCardFilters({ selectedFilters, setSelectedFilters }: GiftCardFiltersProps) {
  const [storeSearch, setStoreSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [expandedStores, setExpandedStores] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState(true)

  const handleStoreToggle = (store: string) => {
    setSelectedFilters({
      ...selectedFilters,
      stores: selectedFilters.stores.includes(store)
        ? selectedFilters.stores.filter((s: string) => s !== store)
        : [...selectedFilters.stores, store],
    })
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedFilters({
      ...selectedFilters,
      categories: selectedFilters.categories.includes(category)
        ? selectedFilters.categories.filter((c: string) => c !== category)
        : [...selectedFilters.categories, category],
    })
  }

  const filteredStores = STORES.filter((store) => store.toLowerCase().includes(storeSearch.toLowerCase()))

  const filteredCategories = CATEGORIES.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Store Filter */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setExpandedStores(!expandedStores)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-bold text-foreground">Filter By Store</h3>
          {expandedStores ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {expandedStores && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Store"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                className="pl-10 h-9 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredStores.map((store) => (
                <label key={store} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <Checkbox
                    checked={selectedFilters.stores.includes(store)}
                    onCheckedChange={() => handleStoreToggle(store)}
                    className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-foreground text-sm font-medium">{store}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setExpandedCategories(!expandedCategories)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-bold text-foreground">Filter By Category</h3>
          {expandedCategories ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {expandedCategories && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Category"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 h-9 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredCategories.map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <Checkbox
                    checked={selectedFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-foreground text-sm font-medium">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <Button
        onClick={() =>
          setSelectedFilters({
            stores: [],
            categories: [],
          })
        }
        className="w-full bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-900/30 text-foreground border border-gray-200 dark:border-gray-800 rounded-lg"
      >
        Reset
      </Button>
    </div>
  )
}
