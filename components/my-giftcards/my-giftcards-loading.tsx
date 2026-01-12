"use client"

export default function MyGiftCardsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border">
        <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
          <div className="h-20 bg-gray-100 dark:bg-gray-900/20 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-gray-900/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
