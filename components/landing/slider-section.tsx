"use client"

import React, { useState, useRef, useEffect } from "react"

interface OptionData {
  id: number
  background: string
  icon: string
  main: string
  sub: string
  defaultColor: string
}

const optionsData: OptionData[] = [
  {
    id: 0,
    background: "/airtime-topup-slide.jpeg",
    icon: "fas fa-phone-alt",
    main: "Airtime Top-Ups",
    sub: "Recharge any network, instantly",
    defaultColor: "#9333EA",
  },
  {
    id: 1,
    background: "/data-topup-slide.jpeg",
    icon: "fas fa-wifi",
    main: "Data Bundles Top-Ups",
    sub: "Stay connected, always on",
    defaultColor: "#7C3AED",
  },
  {
    id: 2,
    background: "/gift-card-slide.jpeg",
    icon: "fas fa-gift",
    main: "Gift Cards",
    sub: "100+ brands, instant delivery",
    defaultColor: "#6D28D9",
  },
  {
    id: 3,
    background: "/utility-payments-slide.jpeg",
    icon: "fas fa-file-invoice-dollar",
    main: "Utility Payments",
    sub: "Bills paid in one tap",
    defaultColor: "#5B21B6",
  },
]

export default function SliderSection() {
  const [activeOption, setActiveOption] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
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
      { threshold: 0.2, rootMargin: '0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  const handleOptionClick = (optionId: number) => {
    setActiveOption(optionId)
  }

  return (
    <>
      {/* Font Awesome & Roboto */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
      />

      {/* Scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slider-section {
          font-family: 'Roboto', sans-serif;
        }

        /* ── Desktop ── */
        .options-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 60px 0;
          transition: 0.25s;
        }

        .options-wrapper {
          display: flex;
          flex-direction: row;
          width: calc(100% - 100px);
          min-width: 600px;
          max-width: 900px;
          height: 400px;
          overflow: hidden;
        }

        .option-item {
          position: relative;
          overflow: hidden;
          width: 80px;
          min-width: 80px;
          margin: 0 8px;
          border-radius: 30px;
          cursor: pointer;
          transition: flex 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95),
                      border-radius 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95),
                      min-width 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95),
                      width 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          flex-shrink: 0;
        }

        .option-item.active {
          flex: 1 1 auto;
          width: auto;
          min-width: 0;
          border-radius: 40px;
        }

        .option-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(transparent, rgba(0,0,0,0.5));
          pointer-events: none;
        }

        .option-label {
          position: absolute;
          display: flex;
          align-items: center;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
        }

        .option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          max-width: 40px;
          height: 40px;
          border-radius: 100%;
          background-color: white;
        }

        .option-icon i {
          color: #C0C0C0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.5);
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.8));
        }

        .option-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
          color: white;
          white-space: nowrap;
        }

        .option-main {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .option-sub {
          transition-delay: 0.1s;
        }

        .inactive-options {
          display: none;
        }

        /* ── Mobile / Tablet ── */
        @media (max-width: 1024px) {
          .options-container {
            flex-direction: column;
            padding: 40px 20px;
          }

          .options-wrapper {
            flex-direction: column;
            width: 100%;
            min-width: unset;
            max-width: 100%;
            height: auto;
            overflow: visible;
            align-items: center;
          }

          .option-item {
            display: none;
          }

          .option-item.active {
            display: block;
            flex-grow: 0;
            width: 100%;
            max-width: 500px;
            height: 300px;
            border-radius: 25px;
            margin: 0 auto;
            transform: none;
          }

          .inactive-options {
            display: flex !important;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            width: 100%;
            max-width: 500px;
            margin-top: 20px;
          }

          .inactive-option {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            transition: 0.3s ease;
            overflow: hidden;
            background-size: cover;
            background-position: center;
          }

          .inactive-option::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
          }

          .inactive-option-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .inactive-option-inner i {
            font-size: 18px;
            color: #C0C0C0;
          }
        }

        @media (max-width: 768px) {
          .option-item.active {
            height: 250px;
            max-width: 400px;
          }
          .inactive-option {
            width: 60px;
            height: 60px;
          }
          .inactive-option-inner {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .option-item.active {
            height: 220px;
          }
          .option-main {
            font-size: 1.1rem;
          }
          .inactive-option {
            width: 50px;
            height: 50px;
          }
          .inactive-option-inner {
            width: 30px;
            height: 30px;
          }
        }
      `}} />

      <section ref={sectionRef} className="slider-section bg-black pt-20 md:pt-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-tight leading-[0.95] text-center mb-6 md:mb-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "'Arial SemiBold', 'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            The Backbone of Everyday Digital Transactions
          </h2>
          <p className={`text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-center mb-4 md:mb-6 leading-relaxed transition-all duration-700 ease-out delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            A centralized digital infrastructure that connects essential services into one smooth, secure, and scalable transaction layer.
          </p>
        </div>
        <div className="options-container">
          {/* Desktop wrapper */}
          <div className="options-wrapper">
            {optionsData.map((option) => {
              const isActive = activeOption === option.id
              const bgSize = [1, 2].includes(option.id) ? "cover" : "cover"

              return (
                <div
                  key={option.id}
                  className={`option-item${isActive ? " active" : ""}`}
                  style={{
                    backgroundImage: `url(${option.background})`,
                    backgroundSize: bgSize,
                    ["--default-color" as string]: option.defaultColor,
                  } as React.CSSProperties}
                  onClick={() => handleOptionClick(option.id)}
                >
                  <div className="option-shadow" />
                  <div
                    className="option-label"
                    style={{
                      bottom: isActive ? 20 : 10,
                      left: isActive ? 20 : 10,
                    }}
                  >
                    <div className="option-icon">
                      <i className={option.icon} />
                    </div>
                    <div className="option-info">
                      <div
                        className="option-main"
                        style={{
                          left: isActive ? 0 : 20,
                          opacity: isActive ? 1 : 0,
                          position: "relative",
                          transition: "0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95)",
                        }}
                      >
                        {option.main}
                      </div>
                      <div
                        className="option-sub"
                        style={{
                          left: isActive ? 0 : 20,
                          opacity: isActive ? 1 : 0,
                          position: "relative",
                          transition: "0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95)",
                        }}
                      >
                        {option.sub}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile: circular thumbnails for inactive options */}
          <div className="inactive-options">
            {optionsData
              .filter((o) => o.id !== activeOption)
              .map((option) => (
                <div
                  key={option.id}
                  className="inactive-option"
                  style={{
                    backgroundImage: `url(${option.background})`,
                  }}
                  onClick={() => handleOptionClick(option.id)}
                >
                  <div className="inactive-option-inner">
                    <i className={option.icon} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
