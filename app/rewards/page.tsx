import type { Metadata } from "next"
import RewardsHeroSection from "@/components/rewards/rewards-hero-section"
import RewardsCardsSection from "@/components/rewards/rewards-cards-section"

export const metadata: Metadata = {
  title: "Buy Digital Gift Cards Instantly | Katron AI Gift Card Marketplace",
  description:
    "Buy digital gift cards in minutes and get instant access to top brands. Simple checkout, secure delivery, and rewards built into the experience with Katron AI.",
  alternates: {
    canonical: "https://katronai.com/rewards",
  },
  openGraph: {
    title: "Buy Digital Gift Cards Instantly | Katron AI Gift Card Marketplace",
    description:
      "Buy digital gift cards in minutes and get instant access to top brands. Simple checkout, secure delivery, and rewards built into the experience with Katron AI.",
    url: "https://katronai.com/rewards",
    type: "website",
  },
}

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black">
      <RewardsHeroSection />
      <RewardsCardsSection />
    </main>
  )
}
