"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Button } from "@/components/ui/button"

interface GiftCardPreviewProps {
  card: {
    name: string
    bgColor: string
    logo: string
    discount: string
  }
  showBuyButton?: boolean
}

export default function GiftCardPreview({ card, showBuyButton = false }: GiftCardPreviewProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-5">
      {/* Gift Card Display */}
      <div className="group relative">
        {/* Logo Background Card */}
        <div className={`relative ${card.bgColor} p-10 flex items-center justify-center min-h-[220px] overflow-hidden rounded-t-xl`}>
          {/* Discount Sticker */}
          <div className="absolute bottom-3 left-3 bg-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-bold z-10">
            {card.discount}% OFF
          </div>

          {/* Logo */}
          <div className="text-6xl drop-shadow-lg">{card.logo}</div>
        </div>

        {/* Content */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl bg-background">
          <h3 className="text-lg font-bold text-foreground text-center">{card.name}</h3>
        </div>
      </div>

      {/* Redemption Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
          <span className="font-semibold">How to redeem:</span> Visit the {card.name} website or app, navigate to the gift card or redeem section, and enter your code to add the balance to your account.
        </p>
      </div>

      {/* Stats */}
      <div className="relative space-y-2.5 text-center px-2">
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -top-8">
          <DotLottieReact
            src="/confetti.lottie"
            autoplay
            loop={false}
            style={{ width: '150%', height: '150%' }}
          />
        </div>

        <p className="sm:text-[17px] text-[18px] font-semibold text-foreground relative z-10">
          🎉 200+ {card.name} gift cards sent
        </p>
        <p className="text-xs text-muted-foreground">
          Join thousands of satisfied customers
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            ⚡ Instant delivery
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            🔒 Secure payment
          </span>
        </div>
      </div>

      {/* Buy Now Button - Only visible when How It Works section is in view */}
      <div 
        className={`pt-2 hidden transition-all duration-300 ${
          showBuyButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <Button
          onClick={scrollToTop}
          className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm hover:shadow-md"
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}
