"use client"

import { useEffect, useState, useRef } from "react"

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How does Katron AI work?",
    answer: "Katron AI provides a comprehensive payment solution that connects businesses with their customers. Our platform handles everything from payment processing to fraud prevention, ensuring secure and seamless transactions across all channels.",
  },
  {
    id: 2,
    question: "Is Katron AI easy to integrate with?",
    answer: "We offer a range of integration options, including hosted payment pages – a simple integration method that allows businesses to provide us with payment information, which we use to generate a link that redirects customers to a hosted payments page.\n\nAll of our integration methods are supported by detailed technical documentation, an API reference, and FAQs, with a dedicated support team to help with merchants' questions.",
  },
  {
    id: 3,
    question: "How reliable is Katron AI's platform?",
    answer: "Our platform maintains 99.99% uptime with redundant systems across multiple data centers worldwide. We continuously monitor performance and have dedicated teams ensuring system reliability around the clock.",
  },
  {
    id: 4,
    question: "What markets does Katron AI operate in?",
    answer: "Katron AI operates globally, serving businesses in North America, Europe, Asia-Pacific, and beyond. We support multiple currencies and local payment methods to help you reach customers wherever they are.",
  },
  {
    id: 5,
    question: "What payment methods can I accept?",
    answer: "We support a wide range of payment methods including all major credit and debit cards, digital wallets like Apple Pay and Google Pay, bank transfers, and many local payment methods specific to different regions.",
  },
]

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)
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

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F3F4F6] py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          {/* ── Left: label + heading + link ── */}
          <div
            className={`lg:col-span-2 flex flex-col justify-start transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Our FAQs
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8"
              style={{ fontFamily: "'Arial', sans-serif", letterSpacing: "0.02em" }}
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-base font-semibold text-gray-700 hover:gap-3 transition-all duration-200 group"
            >
              Know More
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* ── Right: accordion ── */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {faqs.map((faq) => (
              <div key={faq.id} className="border-t border-gray-400">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-2xl text-gray-600 font-light">
                    {openId === faq.id ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openId === faq.id ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <div className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-400" />
          </div>

        </div>
      </div>
    </section>
  )
}
