"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Placeholder images for the carousel - replace these with actual images later
// Left side - outer column (partially visible, going down)
const leftOuterImages = [
  { id: 1, src: "/images/i1.png", alt: "Hero image 1" },
  { id: 2, src: "/images/i2.png", alt: "Hero image 2" },
  { id: 3, src: "/images/i14.png", alt: "Hero image 3" },
  { id: 4, src: "/images/i4.png", alt: "Hero image 4" },
  { id: 5, src: "/images/i11.png", alt: "Hero image 5" },
]

// Left side - inner column (going up)
const leftInnerImages = [
  { id: 6, src: "/images/i6.png", alt: "Hero image 6" },
  { id: 7, src: "/images/i7.png", alt: "Hero image 7" },
  { id: 8, src: "/images/i16.png", alt: "Hero image 8" },
  { id: 9, src: "/images/i9.png", alt: "Hero image 9" },
  { id: 10, src: "/images/i10.png", alt: "Hero image 10" },
]

// Right side - inner column (going up)
const rightInnerImages = [
  { id: 11, src: "/images/i15.png", alt: "Hero image 11" },
  { id: 12, src: "/images/i12.png", alt: "Hero image 12" },
  { id: 13, src: "/images/i13.png", alt: "Hero image 13" },
  { id: 14, src: "/images/i3.png", alt: "Hero image 14" },
  { id: 15, src: "/images/i5.png", alt: "Hero image 15" },
]

// Right side - outer column (partially visible, going down)
const rightOuterImages = [
  { id: 16, src: "/images/i8.png", alt: "Hero image 16" },
  { id: 17, src: "/images/i17.png", alt: "Hero image 17" },
  { id: 18, src: "/images/i18.png", alt: "Hero image 18" },
  { id: 19, src: "/images/i19.png", alt: "Hero image 19" },
  { id: 20, src: "/images/i20.png", alt: "Hero image 20" },
]

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

interface CarouselColumnProps {
  images: typeof leftOuterImages
  direction: "up" | "down"
  speed?: number
  className?: string
  isAnimated: boolean
}

function CarouselColumn({ images, direction, speed = 25, className = "", isAnimated }: CarouselColumnProps) {
  // Triple the images for seamless infinite scroll
  const tripleImages = [...images, ...images, ...images]
  
  // Function to get staggered delay based on index
  const getStaggerDelay = (index: number) => {
    // Only apply stagger to the first set of images (first 5)
    if (index >= images.length) return 0
    if (index < 2) return 0 // First 2 images appear immediately
    if (index < 4) return 200 // Next 2 images appear after 200ms
    return 400 // Rest appear after 400ms
  }
  
  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <div
        className={`flex flex-col gap-3 md:gap-4 ${
          direction === "up" ? "animate-scroll-up" : "animate-scroll-down"
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {tripleImages.map((image, index) => {
          const staggerDelay = getStaggerDelay(index)
          return (
            <div
              key={`${image.id}-${index}`}
              className={`relative aspect-square w-[140px] md:w-[160px] lg:w-[200px] xl:w-[240px] 2xl:w-[280px] overflow-hidden flex-shrink-0 bg-gray-800 shadow-xl ${
                isAnimated 
                  ? "rounded-xl md:rounded-2xl opacity-100 scale-100" 
                  : "rounded-full opacity-0 scale-90"
              }`}
              style={{
                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isAnimated ? `${staggerDelay}ms` : '0ms',
              }}
            >
              {/* Placeholder div - replace with actual Image component when images are ready */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center p-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-lg bg-gray-600/40 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-[10px] md:text-xs font-medium">Placeholder {image.id}</span>
                </div>
              </div>
              Uncomment below when actual images are available
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, (max-width: 1280px) 220px, 240px"
              />
             
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LogoItem({ logo }: { logo: typeof companyLogos[0] }) {
  return (
    <div className="flex items-center  justify-center hover:opacity-80 transition-opacity duration-300 cursor-pointer">
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
    <section className="relative bg-black min-h-[100vh] md:min-h-[106vh] overflow-hidden -mt-[68px]">
      {/* Main content container */}
      <div className="relative flex items-center justify-center min-h-screen pt-[68px]">
        
        {/* ===== LEFT SIDE IMAGE COLUMNS ===== */}
        <div className={`absolute left-0 top-0 bottom-0 hidden md:flex items-center transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Outer left column - more hidden on small, more visible on large */}
          <div 
            className="h-[120vh] -ml-[140px] lg:-ml-[100px] xl:-ml-[60px] 2xl:-ml-[20px]"
            style={{ marginTop: '-10vh' }}
          >
            <CarouselColumn 
              images={leftOuterImages} 
              direction="down" 
              speed={40}
              isAnimated={isLoaded}
            />
          </div>
          
          {/* Inner left column */}
          <div 
            className="h-[120vh] ml-3 lg:ml-4"
            style={{ marginTop: '15vh' }}
          >
            <CarouselColumn 
              images={leftInnerImages} 
              direction="up" 
              speed={35}
              isAnimated={isLoaded}
            />
          </div>
        </div>

        {/* ===== CENTER CONTENT ===== */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 py-20 md:py-14 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {/* Heading with zoom animation */}
          <h1 
            className={`text-3xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-medium  text-white uppercase tracking-tight leading-[0.9] mb-6 md:mb-8 transition-all duration-700 ease-out hero-heading ${
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

        {/* ===== RIGHT SIDE IMAGE COLUMNS ===== */}
        <div className={`absolute right-0 top-0 bottom-0 hidden md:flex items-center transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Inner right column */}
          <div 
            className="h-[120vh] mr-3 lg:mr-4"
            style={{ marginTop: '15vh' }}
          >
            <CarouselColumn 
              images={rightInnerImages} 
              direction="up" 
              speed={38}
              isAnimated={isLoaded}
            />
          </div>
          
          {/* Outer right column - more hidden on small, more visible on large */}
          <div 
            className="h-[120vh] -mr-[140px] lg:-mr-[100px] xl:-mr-[60px] 2xl:-mr-[20px]"
            style={{ marginTop: '-10vh' }}
          >
            <CarouselColumn 
              images={rightOuterImages} 
              direction="down" 
              speed={42}
              isAnimated={isLoaded}
            />
          </div>
        </div>

        {/* ===== MOBILE: Simplified columns ===== */}
        <div className={`absolute left-0 top-0 bottom-0 flex md:hidden items-center transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-40' : 'opacity-0'}`}>
          <div className="h-[120vh] -ml-[100px]">
            <CarouselColumn images={leftOuterImages} direction="down" speed={35} isAnimated={isLoaded} />
          </div>
        </div>
        <div className={`absolute right-0 top-0 bottom-0 flex md:hidden items-center transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-40' : 'opacity-0'}`}>
          <div className="h-[120vh] -mr-[100px]">
            <CarouselColumn images={rightOuterImages} direction="up" speed={35} isAnimated={isLoaded} />
          </div>
        </div>
      </div>

      {/* ===== LOGO STRIP AT BOTTOM ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-30 ">
        <div className="bg-gradient-to-t from-black via-black to-transparent pt-20 pb-6 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 ">
            <div className={`flex items-center justify-center gap-4  sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 flex-wrap transition-all duration-500 ease-out ${
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

      {/* ===== GRADIENT OVERLAYS ===== */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Left side gradient - creates vignette/fade effect for images */}
        <div className="absolute left-0 top-0 bottom-0 w-[14%] md:w-[12%] lg:w-[10%] bg-gradient-to-r from-black via-black/40 to-transparent" />
        
        {/* Right side gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-[14%] md:w-[12%] lg:w-[10%] bg-gradient-to-l from-black via-black/40 to-transparent" />
        
        {/* Top gradient - helps header blend */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />
        
        {/* Bottom area is handled by the logo section gradient */}
      </div>
    </section>
  )
}
