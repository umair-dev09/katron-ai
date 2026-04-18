import BlogArticleContent from "@/components/blog/blog-article-content"

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>
}

// With output: 'export', only pre-generated params are valid — reject anything else at runtime.
export const dynamicParams = false

// Required for static export with dynamic routes.
// Fetches all published slugs from /api/blogs/listBlogs at build time.
// Uses a large pageSize to collect every slug in one request; paginates if needed.
export async function generateStaticParams() {
  const BASE = "https://api.ktngiftcard.katronai.com/katron-gift-card"
  const slugs: string[] = []

  try {
    let page = 1
    const pageSize = 200

    while (true) {
      const res = await fetch(
        `${BASE}/api/blogs/listBlogs?status=PUBLISHED&page=${page}&pageSize=${pageSize}&sortBy=publishedAt&sortOrder=DESC`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      )

      if (!res.ok) break

      const data = await res.json()
      const items: Array<{ slug?: string }> =
        data?.data?.content ?? data?.data?.blogs ?? data?.data?.items ?? []

      for (const blog of items) {
        if (blog.slug) slugs.push(blog.slug)
      }

      const totalPages: number = data?.data?.totalPages ?? 1
      if (page >= totalPages) break
      page++
    }
  } catch (error) {
    console.error("[Blog] generateStaticParams: failed to fetch slugs:", error)
  }

  // Must return at least one entry with output: 'export' so Next.js emits the route.
  if (slugs.length === 0) {
    return [{ slug: "_placeholder" }]
  }

  return slugs.map((slug) => ({ slug }))
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  return <BlogArticleContent slug={slug} />
}
