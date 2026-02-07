"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Left side images (going down)
const leftImages = [
  { id: 1, src: "/images/i1.png", alt: "Hero image 1", link: "/auth" },
  { id: 2, src: "/images/i2.png", alt: "Hero image 2", link: "/privacy-policy" },
  { id: 3, src: "/images/i14.png", alt: "Hero image 3", link: "/terms-of-service" },
  { id: 4, src: "/images/i4.png", alt: "Hero image 4", link: "/rewards" },
  { id: 5, src: "/images/i11.png", alt: "Hero image 5", link: "/auth" },
  { id: 6, src: "/images/i6.png", alt: "Hero image 6", link: "/privacy-policy" },
  { id: 7, src: "/images/i7.png", alt: "Hero image 7", link: "/terms-of-service" },
  { id: 8, src: "/images/i16.png", alt: "Hero image 8", link: "/rewards" },
  { id: 9, src: "/images/i9.png", alt: "Hero image 9", link: "/auth" },
  { id: 10, src: "/images/i10.png", alt: "Hero image 10", link: "/privacy-policy" },
]

// Right side images (going up)
const rightImages = [
  { id: 11, src: "/images/i15.png", alt: "Hero image 11", link: "/terms-of-service" },
  { id: 12, src: "/images/i12.png", alt: "Hero image 12", link: "/rewards" },
  { id: 13, src: "/images/i13.png", alt: "Hero image 13", link: "/auth" },
  { id: 14, src: "/images/i3.png", alt: "Hero image 14", link: "/privacy-policy" },
  { id: 15, src: "/images/i5.png", alt: "Hero image 15", link: "/terms-of-service" },
  { id: 16, src: "/images/i8.png", alt: "Hero image 16", link: "/rewards" },
  { id: 17, src: "/images/i17.png", alt: "Hero image 17", link: "/auth" },
  { id: 18, src: "/images/i18.png", alt: "Hero image 18", link: "/privacy-policy" },
  { id: 19, src: "/images/i19.png", alt: "Hero image 19", link: "/terms-of-service" },
  { id: 20, src: "/images/i20.png", alt: "Hero image 20", link: "/rewards" },
]

interface CarouselColumnProps {
  images: typeof leftImages
  direction: "up" | "down"
  speed?: number
  className?: string
}

function CarouselColumn({ images, direction, speed = 60, className = "" }: CarouselColumnProps) {
  // Triple the images for seamless infinite scroll
  const tripleImages = [...images, ...images, ...images]
  
  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <div
        className={`flex flex-col gap-2 md:gap-3 ${
          direction === "up" ? "animate-scroll-up" : "animate-scroll-down"
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {tripleImages.map((image, index) => (
          <Link
            key={`${image.id}-${index}`}
            href={image.link}
            className="relative aspect-square w-[100px] md:w-[120px] lg:w-[150px] xl:w-[180px] 2xl:w-[200px] overflow-hidden flex-shrink-0 bg-gray-800 shadow-xl rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            {/* Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:brightness-110 transition-all duration-300"
              sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 150px, (max-width: 1280px) 180px, 200px"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SideCarousel() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Left side carousel - going DOWN - using fixed positioning */}
      <div 
        className={`fixed left-0 top-0 bottom-0 hidden md:flex items-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 5 }}
      >
        <div className="h-screen ml-2 lg:ml-4 xl:ml-6 pointer-events-auto">
          <CarouselColumn 
            images={leftImages} 
            direction="down" 
            speed={50}
          />
        </div>
      </div>

      {/* Right side carousel - going UP */}
      <div 
        className={`fixed right-0 top-0 bottom-0 hidden md:flex items-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 5 }}
      >
        <div className="h-screen mr-2 lg:mr-4 xl:mr-6 pointer-events-auto">
          <CarouselColumn 
            images={rightImages} 
            direction="up" 
            speed={45}
          />
        </div>
      </div>

      {/* Mobile: Simplified columns with lower opacity */}
      <div className={`fixed left-0 top-0 bottom-0 flex md:hidden items-center transition-opacity duration-500 ${isVisible ? 'opacity-30' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 5 }}>
        <div className="h-screen -ml-[50px] pointer-events-auto">
          <CarouselColumn images={leftImages} direction="down" speed={40} />
        </div>
      </div>
      <div className={`fixed right-0 top-0 bottom-0 flex md:hidden items-center transition-opacity duration-500 ${isVisible ? 'opacity-30' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 5 }}>
        <div className="h-screen -mr-[50px] pointer-events-auto">
          <CarouselColumn images={rightImages} direction="up" speed={40} />
        </div>
      </div>

      {/* Gradient overlays for smooth edge fading */}
      <div className={`fixed inset-0 pointer-events-none hidden md:block transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: 4 }}>
        {/* Left side gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-[6%] lg:w-[5%] bg-gradient-to-r from-black via-black/60 to-transparent" />
        {/* Right side gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-[6%] lg:w-[5%] bg-gradient-to-l from-black via-black/60 to-transparent" />
      </div>
    </div>
  )
}
