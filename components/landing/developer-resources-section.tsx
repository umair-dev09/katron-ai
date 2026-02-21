"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"

interface Resource {
  id: number
  date: string
  title: string
  description: string
  link: string
}

const resources: Resource[] = [
  {
    id: 1,
    date: "FEB 21, 2026",
    title: "Quick Start Guide",
    description: "Get up and running with the KTN Gift Card Merchant API in minutes. Create your API profile, retrieve your API key, and make your first gift card purchase with step-by-step instructions and ready-to-use code examples.",
    link: "/api-docs#create-profile",
  },
  {
    id: 2,
    date: "FEB 21, 2026",
    title: "API Reference",
    description: "Explore the full Merchant API reference — list gift cards, purchase them programmatically, manage orders, retrieve credentials, handle refunds and voids. Includes request/response schemas and all endpoint details.",
    link: "/api-docs#gift-cards",
  },
  {
    id: 3,
    date: "FEB 21, 2026",
    title: "Authentication & Security",
    description: "Learn how Bearer token authentication works with the KTN API. Understand how to create your Merchant API profile, secure your API key, configure your charge type, and manage token lifecycle including reissuance.",
    link: "/api-docs#authentication",
  },
]

export default function DeveloperResourcesSection() {
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
        threshold: 0.1,
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
      className="relative bg-[#F3F4F6] py-16 md:py-24 lg:pb-32 overflow-hidden"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 md:mb-16 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            fontFamily: "'Arial', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          DEVELOPER RESOURCES
        </h2>

        {/* Resources Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={resource.link}
              className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[380px] border-2 border-transparent hover:border-purple-400 hover:scale-101 hover:-translate-y-2 transition-all duration-300 cursor-pointer no-underline"
            >
              {/* Date Badge */}
              <span className="inline-block w-fit px-4 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-md mb-5 tracking-wider">
                {resource.date}
              </span>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-base text-gray-600 leading-relaxed flex-grow">
                {resource.description}
              </p>

              {/* Divider and Learn More */}
              <div className="mt-auto pt-6">
                <div className="border-t border-gray-200 mb-4"></div>
                <span className="inline-flex items-center text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                  Learn more
                  <svg
                    className="w-4 h-4 ml-2"
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
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
