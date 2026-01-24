"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Copy, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ProtectedGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"
import { checkOrderStatus, type GiftCardOrder } from "@/lib/api/checkout"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<GiftCardOrder | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await checkOrderStatus(orderId)
        if (response.data) {
          setOrder(response.data)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="relative text-center mb-8">
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -top-20">
            <DotLottieReact
              src="/confetti.lottie"
              autoplay
              loop={false}
              style={{ width: "100%", height: "300px" }}
            />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your gift card has been purchased and sent to the recipient.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Order Details</h2>
          
          <div className="space-y-3 text-sm">
            {order?.orderId && (
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium font-mono">{order.orderId}</span>
              </div>
            )}
            {order?.productName && (
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-muted-foreground">Gift Card</span>
                <span className="font-semibold">{order.productName}</span>
              </div>
            )}
            {order?.unitPrice && (
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">${order.unitPrice}</span>
              </div>
            )}
            {order?.finalAmount && (
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-primary">${order.finalAmount}</span>
              </div>
            )}
            {order?.recipientEmail && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Sent to</span>
                <span className="font-medium">{order.recipientEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gift Card Credentials (if available) */}
        {(order?.giftCardCode || order?.giftCardPin) && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Gift Card Details</h2>
            
            {order.giftCardCode && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Code</p>
                  <p className="text-lg font-mono font-bold">{order.giftCardCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(order.giftCardCode!, "Code")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}
            
            {order.giftCardPin && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">PIN</p>
                  <p className="text-lg font-mono font-bold">{order.giftCardPin}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(order.giftCardPin!, "PIN")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Email Notice */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Email sent successfully
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              The gift card details have been sent to the recipient&apos;s email address. 
              They should receive it within a few minutes.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/buy")}
          >
            Buy Another Gift Card
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push("/my-giftcards")}
          >
            View My Orders
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<PageLoader message="Loading..." />}>
        <CheckoutSuccessContent />
      </Suspense>
    </ProtectedGuard>
  )
}
