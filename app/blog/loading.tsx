import BlogCardSkeleton from "@/components/blog/blog-card-skeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center animate-pulse">
          <div className="h-6 w-32 bg-white/10 rounded-full mx-auto mb-6" />
          <div className="h-14 w-96 max-w-full bg-white/10 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-80 max-w-full bg-white/5 rounded mx-auto" />
        </div>
      </div>

      {/* Search Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto mb-10">
          <div className="h-14 w-full bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-100 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
