"use client"

import { useEffect, useState, useRef } from "react"

export default function VideoZoomSection() {
  const [width, setWidth] = useState(640)
  const [height, setHeight] = useState(360)
  const [verticalOffset, setVerticalOffset] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !videoRef.current) return

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const sectionTop = sectionRect.top
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth

      // Calculate scroll progress through the section with faster progression
      const rawProgress = (windowHeight - sectionTop) / windowHeight
      const progress = Math.max(0, Math.min(1, rawProgress * 1.2))

      // Animate width from 640px to full viewport width
      const minWidth = 640
      const maxWidth = windowWidth
      const newWidth = minWidth + (maxWidth - minWidth) * progress

      // Maintain 16:9 aspect ratio
      const newHeight = (newWidth / 16) * 9

      // Vertical offset: start at -30vh (top), move to 0 (center)
      const offset = -30 + (30 * progress)

      setWidth(newWidth)
      setHeight(newHeight)
      setVerticalOffset(offset)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black -my-12 md:py-32 lg:py-48 px-16 sm:px-20 md:px-28 lg:px-40 xl:px-52"
    >
      {/* Background Text with Layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Bottom layer */}
        <h2 
          className="absolute text-[20vw] md:text-[18vw] lg:text-[13vw] font-bold text-white uppercase whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Arial SemiBold', 'Arial Bold', Arial, sans-serif",
            letterSpacing: "-0.02em",
            WebkitTextStroke: '2px white',
            paintOrder: 'stroke fill',
          }}
        >
          PERFORMANCE
        </h2>
      </div>

      {/* Video Container */}
      <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
        <div
          ref={videoRef}
          className="relative transition-all duration-100 ease-out"
          style={{
            transform: `translateY(${verticalOffset}vh)`,
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100vw',
          }}
        >
          {/* Video Box */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
            {/* YouTube Embed - Replace VIDEO_ID with actual video ID */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/bVCRcNlY1yw?si=v9ONTfdkXP67XTeO&amp;controls=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=bVCRcNlY1yw&amp;modestbranding=1&amp;rel=0&amp;showinfo=0"
              title="Performance Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
    
          </div>
        </div>
      </div>
    </section>
  )
}
