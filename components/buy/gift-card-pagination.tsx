"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface GiftCardPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function GiftCardPagination({ currentPage, totalPages, onPageChange }: GiftCardPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="mt-12 mb-8">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handlePrevious()
              }}
              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-900/50"}`}
            />
          </PaginationItem>
          
          {/* Show limited pages on mobile */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // On mobile, only show first, last, current, and adjacent pages
            const showPage = 
              page === 1 || 
              page === totalPages || 
              Math.abs(page - currentPage) <= 1
            
            if (!showPage && page === 2 && currentPage > 3) {
              return (
                <PaginationItem key={page} className="hidden sm:flex">
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            
            if (!showPage && page === totalPages - 1 && currentPage < totalPages - 2) {
              return (
                <PaginationItem key={page} className="hidden sm:flex">
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            
            if (!showPage) return null
            
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(page)
                  }}
                  isActive={currentPage === page}
                  className={`min-w-[40px] h-10 ${currentPage === page 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-900/50"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handleNext()
              }}
              className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-900/50"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
