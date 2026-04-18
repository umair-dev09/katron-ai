export default function BlogArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pt-24">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Article header */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-10 pb-8">
        {/* Category */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-7 w-24 bg-gray-200 rounded-lg" />
          <div className="h-7 w-16 bg-gray-100 rounded-lg" />
        </div>

        {/* Title */}
        <div className="h-10 w-full bg-gray-200 rounded mb-3" />
        <div className="h-10 w-4/5 bg-gray-200 rounded mb-6" />

        {/* Meta */}
        <div className="flex items-center gap-6 mb-8">
          <div className="h-4 w-28 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-48 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-10">
        <div className="w-full aspect-[2/1] bg-gray-200 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
          <div className="h-8 w-2/3 bg-gray-200 rounded mt-8 mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-52 w-full bg-gray-100 rounded-xl mt-6 mb-6" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-4/5 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
