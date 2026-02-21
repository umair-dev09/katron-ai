"use client"

import { useEffect, useState, useRef } from "react"

const shopperFeatures = [
  {
    title: "Automatic KTN-R Rewards",
    description: "Pay like normal. Rewards land instantly — every eligible purchase, every time.",
  },
  {
    title: "Marketplace Discovery",
    description: "Browse merchants, view live discounts, and discover new stores — all inside the Katron AI app.",
  },
  {
    title: "Spend Anywhere in the Network",
    description: "Your rewards aren't locked to one location. Use them across participating merchants.",
  },
  {
    title: "Send Gift Cards in Seconds",
    description: "Pick a brand. Pick an amount. Send. Done. 100+ brands, instant delivery.",
  },
  {
    title: "One App. Everything in Your Pocket.",
    description: "Rewards, balances, gift card history, transactions — clean, simple, unified.",
  },
]

const merchantFeatures = [
  {
    title: "Retention on Autopilot",
    description: "Rewards are embedded into every eligible transaction. Customers return because they already have value waiting.",
  },
  {
    title: "Marketplace Visibility",
    description: "Your merchant profile, offers, and products are discoverable by customers browsing the Katron AI ecosystem.",
  },
  {
    title: "Gift Cards = New Customers",
    description: "Sell digital gift cards that introduce your brand to new shoppers — without paid ads.",
  },
  {
    title: "Discount Engine Control",
    description: "Create category-wide discounts, product-level offers, cart-value promotions, and reward redemption rules — all from one dashboard.",
  },
  {
    title: "Data That Makes Sense",
    description: "See transactions, rewards issued, repeat visits, and performance — in real time.",
  },
  {
    title: "Live in a Day",
    description: "No hardware replacement. No six-week integration. Most merchants are processing within 24 hours.",
  },
]

const tabContent = {
  shoppers: {
    badge: "FOR YOU",
    headline: "You shop. You earn. That simple.",
    subtext: "Katron AI works behind the scenes every time you pay at a participating merchant in the marketplace.\nNo sign-ups at checkout.\nNo scanning loyalty cards.\nNo separate reward programs.\nJust one connected network.",
    features: shopperFeatures,
    closing: "Every purchase should give you something back. Now it does.",
  },
  merchants: {
    badge: "FOR YOUR BUSINESS",
    headline: "They buy once. They come back forever.",
    subtext: "Katron AI turns your storefront into a marketplace destination.\nYou manage products, categories, discounts, and terminals inside the Merchant App.\nCustomers discover your offers inside the User App.\nEvery purchase updates rewards.\nEvery reward drives a return visit.",
    features: merchantFeatures,
    closing: "Stop spending money to win back customers you already had.",
  },
}

export default function SpotlightSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"shoppers" | "merchants">("shoppers")
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

  const content = tabContent[activeTab]

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-36">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        
        {/* Tab Switcher */}
        <div className={`flex justify-center mb-10 md:mb-14 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="relative inline-flex items-center bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-1.5">
            {/* Sliding background indicator */}
            <div 
              className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#9333EA] shadow-lg shadow-purple-500/25 transition-all duration-400 ease-out"
              style={{
                left: activeTab === "shoppers" ? "6px" : "50%",
                width: "calc(50% - 6px)",
              }}
            />
            <button
              onClick={() => setActiveTab("shoppers")}
              className={`relative z-10 px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-xl text-xs sm:text-sm md:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${
                activeTab === "shoppers" ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              For Shoppers
            </button>
            <button
              onClick={() => setActiveTab("merchants")}
              className={`relative z-10 px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-xl text-xs sm:text-sm md:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${
                activeTab === "merchants" ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              For Merchants
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div key={activeTab} className="animate-fade-in">
          {/* Mobile Layout */}
          <div className="md:hidden text-center">
            <div className={`inline-block mb-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <span className="inline-block bg-purple-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full">
                {content.badge}
              </span>
            </div>

            <h2 
              className={`text-3xl sm:text-4xl font-medium text-white uppercase tracking-tight leading-[0.95] mb-8 transition-all duration-700 ease-out delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {content.headline}
            </h2>

            <div className={`text-white text-sm sm:text-base leading-relaxed mb-8 text-left transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {content.subtext.split("\n").map((line, i) => (
                <p key={i} className={i === 0 ? "mb-3" : "mb-1"}>{line}</p>
              ))}
            </div>

            <div className={`transition-all duration-700 ease-out delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 text-white text-base sm:text-lg font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                Learn more
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className={`mb-8 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <span className="inline-block bg-purple-600 text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full">
                  {content.badge}
                </span>
              </div>

              <h2 
                className={`text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.95] transition-all duration-700 ease-out delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {content.headline}
              </h2>
            </div>

            <div>
              <div className={`text-white text-base lg:text-[19px] leading-relaxed mb-8 transition-all duration-700 ease-out delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                {content.subtext.split("\n").map((line, i) => (
                  <p key={i} className={i === 0 ? "mb-4" : "mb-1"}>{line}</p>
                ))}
              </div>

              <div className={`transition-all duration-700 ease-out delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="inline-flex items-center gap-2 text-white text-lg font-semibold hover:opacity-80 transition-opacity duration-300"
                >
                  Learn more
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className={`relative mt-24 md:mt-32 transition-all duration-700 ease-out delay-400 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Grey background — only left and right sides visible, top and bottom hidden behind video */}
          <div className="absolute top-[18%] bottom-[18%] left-0 right-0 rounded-[32px] bg-[#242424]" />
          {/* Video — 85% width, centered, covers top and bottom of grey box */}
          <div className="relative z-10 flex justify-center px-10 md:px-16 mt-12">
            <video
              src="/spotlight-section-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[85%] rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-[600px] lg:w-[700px] bg-black z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 md:p-12">
              <span className="inline-block bg-purple-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full mb-6">
                {content.badge}
              </span>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white uppercase mb-8"
                style={{
                  fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {content.headline}
              </h2>

              <div className="space-y-6 mb-10">
                {content.features.map((feature, i) => (
                  <div key={i} className="border-l-2 border-purple-500/40 pl-5">
                    <h3 className="text-white text-base md:text-lg font-bold mb-1.5">{feature.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8">
                <p className="text-white text-lg md:text-xl font-semibold italic">
                  &ldquo;{content.closing}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
