import GiftCardSkeleton from "./gift-card-skeleton"

export default function BuyPageLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-background border-b border-border px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-11 bg-muted rounded-lg w-full" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded-lg w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex gap-6 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <aside className="w-full md:w-1/5 hidden md:block space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-secondary rounded-lg p-4 h-64" />
          ))}
        </aside>

        <section className="w-full md:w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <GiftCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
