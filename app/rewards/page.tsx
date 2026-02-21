import RewardsHeroSection from "@/components/rewards/rewards-hero-section"
import RewardsCardsSection from "@/components/rewards/rewards-cards-section"

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black">
      <RewardsHeroSection />
      <RewardsCardsSection />
    </main>
  )
}
