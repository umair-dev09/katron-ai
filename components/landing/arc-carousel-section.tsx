"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"

interface CarouselCard {
  id: number
  image: string
  logo: string
  brand: string
  description: string
  color: string
}

const cardsData: CarouselCard[] = [
  {
    id: 0,
    image: "",
    logo: "",
    brand: "Brand One",
    description: "Serving millions of customers worldwide",
    color: "#3B82F6",
  },
  {
    id: 1,
    image: "",
    logo: "",
    brand: "Brand Two",
    description: "Connecting communities through innovation",
    color: "#EF4444",
  },
  {
    id: 2,
    image: "",
    logo: "",
    brand: "Brand Three",
    description: "Redefining the digital experience",
    color: "#22C55E",
  },
  {
    id: 3,
    image: "",
    logo: "",
    brand: "Brand Four",
    description: "Empowering creativity everywhere",
    color: "#F59E0B",
  },
  {
    id: 4,
    image: "",
    logo: "",
    brand: "Brand Five",
    description: "Building the future of commerce",
    color: "#8B5CF6",
  },
  {
    id: 5,
    image: "",
    logo: "",
    brand: "Brand Six",
    description: "Your everyday essentials, delivered",
    color: "#EC4899",
  },
  {
    id: 6,
    image: "",
    logo: "",
    brand: "Brand Seven",
    description: "Pioneering sustainable solutions",
    color: "#14B8A6",
  },
]

export default function ArcCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = cardsData.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), 100)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px" }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const navigate = useCallback(
    (dir: "left" | "right") => {
      if (isAnimating) return
      setIsAnimating(true)
      setDirection(dir)
      setActiveIndex((prev) =>
        dir === "right" ? (prev + 1) % total : (prev - 1 + total) % total
      )
      setTimeout(() => setIsAnimating(false), 600)
    },
    [isAnimating, total]
  )

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => navigate("right"), 4000)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [navigate])

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => navigate("right"), 4000)
  }

  const handlePrev = () => {
    navigate("left")
    resetAutoPlay()
  }

  const handleNext = () => {
    navigate("right")
    resetAutoPlay()
  }

  // Calculate card positions in the arc
  const getCardStyle = (
    index: number
  ): { transform: string; zIndex: number; opacity: number; filter: string } => {
    // Get offset from active card (wrapping around)
    let offset = index - activeIndex
    if (offset > total / 2) offset -= total
    if (offset < -total / 2) offset += total

    const absOffset = Math.abs(offset)

    // Only show 7 cards max (3 on each side + center)
    if (absOffset > 3) {
      return {
        transform: `translateX(${offset > 0 ? 120 : -120}%) translateY(300px) scale(0) rotate(${offset > 0 ? 45 : -45}deg)`,
        zIndex: 0,
        opacity: 0,
        filter: "brightness(0.3)",
      }
    }

    // Horizontal spacing — wider gap between items
    const xOffset = offset * 260

    // Vertical arc — much higher base lift so ±1 cards center-align with focus
    const baseY = -200
    const centerPush = absOffset === 0 ? 90 : 0
    const yOffset = baseY + absOffset * 55 + absOffset * absOffset * 20 + centerPush

    // Rotation — tilt OUTWARD (left cards lean left, right cards lean right)
    const rotation = offset * 10

    // Scale — center is largest, sides shrink more
    const scale = 1 - absOffset * 0.08

    // Z-index — center on top
    const zIndex = 10 - absOffset

    // Opacity — keep visible, just slightly dimmer
    const opacity = 1 - absOffset * 0.05

    // Brightness dims further cards slightly
    const brightness = 1 - absOffset * 0.08

    return {
      transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex,
      opacity,
      filter: `brightness(${brightness})`,
    }
  }

  const activeCard = cardsData[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32"
    >
      {/* Subtle radial glow behind center */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${activeCard.color}10 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title & description */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.95] text-center mb-6 md:mb-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            YOUR FAVORITE BRANDS. INSTANTLY YOURS.
          </h2>
          <p
            className={`text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-center mb-4 md:mb-6 leading-relaxed transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Experience the next generation of digital gifting where leading brands are always just a tap away.
          </p>
        </div>

        {/* Arc carousel */}
        <div
          className={`relative w-full flex justify-center items-end transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
          style={{ height: "clamp(380px, 50vw, 540px)", perspective: "1400px" }}
        >
          {cardsData.map((card, index) => {
            const style = getCardStyle(index)
            const isActive = index === activeIndex

            return (
              <div
                key={card.id}
                className="absolute bottom-0 left-1/2 cursor-pointer"
                style={{
                  width: isActive ? "clamp(170px, 17vw, 240px)" : "clamp(130px, 13vw, 185px)",
                  aspectRatio: "3/4.2",
                  marginLeft: isActive ? "clamp(-85px, -8.5vw, -120px)" : "clamp(-65px, -6.5vw, -92px)",
                  transform: style.transform,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  filter: style.filter,
                  transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  transformOrigin: "center bottom",
                }}
                onClick={() => {
                  if (isAnimating) return
                  let offset = index - activeIndex
                  if (offset > total / 2) offset -= total
                  if (offset < -total / 2) offset += total
                  if (offset > 0) handleNext()
                  else if (offset < 0) handlePrev()
                }}
              >
                <div
                  className={`relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-500 ${
                    isActive ? "shadow-black/60" : "shadow-black/40"
                  }`}
                  style={{
                    border: isActive
                      ? `2px solid ${card.color}40`
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Card placeholder background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(145deg, ${card.color}30 0%, ${card.color}10 40%, #1a1a1a 100%)`,
                    }}
                  />
                  {/* Placeholder icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${card.color}25` }}
                    >
                      <svg className="w-7 h-7" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Small brand badge at bottom of card */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: `${card.color}40` }}
                    >
                      {card.brand.charAt(0)}
                    </div>
                    <span className="text-white text-[11px] font-medium truncate opacity-90">
                      {card.brand}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info section below carousel */}
        <div
          className={`relative z-20 ml-12 flex flex-col items-center transition-all duration-700 ease-out delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Brand name */}
          <div className="relative h-12 md:h-14 flex items-center justify-center overflow-hidden">
            <h3
              key={activeIndex}
              className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in"
              style={{
                fontFamily:
                  "'Arial Black', 'Helvetica Neue', Helvetica, sans-serif",
              }}
            >
              {activeCard.brand}
            </h3>
          </div>

          {/* Navigation arrows + description */}
          <div className="flex items-center gap-6 md:gap-10 mt-4 md:mt-6">
            <button
              onClick={handlePrev}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Previous"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="text-center max-w-xs">
              <p
                key={`desc-${activeIndex}`}
                className="text-white/60 text-sm md:text-base leading-relaxed animate-fade-in"
              >
                {activeCard.description}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Next"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Read more button */}
          <button
            className="mt-6 md:mt-8 px-8 py-3 rounded-xl text-white text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
            style={{
              background: activeCard.color,
              boxShadow: `0 4px 24px ${activeCard.color}30`,
              transition:
                "background 0.5s ease, box-shadow 0.5s ease, transform 0.2s ease",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  )
}
