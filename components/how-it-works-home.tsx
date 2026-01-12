"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function HowItWorksHome() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    })
  }, [])

  const steps = [
    {
      number: "01",
      title: "Browse Your Favorite Merchants",
      description:
        "Explore our extensive collection of digital gift cards from top brands. Use advanced filters to find open loop cards, closed loop cards, or browse by categories.",
    },
    {
      number: "02",
      title: "Choose Your Gift Card Amount",
      description:
        "Select from preset denominations ranging from $10 to $500, or enter a custom amount. Each gift card displays the available discount percentage.",
    },
    {
      number: "03",
      title: "Instant Email Delivery",
      description:
        "Complete your secure payment and receive your digital gift card instantly via email within minutes. Perfect for last-minute gifts or scheduled deliveries.",
    },
  ]

  return (
    <section className="relative py-17 md:py-25 overflow-hidden mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-17 md:mb-21" data-aos="fade-up">
          <h2 className="text-[32px] md:text-[42px] font-semibold mb-3 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            A proven process that transforms your vision into high-converting digital experiences
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative max-w-3xl mx-auto mt-12">
          {/* Connecting Line */}
          <div className="absolute left-[25px] md:left-1/2 top-0 bottom-0 w-[1px] bg-border hidden sm:block md:-translate-x-1/2 before:absolute before:inset-y-0 before:w-[1px] before:animate-[line-vertical_8s_ease-in-out_infinite_both] before:bg-gradient-to-b before:from-transparent before:via-primary before:to-transparent" />

          <div className="space-y-9 md:space-y-13">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Mobile/Tablet Layout (default) */}
                <div className="flex gap-6 md:hidden">
                  {/* Number Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-[50px] h-[50px] rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-background font-medium text-sm">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pt-1">
                    <div className="bg-muted/30 border border-border/50 rounded-lg p-5">
                      <h3 className="text-[19px] font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Alternating */}
                <div className="hidden md:block">
                  {index % 2 === 0 ? (
                    // Left-aligned
                    <div className="flex items-center gap-8">
                      <div className="w-[calc(50%-2rem)] text-right">
                        <div className="inline-block bg-muted/30 border border-border/50 rounded-lg p-6 max-w-sm ml-auto">
                          <h3 className="text-[19px] font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Number Circle */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-[50px] h-[50px] rounded-full bg-foreground flex items-center justify-center">
                          <span className="text-background font-medium text-sm">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      <div className="w-[calc(50%-2rem)]" />
                    </div>
                  ) : (
                    // Right-aligned
                    <div className="flex items-center gap-8">
                      <div className="w-[calc(50%-2rem)]" />

                      {/* Number Circle */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-[50px] h-[50px] rounded-full bg-foreground flex items-center justify-center">
                          <span className="text-background font-medium text-sm">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      <div className="w-[calc(50%-2rem)]">
                        <div className="inline-block bg-muted/30 border border-border/50 rounded-lg p-6 max-w-sm">
                          <h3 className="text-[19px] font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
