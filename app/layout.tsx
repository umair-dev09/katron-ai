import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import ConditionalHeader from "@/components/conditional-header"
import ConditionalFooter from "@/components/conditional-footer"
import AOS from "@/components/aos"
import { AuthProvider } from "@/lib/auth-context"
import { GoogleOAuthProvider } from "@/components/google-oauth-provider"
import "./globals.css"
import "aos/dist/aos.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const SITE_URL = "https://katronai.com"

export const metadata: Metadata = {
  // ── Improved title & description (SEO audit fix E) ──────────────────
  title: {
    default: "Katron AI | Digital Rewards Platform + Gift Cards for Shoppers & Merchants",
    template: "%s | Katron AI",
  },
  description:
    "Katron AI makes everyday transactions more rewarding. Shop, earn digital rewards, and buy digital gift cards instantly—built for modern commerce.",

  // ── Generator ───────────────────────────────────────────────────────
  generator: "Next.js",

  // ── Canonical base (SEO audit fix C) ────────────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph tags (secondary improvement) ─────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Katron AI",
    title: "Katron AI | Digital Rewards Platform + Gift Cards for Shoppers & Merchants",
    description:
      "Earn instant digital rewards when you shop and access digital gift cards from top brands. Katron AI connects everyday transactions with rewards—simple, fast, and secure.",
    images: [
      {
        url: `${SITE_URL}/katron-ai-logo-bg-transparent.png`,
        width: 1200,
        height: 630,
        alt: "Katron AI — Digital Rewards & Gift Card Platform",
      },
    ],
  },

  // ── Twitter / X card tags (secondary improvement) ───────────────────
  twitter: {
    card: "summary_large_image",
    title: "Katron AI | Digital Rewards Platform + Gift Cards",
    description:
      "Shop, earn digital rewards, and buy digital gift cards instantly. Built for modern commerce.",
    images: [`${SITE_URL}/katron-ai-logo-bg-transparent.png`],
  },

  // ── Misc SEO helpers ────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

// ── Organization JSON-LD (SEO audit fix D) ──────────────────────────
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Katron AI",
  legalName: "KatronAI, Inc.",
  url: SITE_URL,
  logo: `${SITE_URL}/katron-ai-logo-bg-transparent.png`,
  description:
    "Katron AI is a digital rewards platform that connects everyday transactions with rewards and digital gift cards for shoppers and merchants.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5727 Euclid Loop",
    addressLocality: "Rosenberg",
    addressRegion: "TX",
    postalCode: "77469",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@katronai.com",
    telephone: "+1-404-44-47-260",
    contactType: "customer support",
  },
  sameAs: [
    "https://www.instagram.com/katronai",
  ],
}

// ── WebSite JSON-LD (helps with sitelinks in search) ────────────────
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Katron AI",
  url: SITE_URL,
  description:
    "Digital rewards platform and gift card marketplace for shoppers and merchants.",
  publisher: {
    "@type": "Organization",
    name: "Katron AI",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/katron-ai-logo-bg-transparent.png`,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema (SEO audit fix D) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <GoogleOAuthProvider>
            <AOS />
            <ConditionalHeader />
            {children}
            <ConditionalFooter />
            <Toaster position="top-center" richColors />
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
