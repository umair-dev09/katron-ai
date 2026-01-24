"use client"

import { Search, ShoppingBag, DollarSign, CheckCircle, Clock, XCircle, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type OrderStats, formatCurrency } from "@/lib/api/orders"

interface SearchAndHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  stats: OrderStats | null
  isLoading: boolean
}

export default function SearchAndHeader({ 
  searchTerm, 
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  stats,
  isLoading
}: SearchAndHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <div className="space-y-5">
          {/* Page Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Gift Card Orders</h1>
            <p className="text-sm text-muted-foreground">View and manage your gift card orders</p>
          </div>

          {/* Search Bar, Filter and Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search orders by brand, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-900/20 text-foreground placeholder:text-muted-foreground focus:border-primary border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full sm:w-[160px] bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

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
            {isLoading ? (
              <div className="flex items-center justify-around divide-x divide-gray-200 dark:divide-gray-800">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 flex items-center justify-center gap-3 px-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-gray-200 dark:divide-gray-800">
                {/* Total Orders */}
                <div className="flex items-center justify-center gap-3 px-4">
                  <div className="bg-primary/5 p-2.5 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
                    <p className="text-xl font-bold text-foreground">{stats?.totalOrders ?? 0}</p>
                  </div>
                </div>

                {/* Total Value */}
                <div className="flex items-center justify-center gap-3 px-4">
                  <div className="bg-emerald-500/5 p-2.5 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Value</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(stats?.totalValue ?? 0)}</p>
                  </div>
                </div>

                {/* Completed */}
                <div className="flex items-center justify-center gap-3 px-4">
                  <div className="bg-green-500/5 p-2.5 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Completed</p>
                    <p className="text-xl font-bold text-foreground">{stats?.completedOrders ?? 0}</p>
                  </div>
                </div>

                {/* Pending */}
                <div className="flex items-center justify-center gap-3 px-4">
                  <div className="bg-yellow-500/5 p-2.5 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Pending</p>
                    <p className="text-xl font-bold text-foreground">{stats?.pendingOrders ?? 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
