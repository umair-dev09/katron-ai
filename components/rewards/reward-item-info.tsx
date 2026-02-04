"use client"

interface RewardItemInfoProps {
  brandName: string
}

export default function RewardItemInfo({ brandName }: RewardItemInfoProps) {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-6 md:mb-8">
          Earn KTN Digital Rewards with KATRON PAY
        </h2>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-700 mb-8 md:mb-12 leading-relaxed">
          KTN is our Digital Rewards balance. Earn KTN on eligible purchases with participating merchants and use it to unlock discounts and special offers inside the KATRON PAY network.
        </p>

        {/* How to earn KTN */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-4">
            How to earn KTN
          </h3>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Shop with participating merchants through KATRON PAY</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Complete eligible purchases (earning is subject to program rules and verification)</span>
            </li>
          </ul>
        </div>

        {/* How to use KTN */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-4">
            How to use KTN
          </h3>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Redeem KTN for discounts and offers at participating merchants</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Apply rewards during checkout where available</span>
            </li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-purple-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-4">
            Important notes
          </h3>
          <ul className="space-y-3 text-base sm:text-lg text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>KTN is not cash and is not redeemable for cash</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>KTN is intended for use within KATRON PAY with participating merchants</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Earning rates, redemption options, and availability may vary and can change over time</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
