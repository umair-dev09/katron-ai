import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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

export const metadata: Metadata = {
  title: "Katron AI",
  description: "Future of unified commerce.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <GoogleOAuthProvider>
            <AOS />
            <ConditionalHeader />
            {children}
            <ConditionalFooter />
            <Toaster position="top-center" richColors />
            <Analytics />
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
