"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  ChevronRight,
} from "lucide-react"
import {
  getBlogBySlug,
  incrementBlogViewCount,
  listPublishedBlogs,
  formatBlogDate,
  formatReadingTime,
  type BlogPost,
} from "@/lib/api/blog"
import BlogArticleSkeleton from "./blog-article-skeleton"

interface BlogArticleContentProps {
  slug: string
}

export default function BlogArticleContent({ slug }: BlogArticleContentProps) {
  const router = useRouter()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [readProgress, setReadProgress] = useState(0)

  // Fetch blog
  const fetchBlog = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getBlogBySlug(slug)

      if (result.status === 200 && result.data) {
        setBlog(result.data)

        // Increment view count
        if (result.data.id) {
          incrementBlogViewCount(result.data.id)
        }

        // Fetch related blogs in the same category
        const relatedResult = await listPublishedBlogs({
          status: "PUBLISHED",
          category: result.data.category || undefined,
          pageSize: 4,
          page: 0,
        })

        if (relatedResult.status === 200) {
          setRelatedBlogs(
            relatedResult.data.content
              .filter((b) => b.id !== result.data!.id)
              .slice(0, 3)
          )
        }
      } else {
        setError("Article not found")
      }
    } catch (err) {
      console.error("Failed to fetch blog:", err)
      setError("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  // Read progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById("blog-article-content")
      if (!article) return

      const rect = article.getBoundingClientRect()
      const articleHeight = rect.height
      const viewportHeight = window.innerHeight
      const scrolledPast = Math.max(0, -rect.top)
      const progress = Math.min(
        100,
        (scrolledPast / (articleHeight - viewportHeight)) * 100
      )
      setReadProgress(Math.max(0, progress))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [blog])

  // Share handlers
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = blog?.title || ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement("input")
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  const handleShareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      "_blank"
    )
  }

  // Loading state
  if (isLoading) {
    return <BlogArticleSkeleton />
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center py-24">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {error || "Article not found"}
          </h1>
          <p className="text-gray-500 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Back Button & Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pt-24">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-400 truncate max-w-[200px] md:max-w-md">
              {blog.title}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 md:px-8 pt-10 pb-8">
        {/* Category & Tags */}
        <div className="flex items-center flex-wrap gap-2 mb-6">
          {blog.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(blog.category)}`}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors"
            >
              {blog.category}
            </Link>
          )}
          {blog.tagList?.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
          {blog.title}
        </h1>

        {/* Subtitle */}
        {blog.subtitle && (
          <p className="text-xl text-gray-500 leading-relaxed mb-6">
            {blog.subtitle}
          </p>
        )}

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatBlogDate(blog.createdAt)}
          </span>
          {blog.readingTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatReadingTime(blog.readingTime)}
            </span>
          )}
          {blog.viewCount !== undefined && blog.viewCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {blog.viewCount.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Author */}
        {blog.author && (
          <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
            {blog.author.avatar ? (
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-gray-100">
                <span className="text-lg font-bold text-primary">
                  {blog.author.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{blog.author.name}</p>
              {blog.author.bio && (
                <p className="text-sm text-gray-500 line-clamp-1">
                  {blog.author.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 mb-10">
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex gap-12">
        {/* Share Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col items-center gap-3 sticky top-28 h-fit pt-4">
          <span className="text-xs font-medium text-gray-400 mb-1">Share</span>
          <button
            onClick={handleShareTwitter}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Share on X (Twitter)"
          >
            <Twitter className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleShareFacebook}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleShareLinkedin}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Copy link"
          >
            {linkCopied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Link2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </aside>

        {/* Article Body */}
        <article
          id="blog-article-content"
          className="flex-1 min-w-0 pb-16"
        >
          {/* Rich HTML Content */}
          <div
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-700
              prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800
              prose-pre:bg-gray-950 prose-pre:rounded-xl prose-pre:shadow-lg
              prose-img:rounded-xl prose-img:shadow-md
              prose-ul:text-gray-600 prose-ol:text-gray-600
              prose-li:marker:text-primary/60
              prose-table:border-collapse
              prose-th:bg-gray-100 prose-th:text-left prose-th:p-3 prose-th:font-semibold
              prose-td:p-3 prose-td:border-t prose-td:border-gray-200
              prose-hr:border-gray-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Mobile Share Bar */}
          <div className="lg:hidden flex items-center justify-center gap-3 pt-8 mt-8 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-500 mr-2">
              <Share2 className="w-4 h-4 inline mr-1.5" />
              Share
            </span>
            <button
              onClick={handleShareTwitter}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Twitter className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleShareFacebook}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleShareLinkedin}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              {linkCopied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Link2 className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </article>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 mt-16 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Related Articles
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                    {relatedBlog.featuredImage ? (
                      <Image
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.featuredImageAlt || relatedBlog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary/20">
                          {relatedBlog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>{formatBlogDate(relatedBlog.createdAt)}</span>
                      {relatedBlog.readingTime > 0 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>
                            {formatReadingTime(relatedBlog.readingTime)}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                      {relatedBlog.title}
                    </h3>
                    {relatedBlog.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                        {relatedBlog.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Updated
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6">
            Discover more insights about gift cards, fintech, and digital commerce on our blog.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-primary/20"
          >
            Explore All Articles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
