import type { MetadataRoute } from "next"

// Required for `output: 'export'` in next.config.mjs
export const dynamic = "force-static"

const BASE_URL = "https://katronai.com"

// All published reward-item slugs (must match rewards/[reward-item]/page.tsx)
const rewardSlugs = [
  "airbnb", "amazon", "barnes-and-noble", "bath-and-body-works",
  "chipotle", "cvs", "dicks-sporting-goods", "dunkin", "gamestop",
  "google", "nike", "old-navy", "panera", "papa-johns", "playstation",
  "roblox", "starbucks", "target", "uber", "ulta", "visa", "xbox",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // Core public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/rewards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/api-docs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/auth`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/private-key-notice`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  // Individual gift card / reward pages
  const rewardPages: MetadataRoute.Sitemap = rewardSlugs.map((slug) => ({
    url: `${BASE_URL}/rewards/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...rewardPages]
}
