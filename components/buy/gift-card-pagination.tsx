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
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handlePrevious()
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-900/50"}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
                isActive={currentPage === page}
                className={currentPage === page 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-900/50"
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handleNext()
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-900/50"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
