"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CtaSection() {
  const router = useRouter()

  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-xl md:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Ready to start gifting?
            </h2>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Join thousands of satisfied customers and discover the easiest way to buy and send gift cards. Get started today with exclusive deals and instant delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => router.push("/buy")}
                size="lg"
                className="group h-14 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                Browse Gift Cards
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={() => router.push("/auth")}
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold"
              >
                Create Free Account
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
