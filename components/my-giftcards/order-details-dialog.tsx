"use client"

import { Copy, Check, Mail, ExternalLink, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  type GiftCardOrder,
  getStatusColor,
  getPaymentStatusColor,
  getStatusLabel,
  formatOrderDate,
  formatCurrency,
  getBrandBgColor,
  getBrandLogo,
  getOrderLogoUrl,
  normalizeStatus,
  normalizePaymentStatus,
  hasGiftCardCredentials,
  getGiftCardCredentials,
  resendGiftCardCredentials,
} from "@/lib/api/orders"

interface OrderDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  order: GiftCardOrder | null
  onRefreshOrder?: (orderId: number) => void
}

export default function OrderDetailsDialog({ isOpen, onClose, order, onRefreshOrder }: OrderDetailsDialogProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedPin, setCopiedPin] = useState(false)
  const [copiedTransactionId, setCopiedTransactionId] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!order) return null

  const normalizedStatus = normalizeStatus(order.status || order.orderStatus)
  const normalizedPaymentStatus = normalizePaymentStatus(order.paymentStatus)
  const credentials = getGiftCardCredentials(order)
  const hasCredentials = hasGiftCardCredentials(order)
  const logoUrl = getOrderLogoUrl(order)
  // Always use vibrant brand colors for backgrounds
  const bgColor = getBrandBgColor(order.brandName || order.productName)

  const copyToClipboard = async (text: string, type: "code" | "pin" | "transaction") => {
    try {
      await navigator.clipboard.writeText(text)
      
      switch (type) {
        case "code":
          setCopiedCode(true)
          setTimeout(() => setCopiedCode(false), 2000)
          break
        case "pin":
          setCopiedPin(true)
          setTimeout(() => setCopiedPin(false), 2000)
          break
        case "transaction":
          setCopiedTransactionId(true)
          setTimeout(() => setCopiedTransactionId(false), 2000)
          break
      }
      
      toast.success("Copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleResendCredentials = async () => {
    setIsResending(true)
    try {
      const response = await resendGiftCardCredentials(order.id)
      toast.success(response.message || "Gift card credentials sent to email successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to resend credentials")
    } finally {
      setIsResending(false)
    }
  }

  const handleRefreshStatus = async () => {
    if (!onRefreshOrder) return
    setIsRefreshing(true)
    try {
      await onRefreshOrder(order.id)
      toast.success("Order status refreshed")
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh status")
    } finally {
      setIsRefreshing(false)
    }
  }

  const getTransactionId = () => {
    return order.payarcTransactionId || order.reloadlyTransactionId || order.transactionId || order.orderId || String(order.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <span className="text-sm font-normal text-muted-foreground">
              #{order.orderId || order.id}
            </span>
          </DialogTitle>
          <DialogDescription>
            Complete information about your gift card order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Gift Card Logo */}
          <div className={`${bgColor} p-10 flex items-center justify-center rounded-xl min-h-[160px] relative`}>
            {logoUrl && !imageError ? (
              <img 
                src={logoUrl} 
                alt={order.brandName || order.productName || "Gift Card"} 
                className="max-h-28 max-w-[220px] object-contain drop-shadow-md"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Fallback emoji when no logo or logo fails to load */
              <div className="text-6xl drop-shadow-lg">
                {getBrandLogo(order.brandName || order.productName)}
              </div>
            )}
            
            {/* Status overlay */}
            <div className="absolute top-3 right-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            {/* Name and Status */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {order.brandName || order.productName || "Gift Card"}
              </h3>
              {order.productName && order.brandName && order.productName !== order.brandName && (
                <p className="text-sm text-muted-foreground">{order.productName}</p>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                Order: {getStatusLabel(order.status)}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment: {normalizedPaymentStatus}
              </span>
            </div>

            {/* Pricing Info */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Unit Price</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(order.unitPrice, order.currencyCode)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Quantity</p>
                <p className="text-sm font-semibold text-foreground">{order.quantity || 1}</p>
              </div>
              {order.discount && order.discount > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Discount</p>
                  <p className="text-sm font-semibold text-green-600">
                    -{formatCurrency(order.discountAmount || order.discount, order.currencyCode)}
                  </p>
                </div>
              )}
              {order.fee && order.fee > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Fee</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(order.fee, order.currencyCode)}
                  </p>
                </div>
              )}
              <div className={order.discount || order.fee ? "col-span-2" : ""}>
                <p className="text-xs text-muted-foreground font-medium mb-1">Total Amount</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(order.finalAmount || order.totalAmount || order.unitPrice, order.currencyCode)}
                </p>
              </div>
            </div>

            {/* Recipient Info */}
            {(order.recipientEmail || order.recipientName || order.email || order.name) && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Recipient</p>
                {(order.recipientName || order.name) && (
                  <p className="text-sm font-semibold text-foreground">{order.recipientName || order.name}</p>
                )}
                {(order.recipientEmail || order.email) && (
                  <p className="text-sm text-muted-foreground">{order.recipientEmail || order.email}</p>
                )}
              </div>
            )}

            {/* Date Info */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Order Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatOrderDate(order.createdAt || order.orderDate || order.purchaseDate)}
                </p>
              </div>
              {(normalizedStatus === "COMPLETED" && order.completedAt) && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Completed</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatOrderDate(order.completedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Gift Card Credentials - Only show for completed orders */}
            {normalizedStatus === "COMPLETED" && hasCredentials && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Gift Card Credentials
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="text-xs"
                  >
                    {showCredentials ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </div>

                {/* Gift Card Code */}
                {credentials.code && (
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                      Gift Card Code
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                        <p className="text-sm font-mono text-foreground truncate">
                          {showCredentials ? credentials.code : "••••••••••••••••"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(credentials.code!, "code")}
                        className="px-3"
                        disabled={!showCredentials}
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Gift Card PIN */}
                {credentials.pin && (
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                      PIN Code
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                        <p className="text-sm font-mono text-foreground truncate">
                          {showCredentials ? credentials.pin : "••••"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(credentials.pin!, "pin")}
                        className="px-3"
                        disabled={!showCredentials}
                      >
                        {copiedPin ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Resend to Email Button */}
                <Button
                  onClick={handleResendCredentials}
                  variant="outline"
                  size="sm"
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend to Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Pending Payment Notice */}
            {normalizedStatus === "PENDING" && normalizedPaymentStatus === "PENDING" && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      Payment Pending
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                      Complete your payment to receive your gift card.
                    </p>
                  </div>
                </div>
                
                {(order.paymentFormUrl || order.paymentUrl) && (
                  <Button
                    onClick={() => window.open(order.paymentFormUrl || order.paymentUrl, "_blank")}
                    className="w-full mt-3"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Payment
                  </Button>
                )}
              </div>
            )}

            {/* Failed Order Notice */}
            {normalizedStatus === "FAILED" && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      Order Failed
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                      There was an issue processing your order. Please try again or contact support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Order Notice */}
            {normalizedStatus === "PROCESSING" && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      Processing Order
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">
                      Your order is being processed. This may take a few moments.
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={handleRefreshStatus}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="w-full mt-3"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Transaction Reference */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                Transaction Reference
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs font-mono text-foreground truncate">{getTransactionId()}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(getTransactionId(), "transaction")}
                  className="px-3"
                >
                  {copiedTransactionId ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
