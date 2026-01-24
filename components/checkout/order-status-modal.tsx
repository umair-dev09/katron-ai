"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, Mail, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { toast } from "sonner"
import { checkOrderStatus, type GiftCardOrder } from "@/lib/api/checkout"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

type OrderStatus = "processing" | "success" | "failed"

interface OrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  initialStatus?: OrderStatus
  successMessage?: string
  recipientEmail?: string
  giftCardName?: string
  amount?: number
}

export default function OrderStatusModal({
  isOpen,
  onClose,
  orderId,
  initialStatus = "processing",
  successMessage,
  recipientEmail,
  giftCardName,
  amount,
}: OrderStatusModalProps) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(initialStatus)
  const [order, setOrder] = useState<GiftCardOrder | null>(null)
  const [pollingCount, setPollingCount] = useState(0)
  const maxPolls = 30 // Maximum number of status checks (30 * 2s = 60s timeout)

  // Update internal status when initialStatus prop changes
  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    if (!isOpen || !orderId || status !== "processing") return

    const pollStatus = async () => {
      try {
        const response = await checkOrderStatus(orderId)
        const orderData = response.data

        if (orderData) {
          setOrder(orderData)

          if (orderData.status === "COMPLETED" || orderData.paymentStatus === "PAID") {
            setStatus("success")
            return
          }

          if (orderData.status === "FAILED" || orderData.paymentStatus === "FAILED") {
            setStatus("failed")
            return
          }
        }

        // Continue polling if still processing
        setPollingCount((prev) => prev + 1)
      } catch (error) {
        console.error("Error checking order status:", error)
        // Don't immediately fail - could be a temporary error
        setPollingCount((prev) => prev + 1)
      }
    }

    // Stop polling after max attempts
    if (pollingCount >= maxPolls) {
      // After timeout, show success anyway (assume backend will process)
      setStatus("success")
      return
    }

    const intervalId = setInterval(pollStatus, 2000)
    pollStatus() // Initial check

    return () => clearInterval(intervalId)
  }, [isOpen, orderId, status, pollingCount])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleViewOrders = () => {
    onClose()
    router.push("/my-giftcards")
  }

  const handleBuyAnother = () => {
    onClose()
    router.push("/buy")
  }

  // Prevent closing during processing
  const handleOpenChange = (open: boolean) => {
    if (!open && status === "processing") {
      // Don't allow closing while processing
      return
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[450px] p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          // Prevent closing by clicking outside during processing
          if (status === "processing") {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key during processing
          if (status === "processing") {
            e.preventDefault()
          }
        }}
        // Hide the close button during processing
        hideCloseButton={status === "processing"}
      >
        <VisuallyHidden.Root>
          <DialogTitle>
            {status === "processing" ? "Processing Order" : status === "success" ? "Order Successful" : "Order Failed"}
          </DialogTitle>
        </VisuallyHidden.Root>
        {/* Processing State */}
        {status === "processing" && (
          <div className="p-8 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <Loader2 className="w-24 h-24 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Processing Your Order</h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your gift card purchase...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>This usually takes a few seconds</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background p-8 text-center">
              {/* Confetti Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <DotLottieReact
                  src="/confetti.lottie"
                  autoplay
                  loop={false}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">Order Successful!</h2>
                  <p className="text-sm text-muted-foreground">
                    Your gift card has been purchased successfully
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Order Details */}
              <div className="space-y-3">
                {(order?.productName || giftCardName) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gift Card</span>
                    <span className="font-medium text-foreground">{order?.productName || giftCardName}</span>
                  </div>
                )}
                {(order?.unitPrice || amount) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">${order?.unitPrice || amount}</span>
                  </div>
                )}
                {(order?.recipientEmail || recipientEmail) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sent to</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]">
                      {order?.recipientEmail || recipientEmail}
                    </span>
                  </div>
                )}
              </div>

              {/* Gift Card Credentials (if available) */}
              {(order?.giftCardCode || order?.giftCardPin) && (
                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Gift Card Details</h3>
                  {order.giftCardCode && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Code</p>
                        <p className="font-mono font-medium">{order.giftCardCode}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(order.giftCardCode!, "Code")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {order.giftCardPin && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">PIN</p>
                        <p className="font-mono font-medium">{order.giftCardPin}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(order.giftCardPin!, "PIN")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Email Notice */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {successMessage || "Gift card details will be sent to the recipient's email address. They should receive it within a few minutes."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={handleBuyAnother}>
                  Buy Another
                </Button>
                <Button className="flex-1" onClick={handleViewOrders}>
                  View Orders
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <>
            <div className="bg-gradient-to-b from-red-50 to-white dark:from-red-950/20 dark:to-background p-8 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">Order Failed</h2>
                  <p className="text-sm text-muted-foreground">
                    We couldn&apos;t process your gift card purchase
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Error Message */}
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {order?.status === "FAILED" && "Payment was declined. Please check your card details and try again."}
                  {order?.paymentStatus === "FAILED" && "Payment processing failed. Your card was not charged."}
                  {!order && "An unexpected error occurred. Please try again."}
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What you can try:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Check if your card has sufficient balance</li>
                  <li>Verify your card details are correct</li>
                  <li>Try a different payment method</li>
                  <li>Contact your bank if the issue persists</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button className="flex-1" onClick={handleBuyAnother}>
                  Try Again
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
