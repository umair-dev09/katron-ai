export default function GiftCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Logo Skeleton */}
      <div className="bg-muted rounded-lg h-48 mb-4" />

      {/* Title Skeleton */}
      <div className="h-5 bg-muted rounded mb-2 w-3/4" />

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>

      {/* Button Skeleton */}
      <div className="h-10 bg-muted rounded" />
    </div>
  )
}
