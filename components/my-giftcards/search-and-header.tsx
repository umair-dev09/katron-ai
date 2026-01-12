"use client"

import { Search, ShoppingBag, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchAndHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function SearchAndHeader({ searchTerm, setSearchTerm }: SearchAndHeaderProps) {
  const router = useRouter()

  // TODO: Connect to backend API
  const totalOrders = 8
  const totalValue = 700

  // Format numbers with leading zero
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num.toString())

  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <div className="space-y-5">
          {/* Page Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Gift Card Orders</h1>
            <p className="text-sm text-muted-foreground">View and manage your gift card orders</p>
          </div>

          {/* Search Bar and Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your gift cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-900/20 text-foreground placeholder:text-muted-foreground focus:border-primary border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Explore More Button */}
            <Button
              onClick={() => router.push("/buy")}
              className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap shadow-sm hover:shadow-md transition-all"
            >
              Explore More Gift Cards
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-around divide-x divide-gray-200 dark:divide-gray-800">
              {/* Total Orders */}
              <div className="flex-1 flex items-center justify-center gap-3 px-4">
                <div className="bg-primary/5 p-2.5 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
                  <p className="text-xl font-bold text-foreground">{formatNumber(totalOrders)}</p>
                </div>
              </div>

              {/* Total Value */}
              <div className="flex-1 flex items-center justify-center gap-3 px-4">
                <div className="bg-emerald-500/5 p-2.5 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Value</p>
                  <p className="text-xl font-bold text-foreground">${formatNumber(totalValue)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
