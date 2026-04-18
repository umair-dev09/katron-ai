"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import {
  listPublishedBlogs,
  listBlogCategories,
  type BlogPost,
  type BlogCategory,
} from "@/lib/api/blog"
import BlogCard from "./blog-card"
import BlogCardSkeleton from "./blog-card-skeleton"
import BlogHero from "./blog-hero"

export default function BlogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const PAGE_SIZE = 12

  // Initialize from URL params
  useEffect(() => {
    const cat = searchParams.get("category")
    const search = searchParams.get("search")
    const page = searchParams.get("page")

    if (cat) setSelectedCategory(cat)
    if (search) {
      setSearchQuery(search)
      setDebouncedSearch(search)
    }
    if (page) setCurrentPage(parseInt(page) - 1)
  }, [searchParams])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(0)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const result = await listBlogCategories()
      if (result.status === 200 && result.data.length > 0) {
        setCategories(result.data)
      }
    }
    fetchCategories()
  }, [])

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await listPublishedBlogs({
        status: "PUBLISHED",
        page: currentPage,
        pageSize: PAGE_SIZE,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: debouncedSearch || undefined,
      })

      if (result.status === 200) {
        setBlogs(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
      } else {
        setBlogs([])
        setTotalPages(0)
        setTotalElements(0)
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      setBlogs([])
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [currentPage, selectedCategory, debouncedSearch])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== "All") params.set("category", selectedCategory)
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (currentPage > 0) params.set("page", (currentPage + 1).toString())

    const newUrl = params.toString() ? `/blog?${params.toString()}` : "/blog"
    router.replace(newUrl, { scroll: false })
  }, [selectedCategory, debouncedSearch, currentPage, router])

  // Event handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(0)
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsSearching(true)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setCurrentPage(0)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleBlogClick = (blog: BlogPost) => {
    router.push(`/blog/${blog.slug}`)
  }

  // Category tabs (including "All")
  const categoryTabs = ["All", ...categories.map((c) => c.name)]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BlogHero />

      {/* Search & Filters Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search articles"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-14 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-lg shadow-gray-200/50"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {categoryTabs.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {/* Results Count */}
        {!isLoading && totalElements > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            {totalElements} article{totalElements !== 1 ? "s" : ""} found
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Blog Cards Grid */}
        {!isLoading && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onClick={() => handleBlogClick(blog)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {debouncedSearch
                ? `We couldn't find any articles matching "${debouncedSearch}". Try adjusting your search or browse all categories.`
                : "No articles are available in this category yet. Check back soon!"}
            </p>
            {(debouncedSearch || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  clearSearch()
                  setSelectedCategory("All")
                }}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                View All Articles
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {generatePageNumbers(currentPage, totalPages).map((pageNum, idx) =>
              pageNum === -1 ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-10 h-10 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum + 1}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper to generate page number array with ellipsis
function generatePageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const pages: number[] = []
  pages.push(0)

  if (current > 3) pages.push(-1)

  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 4) pages.push(-1)

  pages.push(total - 1)
  return pages
}
