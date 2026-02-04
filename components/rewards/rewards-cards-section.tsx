"use client"

import Image from "next/image"
import Link from "next/link"

export default function RewardsCardsSection() {
  // UNCOMMENT THE LINE BELOW TO USE ACTUAL IMAGES
  const USE_IMAGES = true
  // const USE_IMAGES = false

  // Add your image paths here (27 total)
  const cardImages = [
    "/rewards-cards/airbnb.webp",
    "/rewards-cards/amazon.webp",
    "/rewards-cards/barnes-and-noble.webp",
    "/rewards-cards/bath-and-body-works.webp",
    "/rewards-cards/chipotle.webp",
    "/rewards-cards/cvs.webp",
    "/rewards-cards/dicks-sporting-goods.webp",
    "/rewards-cards/dunkin.webp",
    "/rewards-cards/gamestop.webp",
    "/rewards-cards/google.webp",//play store
    "/rewards-cards/nike.webp",
    "/rewards-cards/old-navy.webp",
    "/rewards-cards/panera.webp",
    "/rewards-cards/papa-johns.webp",
    "/rewards-cards/playstation.webp",
    "/rewards-cards/roblox.webp",
    "/rewards-cards/starbucks.webp",
    "/rewards-cards/target.webp",
    "/rewards-cards/uber.webp",
    "/rewards-cards/ulta.webp",
    "/rewards-cards/visa.webp",
    "/rewards-cards/xbox.webp",
  ]

  // Placeholder array for 27 cards
  const cards = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    image: cardImages[i],
    placeholder: `Card ${i + 1}`,
    slug: cardImages[i]?.split("/").pop()?.replace(".webp", "") || `card-${i + 1}`
  }))

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black text-center mb-6">
          Turn Receipts into Rewards
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-black/70 text-center max-w-4xl mx-auto mb-12 md:mb-16">
          Earn points on every receipt, then redeem your favorite rewards.<br />
          Popular gift cards. Cash sweepstakes entries. Even charitable donations.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mx-auto max-w-5xl">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/rewards/${card.slug}`}
              className="aspect-[3/2] rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 bg-white block"
            >
              {USE_IMAGES ? (
                <Image
                  src={card.image}
                  alt={`Reward card ${card.id}`}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <span className="text-white/40 text-sm font-medium">{card.placeholder}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
