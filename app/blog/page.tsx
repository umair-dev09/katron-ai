import type { Metadata } from "next"
import { Suspense } from "react"
import BlogPageContent from "@/components/blog/blog-page-content"

export const metadata: Metadata = {
  title: "Blog — Insights on Digital Rewards, Gift Cards & Fintech",
  description:
    "Stay updated with the latest insights on digital gift cards, fintech innovation, digital commerce trends, and reward strategies from the Katron AI team.",
  alternates: {
    canonical: "https://katronai.com/blog",
  },
  openGraph: {
    title: "Blog — Insights on Digital Rewards, Gift Cards & Fintech | Katron AI",
    description:
      "Stay updated with the latest insights on digital gift cards, fintech innovation, digital commerce trends, and reward strategies from the Katron AI team.",
    url: "https://katronai.com/blog",
    type: "website",
  },
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BlogPageContent />
    </Suspense>
  )
}
