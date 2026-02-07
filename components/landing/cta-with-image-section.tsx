"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function CTAWithImageSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2,
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
    <section
      ref={sectionRef}
      className="relative bg-black py-10 md:py-42 lg:pb-40"
    >
      <div className="container mx-auto px-8 sm:px-12 md:px-20 lg:px-32 xl:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Right Side - Content (First on mobile, Second on desktop) */}
          <div
            className={`relative transition-all duration-1000 delay-200 order-1 lg:order-2 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="max-w-xl lg:max-w-none">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold Arial text-white mb-6 leading-tight">
SCHEDULE YOUR PERSONALIZED DEMO TODAY             </h2>

              <p className="text-md md:text-xl text-white mb-8 leading-relaxed">
                Our payments experts are here to help you make money move. Where innovation meets reliability. Welcome to Katron AI
              </p>

              <button className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-md lg:text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Get in touch
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
              </button>
            </div>
          </div>

          {/* Left Side - Image (Second on mobile, First on desktop) */}
          <div
            className={`relative transition-all duration-1000 order-2 lg:order-1 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto lg:mx-0">
              <Image
                src="/images/t1.png"
                alt="Performance Visualization"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
