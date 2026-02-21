"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface Article {
  id: number
  image: string
  category: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  date: string
}

const articles: Article[] = [
  {
    id: 1,
    image: "/images/i1.png",
    category: "BLOG",
    title: "An updated guide to PSD3 and PSR for merchants",
    description: "PSD3 and PSR will reshape EU payments, strengthening fraud prevention, authentication, and consumer protections. This article explains...",
    author: {
      name: "Rami Josef",
      avatar: "/images/avatar1.jpg",
    },
    date: "January 29, 2026",
  },
  {
    id: 2,
    image: "/images/i2.png",
    category: "BLOG",
    title: "Top 9 payment trends for 2026",
    description: "From agentic commerce and network tokens to data quality, interoperability, and agnostic architecture, these nine trends show where...",
    author: {
      name: "Jess Ailion",
      avatar: "/images/avatar2.jpg",
    },
    date: "January 27, 2026",
  },
  {
    id: 3,
    image: "/images/i3.png",
    category: "BLOG",
    title: "How to pay suppliers easily: Key webinar takeaways",
    description: "Read the key takeaways from our recent webinar discussing how online travel agencies can use virtual cards to pay suppliers more...",
    author: {
      name: "Jules Francis",
      avatar: "/images/avatar3.jpg",
    },
    date: "January 19, 2026",
  },
  {
    id: 4,
    image: "/images/i4.png",
    category: "BLOG",
    title: "Instant Access: Unveiling the Magic of Push Provisioning",
    description: "An introduction to push provisioning – what it is, how it works, and why it's becoming essential for card issuers, wallets, and consumers alike.",
    author: {
      name: "Jules Francis",
      avatar: "/images/avatar3.jpg",
    },
    date: "January 19, 2026",
  },
  {
    id: 5,
    image: "/images/i5.png",
    category: "BLOG",
    title: "What is card program management?",
    description: "A breakdown of what card program management involves, how it works, and what to look for in a provider.",
    author: {
      name: "Jules Francis",
      avatar: "/images/avatar3.jpg",
    },
    date: "January 19, 2026",
  },
]

export default function LatestArticlesSection() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

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

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 300
      const gap = 24
      carouselRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(articles.length - 1, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 300
      const gap = 24
      const scrollLeft = carouselRef.current.scrollLeft
      const newIndex = Math.round(scrollLeft / (cardWidth + gap))
      setCurrentIndex(newIndex)
    }
  }

  return (
    <div className="bg-black">
      <section
        ref={sectionRef}
        className="relative bg-gray-100 py-16 md:py-24 lg:py-32 overflow-hidden"
        style={{
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
        }}
    >
      <div>
        {/* Section Header */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 md:mb-16 text-center md:text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            fontFamily: "'Arial', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          LATEST ARTICLES
        </h2>

        {/* Articles Carousel */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className={`flex gap-7 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="flex-shrink-0 w-[90vw] md:w-[380px] lg:w-[350px] bg-white rounded-3xl overflow-hidden transition-all duration-300 snap-start cursor-pointer border border-gray-200 hover:scale-101 hover:-translate-y-2"
            >
              {/* Article Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden m-4 mb-0 rounded-2xl" style={{ width: 'calc(100% - 32px)' }}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="p-6 pt-5">
                {/* Category Badge */}
                <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-md mb-4 tracking-wider">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>

                {/* Author - No avatar, just name and date */}
                <div className="pt-2">
                  <p className="text-base font-bold text-gray-900">
                    {article.author.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{article.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation */}
        <div
          className={`flex items-center justify-center gap-4 mt-8 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-500 hover:bg-gray-50 transition-all duration-200"
            aria-label="Previous article"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 h-2 bg-blue-600 rounded-full"
                    : "w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500"
                }`}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-500 hover:bg-gray-50 transition-all duration-200"
            aria-label="Next article"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
    </div>
  )
}
