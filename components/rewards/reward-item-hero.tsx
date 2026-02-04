"use client"

import { useEffect, useRef, useState } from "react"

interface RewardItemHeroProps {
  brandName: string
}

export default function RewardItemHero({ brandName }: RewardItemHeroProps) {
  const [counter, setCounter] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const targetValue = 1705612123 // $1,705,612,123

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            animateCounter()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateCounter = () => {
    const duration = 2000
    const steps = 60
    const stepValue = targetValue / steps
    const stepDuration = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const newValue = Math.floor(easeOutQuart * targetValue)

      setCounter(newValue)

      if (currentStep >= steps) {
        setCounter(targetValue)
        clearInterval(timer)
      }
    }, stepDuration)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Counter Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6">
            {formatNumber(counter)}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium">
            earned in rewards from {brandName}
          </p>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-8 md:mb-12">
          Join millions of users earning rewards on their everyday purchases. Turn your receipts into {brandName} gift cards with KATRON PAY.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-16">
          <button className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-200">
            Start Earning Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>

        {/* App Store Badges */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20 hover:bg-black/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-white">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-white/70">Download on the</div>
                <div className="text-lg font-semibold text-white">App Store</div>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20 hover:bg-black/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-white">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-white/70">GET IT ON</div>
                <div className="text-lg font-semibold text-white">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
