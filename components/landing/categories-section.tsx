"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag, Utensils, Plane, Gamepad2, Music, Film } from "lucide-react"

export default function CategoriesSection() {
  const router = useRouter()

  const categories = [
    {
      name: "Shopping",
      icon: ShoppingBag,
      count: "500+ brands",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      name: "Dining",
      icon: Utensils,
      count: "200+ restaurants",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      name: "Travel",
      icon: Plane,
      count: "100+ services",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      count: "150+ platforms",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      name: "Music",
      icon: Music,
      count: "50+ services",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      name: "Entertainment",
      icon: Film,
      count: "80+ brands",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ]

  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Explore gift cards by category
          </h2>
          <p className="text-lg text-muted-foreground">
            From shopping to entertainment, find the perfect gift card for every occasion and interest.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => router.push(`/buy?category=${category.name.toLowerCase()}`)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`} />
              
              {/* Icon */}
              <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${category.bgColor} transition-transform group-hover:scale-110`}>
                <category.icon className={`h-8 w-8 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-2xl font-bold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>

              {/* Arrow indicator */}
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Browse now
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Popular brands showcase */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-semibold text-muted-foreground">
              Trusted by millions, featuring top brands
            </h3>
          </div>
          
          {/* Brand logos placeholder */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
            {["Amazon", "Netflix", "Spotify", "Uber", "Starbucks", "iTunes"].map((brand) => (
              <div
                key={brand}
                className="flex h-12 items-center justify-center rounded-lg bg-muted px-6 text-sm font-bold"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
