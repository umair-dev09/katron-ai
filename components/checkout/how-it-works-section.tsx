import Image from "next/image"
import { forwardRef } from "react"

const HowItWorksSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="space-y-8">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            How KATRON PAY Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Experience the easiest way to buy and send digital gift cards online. Our streamlined three-step process 
            makes purchasing gift cards simple, secure, and instant. Whether you're shopping for yourself or sending 
            a thoughtful gift to friends and family, KATRON PAY delivers digital gift cards directly to your inbox 
            within seconds.
          </p>
        </div>

        {/* Process Description */}
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground">Browse Your Favorite Merchants</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                Explore our extensive collection of digital gift cards from top brands across multiple categories. 
                Use our advanced filtering options to find exactly what you need - filter by open loop cards that 
                work at multiple retailers, closed loop cards for specific stores, or browse by categories like 
                shopping, dining, entertainment, travel, and more. Search by store name or discover new brands 
                with exclusive discounts of up to 25% off.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground">Choose Your Gift Card Amount</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                Select from our preset denominations ranging from $10 to $500, or enter a custom amount between 
                $5 and $500 to perfectly match your gifting needs. Our flexible pricing options let you choose 
                exactly what works for your budget. Each gift card displays the available discount percentage, 
                showing you instant savings on your purchase. Review the order summary to see your total savings 
                before completing your transaction.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground">Instant Email Delivery</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                Enter the recipient's email address and complete your secure payment through our SSL-encrypted 
                checkout process. Your digital gift card will be delivered instantly to the specified email inbox 
                within minutes of purchase confirmation. Recipients receive a beautifully formatted email containing 
                their gift card code, redemption instructions, and expiration details. Perfect for last-minute gifts 
                or scheduled deliveries for special occasions. All transactions are protected with bank-level security 
                and our 100% satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Process Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <Image
              src="/katron-pay-working.png"
              alt="How KATRON PAY Works - Browse merchants, choose gift card amount, and receive instant delivery"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="text-center space-y-2">
            <div className="text-3xl">🔒</div>
            <h4 className="font-semibold text-foreground text-sm">Secure & Safe</h4>
            <p className="text-xs text-muted-foreground">Bank-level encryption protects your data</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">⚡</div>
            <h4 className="font-semibold text-foreground text-sm">Lightning Fast</h4>
            <p className="text-xs text-muted-foreground">Instant delivery within minutes</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">💯</div>
            <h4 className="font-semibold text-foreground text-sm">Satisfaction Guaranteed</h4>
            <p className="text-xs text-muted-foreground">100% money-back guarantee</p>
          </div>
        </div>
      </div>
    </section>
  )
})

HowItWorksSection.displayName = "HowItWorksSection"

export default HowItWorksSection
