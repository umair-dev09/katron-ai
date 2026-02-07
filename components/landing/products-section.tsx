"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

const products = [
    {
        id: "connect",
        label: "CONNECT",
        title: "Integrate without the friction",
        description: (
            <>
                <div className="mb-3">
                    <strong className="font-semibold">Post-Purchase Intelligence:</strong> Turn every checkout into a starting point for customer data and future engagement.
                </div>
                <div className="mb-3">
                    <strong className="font-semibold">API-Ready Gifting:</strong> Instantly deploy a production-ready marketplace for branded digital gift cards.
                </div>
                <div>
                    <strong className="font-semibold">Agile Setup:</strong> Switch between manual management and full API automation as your business grows.
                </div>
            </>
        ),
        image: "/images/pt-1.png"
    },
    {
        id: "move",
        label: "MOVE",
        title: "Power every purchase with speed and security",
        description: (
            <>
                <div className="mb-3">
                    <strong className="font-semibold">Omnichannel Mastery:</strong> Secure payment processing with transparent, competitive interchange-plus pricing.
                </div>
                <div className="mb-3">
                    <strong className="font-semibold">Instant Gratification:</strong> Automated delivery of gift codes via email or PDF ensures your customers never have to wait.
                </div>
                <div>
                    <strong className="font-semibold">Precision Hardware:</strong> Sleek, retail-ready POS terminals tailored for the high-volume demands of restaurants and storefronts.
                </div>
            </>
        ),
        image: "/images/pt-2.png"
    },
    {
        id: "boost",
        label: "BOOST",
        title: "Incentivize the next visit before they leave the store",
        description: (
            <>
                <div className="mb-3">
                    <strong className="font-semibold">Intelligent Rewards:</strong> A closed-loop digital engine that issues rewards based on your specific rules and customer behavior.
                </div>
                <div className="mb-3">
                    <strong className="font-semibold">Gift-Driven Acquisition:</strong> Use digital gifting to attract new customers and reward your most loyal fans.
                </div>
                <div>
                    <strong className="font-semibold">Actionable Insights:</strong> Turn raw transaction data into retention strategies with real-time analytics dashboards.
                </div>
            </>
        ),
        image: "/images/pt-3.png"
    },
    // {
    //     id: "protect",
    //     label: "PROTECT",
    //     title: "Master fraud, risk and compliance",
    //     description: "Advanced fraud detection and risk management tools keep your business secure. Real-time monitoring and automated compliance checks.",
    //     image: "/images/product-protect.png"
    // },
    // {
    //     id: "manage",
    //     label: "MANAGE",
    //     title: "Complete payment management",
    //     description: "Unified dashboard for all your payment operations. Monitor, analyze, and optimize your entire payment infrastructure from one place.",
    //     image: "/images/product-manage.png"
    // }
]

export default function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [contentKey, setContentKey] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations when section comes into view
            setTimeout(() => setIsVisible(true), 100)
            setTimeout(() => setShowContent(true), 400)
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of section is visible
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

  useEffect(() => {
    // Auto-rotate through products every 4 seconds
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Trigger content transition animation when product changes
  useEffect(() => {
    setContentKey(prev => prev + 1)
  }, [activeProduct])

  const currentProduct = products[activeProduct]

  return (
    <section ref={sectionRef} className="relative bg-black pt-20 md:pt-32 px-8 sm:px-12 md:px-20 lg:px-32 xl:px-40">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.95] text-center mb-6 md:mb-8 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="block">A Modular Ecosystem.</span>
          <span className="block"> Built for Scale.</span>
        </h2>

        {/* Description */}
        <p className={`text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-center mb-12 md:mb-16 leading-relaxed transition-all duration-700 ease-out delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          Stop juggling fragmented tools. Katron AI unifies your payments, loyalty rewards, and digital gifting into a single, high-performance experience.
        </p>

        {/* Product Chips */}
        <div className={`flex justify-center mb-12 md:mb-16 transition-all duration-700 ease-out delay-200 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-0 bg-transparent md:bg-gray-800/80 md:backdrop-blur-sm rounded-full p-0 md:p-1.5">
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(index)}
                className={`px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  activeProduct === index
                    ? "bg-[#b4ff00] text-bold"
                    : "bg-gray-800/80 md:bg-transparent text-white hover:bg-gray-700/50"
                }`}
              >
                {product.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={`max-w-4xl mx-auto transition-all duration-700 ease-out delay-300 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Title */}
          <h3 
            key={`title-${contentKey}`}
            className="text-md sm:text-lg md:text-xl font-normal text-white text-center -mt-4 mb-6 animate-fade-in"
          >
            {currentProduct.title}
          </h3>

          {/* Mobile View - Stacked */}
          <div key={`mobile-${contentKey}`} className="md:hidden space-y-8 animate-fade-in">
            {/* Illustration */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gray-700/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">Product Illustration</span>
                </div>
              </div>
              {/* Uncomment when images are ready */}
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover p-2"
              />
             
            </div>

            {/* Description */}
            <div className="text-white text-sm sm:text-base leading-relaxed text-center">
              {currentProduct.description}
            </div>
          </div>

          {/* Desktop View - Side by Side */}
          <div key={`desktop-${contentKey}`} className="hidden md:grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            {/* Illustration */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black transform transition-transform duration-500 hover:scale-[1.02]">
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-black flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">Product Illustration</span>
                </div>
              </div> */}
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover "
              />
             
            </div>

            {/* Description */}
            <div>
              <div className="text-white/90 text-base md:text-lg leading-relaxed">
                {currentProduct.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
