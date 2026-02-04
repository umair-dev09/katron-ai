"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

export default function SpotlightSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout - Stacked and Centered */}
        <div className="md:hidden text-center">
          {/* Badge */}
          <div 
            className={`inline-block mb-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block bg-purple-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full">
              Spotlight
            </span>
          </div>

          {/* Heading */}
          <h2 
            className={`text-3xl sm:text-4xl font-medium text-white uppercase tracking-tight leading-[0.95] mb-8 transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
The Consumer Advantage
          </h2>

          {/* Description */}
          <div 
            className={`text-white text-sm sm:text-lg leading-relaxed mb-8 transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
 <p className="font-bold mb-4">Frictionless shopping. Meaningful rewards.</p>
              <ul className="space-y-3 list-disc list-inside">
               <b>Effortless Loyalty:</b> No new apps to master—customers earn rewards automatically just by shopping as they usually do.<br />
                <b>Digital Convenience:</b> From mobile balance tracking to instant e-gift delivery, everything lives in their pocket.<br />
                <b>Uncompromising Trust:</b> Enterprise-grade security ensures every transaction is protected and every reward is verified.
              </ul>
          </div>

          {/* Learn More Link */}
          <div 
            className={`transition-all duration-700 ease-out delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 text-white text-base sm:text-lg font-medium hover:opacity-80 transition-opacity duration-300"
            >
              Learn more
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Badge + Heading */}
          <div>
            {/* Badge */}
            <div 
              className={`mb-8 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="inline-block bg-purple-600 text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full">
                Spotlight
              </span>
            </div>

            {/* Heading */}
            <h2 
              className={`text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.95] transition-all duration-700 ease-out delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
The Consumer Advantage
            </h2>
          </div>

          {/* Right Side - Description + Link */}
          <div>
            {/* Description */}
            <div 
              className={`text-white text-md lg:text-[19px] leading-relaxed mb-8 transition-all duration-700 ease-out delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="font-bold mb-4">Frictionless shopping. Meaningful rewards.</p>
              <ul className="space-y-3 list-disc list-inside">
             Experience frictionless shopping with meaningful rewards — powered by effortless loyalty, digital convenience, and uncompromising trust.

              </ul>
            </div>

            {/* Learn More Link */}
            <div 
              className={`transition-all duration-700 ease-out delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 text-white text-lg font-medium hover:opacity-80 transition-opacity duration-300"
              >
                Learn more
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Landscape Image */}
        <div 
          className={`mt-16 md:mt-20 transition-all duration-700 ease-out delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-full aspect-[21/10] md:aspect-[16/8] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-xl bg-gray-700/50 flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm md:text-base font-medium">Spotlight Illustration</span>
              </div>
            </div> */}
            <Image
              src="/images/spot-img.png"
              alt="Intelligent Acceptance"
              fill
              className="object-cover"
            />
           
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-[600px] lg:w-[700px] bg-black z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Close Button */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Drawer Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white uppercase mb-8"
                style={{
                  fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                The Consumer Advantage
              </h2>
              
              {/* Subtitle */}
              <p className="text-white text-lg md:text-xl font-bold mb-8">
                Frictionless shopping. Meaningful rewards.
              </p>

              {/* Bullet Points */}
              <div className="space-y-6 text-white">
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2">Effortless Loyalty:</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    No new apps to master—customers earn rewards automatically just by shopping as they usually do.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2">Digital Convenience:</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    From mobile balance tracking to instant e-gift delivery, everything lives in their pocket.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2">Uncompromising Trust:</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    Enterprise-grade security ensures every transaction is protected and every reward is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
