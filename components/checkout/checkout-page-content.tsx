"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import AmountSelector from "@/components/checkout/amount-selector"
import GiftCardPreview from "@/components/checkout/gift-card-preview"
import HowItWorksSection from "@/components/checkout/how-it-works-section"

// Gift card data - This should match your actual data
const GIFT_CARDS_DATA: Record<string, { name: string; bgColor: string; logo: string; discount: string }> = {
  cleartrip: { name: "Cleartrip", bgColor: "bg-orange-500", logo: "✈️", discount: "22.3" },
  amazon: { name: "Amazon", bgColor: "bg-yellow-400", logo: "🛍️", discount: "15.5" },
  spotify: { name: "Spotify", bgColor: "bg-green-500", logo: "🎵", discount: "10" },
  netflix: { name: "Netflix", bgColor: "bg-red-600", logo: "🎬", discount: "18.7" },
  "uber-eats": { name: "Uber Eats", bgColor: "bg-black", logo: "🍔", discount: "25" },
  swiggy: { name: "Swiggy", bgColor: "bg-orange-600", logo: "🚚", discount: "12.5" },
  zomato: { name: "Zomato", bgColor: "bg-red-500", logo: "🍽️", discount: "20" },
  "booking-com": { name: "Booking.com", bgColor: "bg-blue-500", logo: "🏨", discount: "14.2" },
  itunes: { name: "iTunes", bgColor: "bg-slate-700", logo: "🎵", discount: "8.5" },
}

export default function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showBuyButton, setShowBuyButton] = useState(false)
  const howItWorksRef = useRef<HTMLElement>(null)

  const brandParam = searchParams.get("brand") || "amazon"
  const card = GIFT_CARDS_DATA[brandParam.toLowerCase()] || GIFT_CARDS_DATA.amazon

  // Intersection Observer to track How It Works section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBuyButton(entry.isIntersecting)
      },
      {
        threshold: 0.4, // Trigger when 60% of the section is visible (middle of screen)
        rootMargin: "-20% 0px -20% 0px", // Section must be in the middle 60% of viewport
      }
    )

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current)
    }

    return () => {
      if (howItWorksRef.current) {
        observer.unobserve(howItWorksRef.current)
      }
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setRecipientEmail(value)
    if (emailError && validateEmail(value)) {
      setEmailError("")
    }
  }

  const handleBuyNow = () => {
    // Validate
    if (!selectedAmount) {
      toast.error("Please select an amount")
      return
    }

    if (!recipientEmail) {
      setEmailError("Email address is required")
      toast.error("Please enter recipient email address")
      return
    }

    if (!validateEmail(recipientEmail)) {
      setEmailError("Please enter a valid email address")
      toast.error("Please enter a valid email address")
      return
    }

    // Success
    toast.success(`Processing ${card.name} gift card for $${selectedAmount}`)
    
    // Here you would integrate with your backend
    console.log({
      brand: card.name,
      amount: selectedAmount,
      recipientEmail: recipientEmail,
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="bg-background ">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
          <button
            onClick={() => router.push("/buy")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gift Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Side - Gift Card Preview (30%) */}
          <aside className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-6">
              <GiftCardPreview card={card} showBuyButton={showBuyButton} />
            </div>
          </aside>

          {/* Right Side - Checkout Form (70%) */}
          <section className="w-full lg:w-[70%]">
            <div className="space-y-7">
              {/* Header */}
              <div className="space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Email a {card.name} Digital Gift Card
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Select an amount and add email address
                </p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3.5">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-foreground">1. Choose amount ($5 - $500)</h2>
                  {selectedAmount && (
                    <span className="text-xs text-primary font-semibold">
                      Selected: ${selectedAmount}
                    </span>
                  )}
                </div>
                <AmountSelector selectedAmount={selectedAmount} onAmountChange={setSelectedAmount} />
              </div>

              {/* Email Input */}
              <div className="space-y-3.5">
                <h2 className="text-lg font-bold text-foreground">2. Enter recipient email</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`pl-11 h-12 text-sm bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 focus:border-primary ${
                        emailError ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                  </div>
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  <p className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-0.5 text-sm">ℹ️</span>
                    <span>
                      The digital gift card will be sent instantly to this email address. Please double-check the email
                      to ensure your recipient receives their gift card without any delays.
                    </span>
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              {selectedAmount && (
                <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-sm">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gift Card</span>
                      <span className="font-semibold text-foreground">{card.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">${selectedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-semibold text-green-600">-{card.discount}%</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-bold text-foreground text-lg">
                          ${(selectedAmount * (1 - parseFloat(card.discount) / 100)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={!selectedAmount || !recipientEmail}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                Buy Now {selectedAmount && `- $${(selectedAmount * (1 - parseFloat(card.discount) / 100)).toFixed(2)}`}
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">🔒 Secure SSL Payment</span>
                <span className="flex items-center gap-1.5">⚡ Instant Email Delivery</span>
                <span className="flex items-center gap-1.5">✓ 100% Satisfaction Guaranteed</span>
              </div>

              {/* How It Works Section */}
              <HowItWorksSection ref={howItWorksRef} />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
