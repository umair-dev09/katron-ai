"use client"

import { useRouter } from "next/navigation"
import { Gift, Sparkles, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* Hero content */}
        <div className="pb-12 pt-16 md:pb-20 md:pt-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            {/* Social proof badges */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Trusted by <span className="font-bold text-primary">10,000+</span> customers worldwide
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              The gift card marketplace
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}you've been looking for
              </span>
            </h1>

            <div className="mx-auto max-w-3xl">
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Discover thousands of gift cards from your favorite brands. Buy instantly, send digitally, and start saving today with exclusive deals and rewards.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => router.push("/buy")}
                  size="lg"
                  className="group h-12 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Browse Gift Cards
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </Button>

                <Button
                  onClick={() => router.push("/auth")}
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold"
                >
                  Get Started Free
                </Button>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Get your gift cards instantly via email
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Best Deals</h3>
                <p className="text-sm text-muted-foreground">
                  Exclusive discounts on popular brands
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">1000+ Brands</h3>
                <p className="text-sm text-muted-foreground">
                  Wide selection of gift cards to choose from
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual - Gift card preview */}
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="grid gap-4 p-8 sm:grid-cols-3">
                  {/* Sample gift cards */}
                  {[
                    { name: "Amazon", color: "from-orange-500 to-yellow-500" },
                    { name: "Netflix", color: "from-red-600 to-red-500" },
                    { name: "Spotify", color: "from-green-600 to-green-500" },
                  ].map((card) => (
                    <div
                      key={card.name}
                      className="group relative aspect-[1.586/1] overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-transform hover:scale-105"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
                      <div className="relative flex h-full flex-col justify-between p-4">
                        <div className="text-right text-xs font-medium text-white/80">
                          Gift Card
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{card.name}</div>
                          <div className="text-sm text-white/90">Starting at $10</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
