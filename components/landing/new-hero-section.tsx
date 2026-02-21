"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { LiquidMetalButton } from "./liquid-metal-button"

// Stats data
const stats = [
  { value: 100, suffix: "+", label: "Gift Card Brands" },
  { value: 99.9, suffix: "%", label: "Platform Uptime" },
  { value: 150, suffix: "+", label: "Payment Methods" },
  { value: 24, suffix: "/7", label: "Support Availability" },
]

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    const startTime = performance.now()
    const isDecimal = end % 1 !== 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = easeOut * end

      if (isDecimal) {
        countRef.current = Math.round(currentValue * 10) / 10
      } else {
        countRef.current = Math.round(currentValue)
      }
      
      setCount(countRef.current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration, start])

  return count
}

function StatItem({ stat, animate }: { stat: typeof stats[0]; animate: boolean }) {
  const count = useCountUp(stat.value, 2000, animate)
  
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">
        {stat.value % 1 !== 0 ? count.toFixed(1) : count}{stat.suffix}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-gray-400 font-medium">
        {stat.label}
      </div>
    </div>
  )
}

// Left side images (4 images)
const leftImages = [
  { id: 1, src: "/auth-c.jpeg", alt: "Auth image", link: "/auth" },
  { id: 2, src: "/blog-c.jpeg", alt: "Blog image", link: "/blogs" },
  { id: 3, src: "/documentation-c.jpeg", alt: "Documentation image", link: "/api-docs" },
  { id: 4, src: "/meeting-c.jpeg", alt: "Meeting image", link: "/#" },
]

// Right side images (4 images)
const rightImages = [
  { id: 5, src: "/buy-c.png", alt: "Buy image", link: "/buy" },
  { id: 6, src: "/terms-c.jpeg", alt: "Terms image", link: "/terms-of-service" },
  { id: 7, src: "/privacy-c.png", alt: "Privacy image", link: "/privacy-policy" },
  { id: 8, src: "/rewards-c.png", alt: "Rewards image", link: "/rewards" },
]

interface CarouselColumnProps {
  images: typeof leftImages
  direction: "up" | "down"
  speed?: number
}

function CarouselColumn({ images, direction, speed = 30 }: CarouselColumnProps) {
  // Triple the images for seamless infinite scroll
  const tripleImages = [...images, ...images, ...images]
  
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-3 md:gap-4 ${
          direction === "up" ? "animate-scroll-up" : "animate-scroll-down"
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {tripleImages.map((image, index) => (
          <Link
            key={`${image.id}-${index}`}
            href={image.link}
            className="relative w-[190px] h-[125px] md:w-[230px] md:h-[155px] lg:w-[270px] lg:h-[185px] xl:w-[320px] xl:h-[225px] 2xl:w-[360px] 2xl:h-[255px] overflow-hidden flex-shrink-0 bg-gray-800 shadow-xl rounded-lg md:rounded-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:brightness-110 transition-all duration-300"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, (max-width: 1280px) 290px, 330px"
            />
            <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors duration-300" />
          </Link>
        ))}
      </div>
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
    <section className="relative bg-black overflow-hidden">
      {/* ===== LEFT SIDE CAROUSEL ===== */}
      <div className="absolute left-0 top-0 bottom-0 hidden md:flex items-center z-10">
        <div className="h-full ml-2 lg:ml-4 xl:ml-6">
          <CarouselColumn 
            images={leftImages} 
            direction="down" 
            speed={35}
          />
        </div>
      </div>

      {/* ===== RIGHT SIDE CAROUSEL ===== */}
      <div className="absolute right-0 top-0 bottom-0 hidden md:flex items-center z-10">
        <div className="h-full mr-2 lg:mr-4 xl:mr-6">
          <CarouselColumn 
            images={rightImages} 
            direction="up" 
            speed={30}
          />
        </div>
      </div>

      {/* Gradient overlays for smooth edge fading */}
      <div className="absolute left-0 top-0 bottom-0 w-[6%] lg:w-[4%] bg-gradient-to-r from-black via-black/50 to-transparent z-20 hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-[6%] lg:w-[4%] bg-gradient-to-l from-black via-black/50 to-transparent z-20 hidden md:block" />

      {/* Main content container */}
      <div className="relative flex items-center justify-center min-h-screen pt-20 pb-16">
        
        {/* ===== CENTER CONTENT ===== */}
        <div className="relative z-40 text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
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
            <span className="block">THE REWARD</span>
            <span className="block">LAYER OF </span>
            <span className="block">MODERN COMMERCE</span>
          </h1>
          
          {/* Description with slide-in animation */}
          <p 
            className={`text-white text-[12px] px-3 sm:text-base md:text-lg max-w-md sm:max-w-md md:max-w-md lg:max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed transition-all duration-500 ease-out ${
              showContent 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            Katron AI turns every payment into a digital reward — connecting merchants, shoppers, and gift cards in one ecosystem that grows with every transaction.
          </p>
          
          {/* Buttons with liquid metal animation */}
          <div className={`flex items-center justify-center gap-4 transition-all duration-500 ease-out ${
            showContent 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}>
            <LiquidMetalButton 
              label="Get Started" 
              onClick={() => window.location.href = '/auth'} 
            />
            <button
              onClick={() => {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-transparent text-white font-semibold px-6 py-3 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 ease-out hover:bg-white/10 flex items-center gap-2"
            >
              How it works
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Stats section */}
          <div className={`mt-20 md:mt-28 lg:mt-32 pb-4 md:pb-6 lg:pb-8 px-6 transition-all duration-500 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 xl:gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="w-[calc(50%-16px)] sm:w-[calc(50%-24px)] lg:w-auto lg:min-w-[160px]">
                  <StatItem stat={stat} animate={showContent} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
