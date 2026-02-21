"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

const products = [
  {
    id: "INTEGRATE",
    label: "INTEGRATE",
    title: "Plug in seamlessly, no headaches",
    description: (
      <>
        <p className="mb-3">Plug Katron AI into your existing POS or checkout — no new hardware, no heavy development.</p>
        <p className="mb-3">Behind the scenes, your merchant profile, products, categories, and terminals are connected to the Katron marketplace engine.</p>
        <p className="font-medium">Within 24 hours, you're live — reward-ready and marketplace-visible.</p>
      </>
    ),
    image: "/integrate.png"
  },
  {
    id: "ACTIVATE",
    label: "ACTIVATE",
    title: "Reward your customers right away",
    description: (
      <>
        <p className="mb-3">The moment a customer pays, KTN-R Digital Rewards are triggered automatically.</p>
        <p className="mb-3">Our reward engine connects: Products → Categories → Discounts → Rewards → Transactions.</p>
        <p className="mb-3">No loyalty cards to scan. No codes to enter. The reward logic lives inside the transaction itself.</p>
        <p className="font-medium">Invisible to the process. Visible to the customer.</p>
      </>
    ),
    image: "/activate.png"
  },
  {
    id: "DISCOVER",
    label: "DISCOVER",
    title: "Turn shoppers into repeat visitors",
    description: (
      <>
        <p className="mb-3">Your business becomes part of the Katron AI Merchant Marketplace.</p>
        <p className="mb-3">Customers browse nearby or categorized merchants, view live discounts and offers, and discover product-level and category-level deals — then select and redeem rewards seamlessly.</p>
        <p className="mb-3">Merchants manage products and discounts. Users explore and redeem.</p>
        <p className="font-medium">Two sides. One marketplace.</p>
      </>
    ),
    image: "/discover.png"
  },
  {
    id: "EXPAND",
    label: "EXPAND",
    title: "Grow revenue with digital gift cards",
    description: (
      <>
        <p className="mb-3">Launch a digital gift card storefront directly inside your merchant profile.</p>
        <p className="mb-3">Or let customers send gift cards from 100+ premium brands.</p>
        <p className="mb-3">Every gift card sold generates upfront revenue, introduces new customers, and feeds into the reward ecosystem.</p>
        <p className="font-medium">Gift cards aren't separate from payments — they're part of the growth loop.</p>
      </>
    ),
    image: "/expand.png"
  },
  {
    id: "OPTIMIZE",
    label: "OPTIMIZE",
    title: "Gain real-time business insights",
    description: (
      <>
        <p className="mb-3">One dashboard. Every transaction.</p>
        <p className="mb-3">Track reward issuance, gift card sales, returning customers, product performance, and discount usage — because every action in the marketplace is recorded at the transaction level.</p>
        <p className="mb-3">Insights are immediate and actionable.</p>
        <p className="font-medium">No analytics degree required.</p>
      </>
    ),
    image: "/optimize.png"
  },
  {
    id: "PROTECT",
    label: "PROTECT",
    title: "Security you can trust",
    description: (
      <>
        <p className="mb-3">256-bit encryption. PCI DSS compliance.</p>
        <p className="mb-3">Automated fraud detection and 24/7 monitoring protect every product, discount, reward, and transaction at the infrastructure level.</p>
        <p className="mb-3">Commerce should feel effortless — but security should never be optional.</p>
        <p className="font-medium">Your customers' data is protected. Always.</p>
      </>
    ),
    image: "/protect.png"
  }
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
    // Auto-rotate through products every 8 seconds
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Trigger content transition animation when product changes
  useEffect(() => {
    setContentKey(prev => prev + 1)
  }, [activeProduct])

  const currentProduct = products[activeProduct]

  return (
    <section id="products" ref={sectionRef} className="relative bg-black pt-20 md:pt-32">
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
          {/* <span className="block">KNOW US WELL</span> */}
          <span className="block"> More Than a Payment Processor</span>
        </h2>

        {/* Description */}
        <p className={`text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-center mb-12 md:mb-16 leading-relaxed transition-all duration-700 ease-out delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
Katron AI is a reward-enabled commerce layer. We sit on top of your existing payment flow and turn every transaction into an opportunity rewards for customers, retention for merchants, and gift cards that move between both.
        </p>

        {/* Product Chips */}
        <div className={`flex justify-center mb-12 md:mb-16 px-4 transition-all duration-700 ease-out delay-200 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="relative inline-flex flex-wrap items-center justify-center gap-2 md:gap-1 bg-transparent md:bg-white/[0.04] md:border md:border-white/[0.08] md:backdrop-blur-xl rounded-2xl p-0 md:p-1.5">
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(index)}
                className={`relative px-5 md:px-6 lg:px-8 py-2.5 md:py-2.5 rounded-xl text-xs sm:text-sm md:text-sm font-semibold uppercase tracking-wider transition-all duration-400 ease-out ${
                  activeProduct === index
                    ? "bg-[#9333EA] text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/[0.06] md:bg-transparent text-white/60 hover:text-white hover:bg-white/[0.08]"
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
          <div key={`mobile-${contentKey}`} className="md:hidden space-y-6 animate-fade-in">
            {/* Illustration */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800/50 transform transition-transform duration-500 hover:scale-[1.02] shadow-xl">
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Description */}
            <div className="text-white/90 text-sm sm:text-base leading-relaxed text-left px-2">
              {currentProduct.description}
            </div>
          </div>

          {/* Desktop View - Side by Side */}
          <div key={`desktop-${contentKey}`} className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-14 items-start animate-fade-in">
            {/* Illustration */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800/50 transform transition-transform duration-500 hover:scale-[1.02] shadow-2xl">
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col justify-center h-full py-4">
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
