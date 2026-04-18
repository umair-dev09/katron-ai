import type { MetadataRoute } from "next"

// Required for `output: 'export'` in next.config.mjs
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/buy/",
          "/buy",
          "/checkout/",
          "/checkout",
          "/settings/",
          "/settings",
          "/my-giftcards/",
          "/my-giftcards",
          "/merchant-api/",
          "/merchant-api",
          "/crypto-payment-demo/",
          "/crypto-payment-demo",
        ],
      },
    ],
    sitemap: "https://katronai.com/sitemap.xml",
  }
}
