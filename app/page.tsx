import HeroHome from "@/components/hero-home"
import BusinessCategories from "@/components/business-categories"
import FeaturesPlanet from "@/components/features-planet"
import HowItWorksHome from "@/components/how-it-works-home"
import AppDownloadSection from "@/components/app-download-section"
import LargeTestimonial from "@/components/large-testimonial"
import Cta from "@/components/cta"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroHome />
      {/* <BusinessCategories /> */}
      <FeaturesPlanet />
      <HowItWorksHome />
      <AppDownloadSection />
      <LargeTestimonial />
      <Cta />
    </main>
  )
}
 