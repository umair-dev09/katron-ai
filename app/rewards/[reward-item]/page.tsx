import Image from "next/image"
import { notFound } from "next/navigation"
import RewardItemHero from "@/components/rewards/reward-item-hero"
import RewardItemInfo from "@/components/rewards/reward-item-info"
import RewardItemFAQ from "@/components/rewards/reward-item-faq"

// Brand data mapping
const brandData: Record<string, { name: string; image: string }> = {
  "airbnb": { name: "Airbnb", image: "/rewards-cards/airbnb.webp" },
  "amazon": { name: "Amazon", image: "/rewards-cards/amazon.webp" },
  "barnes-and-noble": { name: "Barnes & Noble", image: "/rewards-cards/barnes-and-noble.webp" },
  "bath-and-body-works": { name: "Bath & Body Works", image: "/rewards-cards/bath-and-body-works.webp" },
  "chipotle": { name: "Chipotle", image: "/rewards-cards/chipotle.webp" },
  "cvs": { name: "CVS", image: "/rewards-cards/cvs.webp" },
  "dicks-sporting-goods": { name: "Dick's Sporting Goods", image: "/rewards-cards/dicks-sporting-goods.webp" },
  "dunkin": { name: "Dunkin'", image: "/rewards-cards/dunkin.webp" },
  "gamestop": { name: "GameStop", image: "/rewards-cards/gamestop.webp" },
  "google": { name: "Google Play", image: "/rewards-cards/google.webp" },
  "nike": { name: "Nike", image: "/rewards-cards/nike.webp" },
  "old-navy": { name: "Old Navy", image: "/rewards-cards/old-navy.webp" },
  "panera": { name: "Panera", image: "/rewards-cards/panera.webp" },
  "papa-johns": { name: "Papa John's", image: "/rewards-cards/papa-johns.webp" },
  "playstation": { name: "PlayStation", image: "/rewards-cards/playstation.webp" },
  "roblox": { name: "Roblox", image: "/rewards-cards/roblox.webp" },
  "starbucks": { name: "Starbucks", image: "/rewards-cards/starbucks.webp" },
  "target": { name: "Target", image: "/rewards-cards/target.webp" },
  "uber": { name: "Uber", image: "/rewards-cards/uber.webp" },
  "ulta": { name: "Ulta", image: "/rewards-cards/ulta.webp" },
  "visa": { name: "Visa", image: "/rewards-cards/visa.webp" },
  "xbox": { name: "Xbox", image: "/rewards-cards/xbox.webp" }
}

// Required for static export with dynamic routes
export function generateStaticParams() {
  return Object.keys(brandData).map((slug) => ({
    "reward-item": slug,
  }))
}

export default async function RewardItemPage({ params }: { params: Promise<{ "reward-item": string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams["reward-item"]
  const brand = brandData[slug]

  // If brand not found, show 404
  if (!brand) {
    notFound()
  }

  return (
    <main className="bg-white">

      {/* Brand Card Section */}
      <section className="relative pt-32 md:pt-40 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          {/* Brand Card Image */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="aspect-[3/2] w-full max-w-xs rounded-xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300 bg-white">
              <Image
                src={brand.image}
                alt={`${brand.name} gift card`}
                width={300}
                height={200}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            {brand.name}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Earn rewards and redeem {brand.name} gift cards with KATRON PAY
          </p>
        </div>
      </section>

      {/* Info Section */}
      <RewardItemInfo brandName={brand.name} />

      {/* Hero Section (without floating cards) */}
      <RewardItemHero brandName={brand.name} />

      {/* FAQ Section */}
      <RewardItemFAQ brandName={brand.name} />
    </main>
  )
}
