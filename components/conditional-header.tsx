"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"

export default function ConditionalHeader() {
  const pathname = usePathname()

  // Don't show main header on landing page (home page), rewards page, and legal pages
  if (pathname === "/" || pathname === "/rewards" || pathname === "/privacy-policy" || pathname === "/terms-of-service") {
    return null
  }

  return <Header />
}
