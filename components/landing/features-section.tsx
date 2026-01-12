import { Shield, Zap, HeartHandshake, TrendingUp, Clock, Smartphone } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description:
        "Receive your gift cards immediately via email. No waiting, no hassle. Start using them within seconds of purchase.",
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description:
        "Bank-level encryption and secure payment processing ensure your transactions are safe and protected at all times.",
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description:
        "Our dedicated support team is always ready to help you with any questions or issues, day or night.",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description:
        "Get exclusive deals and discounts on popular gift cards. Save more while gifting more to your loved ones.",
    },
    {
      icon: Clock,
      title: "Easy Redemption",
      description:
        "Simple redemption process for all gift cards. Follow easy instructions and start enjoying your purchases immediately.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Buy, manage, and send gift cards on the go. Our platform works seamlessly on all devices.",
    },
  ]

  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why choose our platform?
          </h2>
          <p className="text-lg text-muted-foreground">
            We make buying and sending gift cards simple, secure, and rewarding. Experience the difference with our feature-rich platform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Join thousands of satisfied customers who trust us for their gift card needs
          </p>
        </div>
      </div>
    </section>
  )
}
