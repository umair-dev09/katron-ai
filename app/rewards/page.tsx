import RewardsHeroSection from "@/components/rewards/rewards-hero-section"
import RewardsCardsSection from "@/components/rewards/rewards-cards-section"
import LandingHeader from "@/components/landing/landing-header"

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black">
      <LandingHeader />
      <RewardsHeroSection />
      <RewardsCardsSection />
    </main>
  )
}
