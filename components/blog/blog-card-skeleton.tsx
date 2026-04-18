export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[16/10] bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Title */}
        <div className="h-5 w-full bg-gray-200 rounded mb-2" />
        <div className="h-5 w-4/5 bg-gray-200 rounded mb-3" />

        {/* Excerpt */}
        <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
        <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
        <div className="h-3 w-3/4 bg-gray-100 rounded mb-4" />

        {/* Author */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <div className="w-7 h-7 rounded-full bg-gray-200" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
