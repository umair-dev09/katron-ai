"use client"

import Image from "next/image"
import { Clock, Eye } from "lucide-react"
import { type BlogPost, formatBlogDate, formatReadingTime } from "@/lib/api/blog"

interface BlogCardProps {
  blog: BlogPost
  onClick: () => void
}

export default function BlogCard({ blog, onClick }: BlogCardProps) {
  const hasImage = blog.featuredImage && blog.featuredImage.trim() !== ""

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.featuredImageAlt || blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/20">
              {blog.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category Badge */}
        {blog.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-lg shadow-sm">
              {blog.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>{formatBlogDate(blog.createdAt)}</span>
          {blog.readingTime > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatReadingTime(blog.readingTime)}
              </span>
            </>
          )}
          {blog.viewCount !== undefined && blog.viewCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {blog.viewCount}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
          {blog.excerpt || blog.subtitle || ""}
        </p>

        {/* Author */}
        {blog.author && (
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            {blog.author.avatar ? (
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {blog.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {blog.author.name}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
