"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { XCircle, RefreshCw, ArrowLeft, CreditCard, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

function CheckoutFailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const orderId = searchParams.get("orderId")
  const errorMessage = searchParams.get("error") || "Your payment could not be processed"

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t complete your gift card purchase. Don&apos;t worry, your card was not charged.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {errorMessage}
              </p>
              {orderId && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Reference: {orderId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            What you can try
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Check your card details</p>
                <p className="text-xs text-muted-foreground">
                  Make sure your card number, expiry date, and CVV are correct.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Verify sufficient balance</p>
                <p className="text-xs text-muted-foreground">
                  Ensure your card has enough available balance for the purchase.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Try a different payment method</p>
                <p className="text-xs text-muted-foreground">
                  If the issue persists, try using a different card or payment method.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Contact your bank</p>
                <p className="text-xs text-muted-foreground">
                  Your bank may have blocked the transaction. Contact them to authorize it.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/buy")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gift Cards
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.back()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        {/* Support Link */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Need help? Contact our{" "}
          <a href="mailto:support@katronai.com" className="text-primary hover:underline">
            support team
          </a>
        </p>
      </div>
    </main>
  )
}

export default function CheckoutFailurePage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<PageLoader message="Loading..." />}>
        <CheckoutFailureContent />
      </Suspense>
    </ProtectedGuard>
  )
}
