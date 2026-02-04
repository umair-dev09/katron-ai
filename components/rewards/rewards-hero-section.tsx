"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Brand cards with colorful backgrounds inspired by the reference image
const brandCards = [
  { 
    id: 1, 
    logo: "/logos/amazon-logo.svg", 
    name: "Amazon", 
    bgGradient: "from-orange-500 via-orange-400 to-amber-500",
    position: "top-[15%] left-[5%]",
    mobilePosition: "top-[12%] left-[2%]",
    rotation: "-12deg",
    delay: 0,
    size: "w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-32",
    mobileSize: "w-20 h-14"
  },
  { 
    id: 2, 
    logo: "/logos/netflix-logo.svg", 
    name: "Netflix", 
    bgGradient: "from-red-600 via-red-500 to-rose-500",
    position: "top-[40%] left-[3%]",
    mobilePosition: "top-[30%] left-[0%]",
    rotation: "8deg",
    delay: 100,
    size: "w-28 h-20 md:w-36 md:h-24 lg:w-44 lg:h-28",
    mobileSize: "w-18 h-12"
  },
  { 
    id: 3, 
    logo: "/logos/spotify-logo.svg", 
    name: "Spotify", 
    bgGradient: "from-green-500 via-green-400 to-emerald-400",
    position: "bottom-[15%] left-[5%]",
    mobilePosition: "bottom-[25%] left-[1%]",
    rotation: "-10deg",
    delay: 200,
    size: "w-28 h-20 md:w-36 md:h-24 lg:w-44 lg:h-28",
    mobileSize: "w-18 h-12"
  },
  { 
    id: 4, 
    logo: "/logos/visa-logo.svg", 
    name: "Visa", 
    bgGradient: "from-blue-600 via-blue-500 to-indigo-500",
    position: "top-[15%] right-[5%]",
    mobilePosition: "top-[14%] right-[2%]",
    rotation: "10deg",
    delay: 300,
    size: "w-28 h-20 md:w-36 md:h-24 lg:w-44 lg:h-28",
    mobileSize: "w-16 h-10"
  },
  { 
    id: 5, 
    logo: "/logos/apple-logo.svg", 
    name: "Apple", 
    bgGradient: "from-gray-700 via-gray-600 to-slate-600",
    position: "top-[40%] right-[3%]",
    mobilePosition: "top-[50%] right-[1%]",
    rotation: "-8deg",
    delay: 400,
    size: "w-28 h-20 md:w-36 md:h-24 lg:w-44 lg:h-28",
    mobileSize: "w-18 h-12"
  },
  { 
    id: 6, 
    logo: "/logos/ea-logo.svg", 
    name: "EA", 
    bgGradient: "from-slate-700 via-slate-600 to-gray-600",
    position: "bottom-[15%] right-[5%]",
    mobilePosition: "bottom-[5%] right-[2%]",
    rotation: "12deg",
    delay: 500,
    size: "w-28 h-20 md:w-36 md:h-24 lg:w-44 lg:h-28",
    mobileSize: "w-16 h-10"
  },
]

// Floating decorative elements (coins/stars)
const floatingElements = [
  { id: 1, type: "coin", position: "top-[12%] left-[20%]", size: "w-10 h-10 md:w-12 md:h-12", delay: 0 },
  { id: 2, type: "coin", position: "top-[18%] right-[22%]", size: "w-8 h-8 md:w-10 md:h-10", delay: 150 },
  { id: 3, type: "star", position: "top-[6%] right-[38%]", size: "w-8 h-8 md:w-10 md:h-10", delay: 300 },
  { id: 4, type: "star", position: "top-[4%] left-[45%]", size: "w-5 h-5 md:w-6 md:h-6", delay: 200 },
  { id: 5, type: "coin", position: "bottom-[28%] left-[22%]", size: "w-9 h-9 md:w-11 md:h-11", delay: 400 },
  { id: 6, type: "star", position: "bottom-[22%] right-[28%]", size: "w-6 h-6 md:w-8 md:h-8", delay: 250 },
  { id: 7, type: "sparkle", position: "top-[10%] right-[32%]", size: "w-4 h-4 md:w-5 md:h-5", delay: 100 },
  { id: 8, type: "sparkle", position: "bottom-[35%] right-[18%]", size: "w-5 h-5 md:w-6 md:h-6", delay: 350 },
  { id: 9, type: "star", position: "top-[8%] left-[32%]", size: "w-6 h-6 md:w-7 md:h-7", delay: 450 },
  { id: 10, type: "sparkle", position: "bottom-[15%] left-[28%]", size: "w-4 h-4 md:w-5 md:h-5", delay: 180 },
]

// Animated counter component
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * target))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  // Format number with commas
  const formattedNumber = count.toLocaleString('en-US')

  return (
    <div ref={counterRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[120px] font-bold text-amber-400">
      <span className="text-amber-400">$</span>
      {formattedNumber.split('').map((char, index) => (
        <span 
          key={index} 
          className={char === ',' ? 'text-amber-400/80' : 'text-amber-400'}
          style={{ 
            display: 'inline-block',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

// Brand card component with floating animation
function BrandCard({ card, isVisible }: { card: typeof brandCards[0]; isVisible: boolean }) {
  return (
    <>
      {/* Desktop version */}
      <div
        className={`absolute ${card.position} ${card.size} rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 ease-out hidden md:block`}
        style={{
          transform: isVisible 
            ? `rotate(${card.rotation}) translateY(0) scale(1)` 
            : `rotate(${card.rotation}) translateY(30px) scale(0.8)`,
          opacity: isVisible ? 1 : 0,
          transitionDelay: `${card.delay}ms`,
          animationName: isVisible ? `float-card-${card.id}` : 'none',
          animationDuration: '4s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: `${card.delay + 1000}ms`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className={`w-full h-full bg-gradient-to-br ${card.bgGradient} flex items-center justify-center p-4`}>
          <Image
            src={card.logo}
            alt={card.name}
            width={80}
            height={80}
            className="object-contain w-auto h-auto max-w-[60%] max-h-[60%]"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>
      {/* Mobile version */}
      <div
        className={`absolute ${card.mobilePosition} ${card.mobileSize} rounded-xl shadow-xl overflow-hidden transition-all duration-700 ease-out md:hidden`}
        style={{
          transform: isVisible 
            ? `rotate(${card.rotation}) translateY(0) scale(1)` 
            : `rotate(${card.rotation}) translateY(20px) scale(0.8)`,
          opacity: isVisible ? 0.85 : 0,
          transitionDelay: `${card.delay}ms`,
        }}
      >
        <div className={`w-full h-full bg-gradient-to-br ${card.bgGradient} flex items-center justify-center p-2`}>
          <Image
            src={card.logo}
            alt={card.name}
            width={40}
            height={40}
            className="object-contain w-auto h-auto max-w-[55%] max-h-[55%]"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>
    </>
  )
}

// Floating element component (coins, stars, sparkles)
function FloatingElement({ element, isVisible }: { element: typeof floatingElements[0]; isVisible: boolean }) {
  const renderElement = () => {
    switch (element.type) {
      case 'coin':
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-300">
            <span className="text-amber-900 font-bold text-xs">✦</span>
          </div>
        )
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-amber-400 drop-shadow-lg">
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
          </svg>
        )
      case 'sparkle':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-amber-300 drop-shadow-md">
            <path d="M12 0L13 9L22 12L13 15L12 24L11 15L2 12L11 9L12 0Z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`absolute ${element.position} ${element.size} transition-all duration-700 ease-out hidden md:block`}
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${element.delay}ms`,
        animationName: isVisible ? 'float-element' : 'none',
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDelay: `${element.delay + 800}ms`,
      }}
    >
      {renderElement()}
    </div>
  )
}

export default function RewardsHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsLoaded(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden pt-24" style={{ background: 'linear-gradient(160deg, #4c1d95 0%, #5b21b6 25%, #6d28d9 50%, #4c1d95 75%, #2e1065 100%)' }}>
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800/20 via-transparent to-purple-950/40" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating brand cards */}
      {brandCards.map((card) => (
        <BrandCard key={card.id} card={card} isVisible={isLoaded} />
      ))}

      {/* Floating decorative elements */}
      {floatingElements.map((element) => (
        <FloatingElement key={element.id} element={element} isVisible={isLoaded} />
      ))}

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        {/* Heading */}
        <h1
          className={`text-center text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 md:mb-8 transition-all duration-700 ease-out max-w-3xl ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Katron AI has already given away over
        </h1>

        {/* Big animated counter */}
        <div
          className={`transition-all duration-700 ease-out ${
            showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <AnimatedCounter target={1705612123} duration={2500} />
        </div>

        {/* Subtext with arrow */}
        <div
          className={`flex items-center gap-3 mt-4 md:mt-6 mb-10 md:mb-14 transition-all duration-700 ease-out ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
            in rewards earned (and counting!)
          </p>
          <svg 
            className="w-7 h-7 md:w-9 md:h-9 text-amber-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 ease-out ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {/* Primary CTA Button */}
          <Link
            href="/buy"
            className="group flex items-center gap-3 bg-gray-700/60 hover:bg-gray-600/70 backdrop-blur-md border border-gray-500/30 rounded-full pl-2 pr-5 py-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
          >
            <span className="bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-purple-500/30">
              Buy Gift Cards
            </span>
            <span className="text-white font-medium text-base">Start now!</span>
            <svg className="w-5 h-5 text-white/80 group-hover:translate-x-1 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* App Store Buttons */}
        <div
          className={`flex items-center gap-4 mt-8 transition-all duration-700 ease-out ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          {/* App Store Button */}
          <a
            href="#"
            className="flex items-center gap-2 bg-black/80 hover:bg-black border border-gray-700 rounded-lg px-4 py-2.5 transition-all duration-300 hover:scale-105 hover:border-gray-500"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 leading-none">Download on the</span>
              <span className="text-white text-sm md:text-base font-semibold leading-tight">App Store</span>
            </div>
          </a>

          {/* Google Play Button */}
          <a
            href="#"
            className="flex items-center gap-2 bg-black/80 hover:bg-black border border-gray-700 rounded-lg px-4 py-2.5 transition-all duration-300 hover:scale-105 hover:border-gray-500"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z"/>
              <path fill="#FBBC04" d="M16.247 9.545L5.07.939A.987.987 0 014.396.8L14.932 11.14l1.315-1.595z"/>
              <path fill="#4285F4" d="M21.06 10.104l-3.256-1.882-2.94 3.778 2.94 3.778 3.256-1.882c.828-.478 1.193-1.435.77-2.396a1.973 1.973 0 00-.77-1.396z"/>
              <path fill="#34A853" d="M4.396 23.2c.262 0 .52-.066.751-.193l11.177-6.452-1.392-1.695L4.396 23.2z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 leading-none">GET IT ON</span>
              <span className="text-white text-sm md:text-base font-semibold leading-tight">Google Play</span>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* CSS for floating animations */}
      <style jsx>{`
        @keyframes float-element {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        
        @keyframes float-card-1 {
          0%, 100% { transform: rotate(-12deg) translateY(0px); }
          50% { transform: rotate(-12deg) translateY(-18px); }
        }
        @keyframes float-card-2 {
          0%, 100% { transform: rotate(8deg) translateY(0px); }
          50% { transform: rotate(8deg) translateY(-14px); }
        }
        @keyframes float-card-3 {
          0%, 100% { transform: rotate(-10deg) translateY(0px); }
          50% { transform: rotate(-10deg) translateY(-20px); }
        }
        @keyframes float-card-4 {
          0%, 100% { transform: rotate(10deg) translateY(0px); }
          50% { transform: rotate(10deg) translateY(-16px); }
        }
        @keyframes float-card-5 {
          0%, 100% { transform: rotate(-8deg) translateY(0px); }
          50% { transform: rotate(-8deg) translateY(-18px); }
        }
        @keyframes float-card-6 {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50% { transform: rotate(12deg) translateY(-15px); }
        }
      `}</style>
    </section>
  )
}
