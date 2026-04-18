import type { Metadata } from "next"
import ApiDocsPageContent from "@/components/api-docs/api-docs-page-content"

export const metadata: Metadata = {
  title: "Merchant API Documentation — Integrate Gift Card Purchasing",
  description:
    "Complete API documentation for the KTN Gift Card Merchant API. Learn how to integrate gift card purchasing, manage orders, and retrieve credentials with simple Bearer token auth.",
  alternates: {
    canonical: "https://katronai.com/api-docs",
  },
  openGraph: {
    title: "Merchant API Documentation | Katron AI",
    description:
      "Complete API documentation for the KTN Gift Card Merchant API. Integrate gift card purchasing into your applications.",
    url: "https://katronai.com/api-docs",
    type: "website",
  },
}

export default function ApiDocsPage() {
  return <ApiDocsPageContent />
}
