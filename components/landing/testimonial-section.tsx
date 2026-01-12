import { Star, Quote } from "lucide-react"

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frequent Buyer",
      content:
        "This platform has made gift-giving so much easier! The instant delivery and wide selection of brands make it my go-to choice every time.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content:
        "I use this service to reward my team members. The process is seamless, and everyone loves the variety of gift cards available.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Happy Customer",
      content:
        "Best prices I've found online! Plus the customer support is incredibly responsive. Highly recommend to anyone looking for gift cards.",
      rating: 5,
    },
  ]

  return (
    <section className="relative py-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Loved by thousands of customers
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Quote icon */}
              <div className="mb-4 text-primary/20">
                <Quote className="h-10 w-10" fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 grid gap-8 rounded-2xl border border-border bg-card p-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">1,000+</div>
            <div className="text-sm text-muted-foreground">Gift Card Brands</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
