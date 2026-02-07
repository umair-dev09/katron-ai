import NewHeroSection from "@/components/landing/new-hero-section"
import ProductsSection from "@/components/landing/products-section"
import SpotlightSection from "@/components/landing/spotlight-section"
import StatsSection from "@/components/landing/stats-section"
import VideoZoomSection from "@/components/landing/video-zoom-section"
import CTAWithImageSection from "@/components/landing/cta-with-image-section"
import LatestArticlesSection from "@/components/landing/latest-articles-section"
import DeveloperResourcesSection from "@/components/landing/developer-resources-section"
import FAQSection from "@/components/landing/faq-section"
import LandingHeader from "@/components/landing/landing-header"
import SideCarousel from "@/components/landing/side-carousel"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <LandingHeader />
      
      {/* Sections with side carousels */}
      <div className="relative overflow-x-clip">
        <NewHeroSection />
        <ProductsSection />
        <SpotlightSection />
        <StatsSection />
        <VideoZoomSection />
        <CTAWithImageSection />
        
        {/* Side carousels - only visible in above sections */}
        <SideCarousel />
      </div>
      
      {/* Sections without carousels */}
      <LatestArticlesSection />
      <DeveloperResourcesSection />
      <FAQSection />
    </main>
  )
}
 