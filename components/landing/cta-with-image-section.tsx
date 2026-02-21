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
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
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
LETS SEE WHAT KATRON AI CAN DO FOR YOU             </h2>

                <p className="text-md md:text-lg text-gray-300 mb-8 leading-relaxed">
                In 15 minutes, we'll show you:
                </p>
                <ul className="text-md md:text-lg text-gray-300 mb-8 space-y-3 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#9333EA] font-bold mt-[1px]">•</span>
                  <span className="mt-[2px]">How the merchant marketplace works</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9333EA] font-bold mt-[1px]">•</span>
                  <span className="mt-[2px]">How rewards connect to transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9333EA] font-bold mt-[1px]">•</span>
                  <span className="mt-[2px]">How gift cards drive growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9333EA] font-bold mt-[1px]">•</span>
                  <span className="mt-[2px]">How your existing POS integrates</span>
                </li>
                </ul>
                <p className="text-md md:text-lg text-gray-300 mb-8 leading-relaxed">
                If it's not the right fit, we'll tell you. No pressure. Just clarity.
                </p>

              <button className="group relative px-8 py-3 bg-[#9333EA] hover:bg-[#7e22ce] text-white text-md lg:text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Book a Demo
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
              </button>
              <span className="block mt-2 text-gray-400 text-[13px]">15 minutes. Real answers. Zero fluff.</span>
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
                src="/book-a-demo.png"
                alt="Performance Visualization"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
