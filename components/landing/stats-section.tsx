"use client"

import { useEffect, useState, useRef } from "react"

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), 100)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Animate counter when visible
  useEffect(() => {
    if (!isVisible) return

    const target = 300
    const duration = 2000 // 2 seconds
    const increment = target / (duration / 16) // 60fps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="relative bg-black py-20 md:py-32 px-8 sm:px-12 md:px-20 lg:px-32 xl:px-40">
      <div className="max-w-4xl mx-auto">
        {/* Stats Card */}
        <div 
          className={`relative border border-white rounded-3xl md:rounded-[3rem] p-12 md:p-16 lg:p-20 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Heading */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white uppercase tracking-tight leading-tight mb-8 md:mb-12"
            style={{
              fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Scale You Can Trust
          </h2>

          {/* Large Stat */}
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#0066FF] mb-8 md:mb-12">
            ${count}BN
          </div>

          {/* Description */}
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto">
            The total volume of ecommerce payments we processed in 2025 for enterprise merchants around the world.
          </p>
        </div>
      </div>
    </section>
  )
}
