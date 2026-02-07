"use client"

import { useEffect, useState } from "react"

// Company logos for the logo strip - popular gift card brands
const companyLogos = [
  { id: 1, name: "Amazon", style: "font-bold" },
  { id: 2, name: "Apple", style: "font-medium" },
  { id: 3, name: "Google Play", style: "font-medium" },
  { id: 4, name: "Netflix", style: "font-bold" },
  { id: 5, name: "Spotify", style: "font-bold" },
  { id: 6, name: "PlayStation", style: "font-bold" },
  { id: 7, name: "Steam", style: "font-bold" },
]

function LogoItem({ logo }: { logo: typeof companyLogos[0] }) {
  return (
    <div className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 cursor-pointer">
      <span className={`text-white text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap ${logo.style}`}>
        {logo.name}
      </span>
    </div>
  )
}

export default function NewHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Start the heading animation immediately
    const timer1 = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    // Show description and button after heading animation
    const timer2 = setTimeout(() => {
      setShowContent(true)
    }, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <section className="relative bg-black min-h-[100vh] md:min-h-[106vh] -mt-[68px]">
      {/* Main content container */}
      <div className="relative flex items-center justify-center min-h-screen pt-[68px]">
        
        {/* ===== CENTER CONTENT ===== */}
        <div className="relative z-40 text-center px-4 sm:px-6 lg:px-8 py-20 md:py-14 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {/* Heading with zoom animation */}
          <h1 
            className={`text-3xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.9] mb-6 md:mb-8 transition-all duration-700 ease-out hero-heading ${
              isLoaded 
                ? "scale-100 opacity-100" 
                : "scale-150 opacity-0"
            }`}
            style={{
              fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            <span className="block">KATRON AI</span>
            <span className="block">The Future of</span>
            <span className="block">Unified Commerce</span>
          </h1>
          
          {/* Description with slide-in animation */}
          <p 
            className={`text-white text-[12px] px-3 sm:text-base md:text-lg max-w-md sm:max-w-md md:max-w-md lg:max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed transition-all duration-500 ease-out ${
              showContent 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            Turn every transaction into a lasting relationship.
            Transform simple payments into real business growth all managed seamlessly in one powerful platform
          </p>
          
          {/* Button with slide-in animation */}
          <button 
            onClick={() => window.location.href = '/auth'}
            className={`bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-6 sm:px-8 py-3 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-500 ease-out hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] ${
              showContent 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
            }`}
            style={{ borderRadius: '8px' }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ===== LOGO STRIP AT BOTTOM ===== */}
      <div className="absolute bottom-0 left-[15%] right-[15%] z-40">
        <div className="bg-gradient-to-t from-black via-black to-transparent pt-12 pb-4 md:pb-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className={`flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 flex-wrap transition-all duration-500 ease-out ${
              showContent 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}>
              {companyLogos.map((logo) => (
                <LogoItem key={logo.id} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
