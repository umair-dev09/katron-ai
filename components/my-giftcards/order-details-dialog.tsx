"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface OrderDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: number
    name: string
    description: string
    bgColor: string
    logo: string
    purchaseDate: string
    amount: string
    status: "pending" | "completed" | "failed"
    payarcTransactionId: string
    reloadlyTransactionId: string
  }
}

export default function OrderDetailsDialog({ isOpen, onClose, order }: OrderDetailsDialogProps) {
  const [copiedPayarc, setCopiedPayarc] = useState(false)
  const [copiedReloadly, setCopiedReloadly] = useState(false)

  const copyToClipboard = (text: string, type: "payarc" | "reloadly") => {
    navigator.clipboard.writeText(text)
    if (type === "payarc") {
      setCopiedPayarc(true)
      setTimeout(() => setCopiedPayarc(false), 2000)
    } else {
      setCopiedReloadly(true)
      setTimeout(() => setCopiedReloadly(false), 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete information about your gift card order</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Gift Card Logo */}
          <div className={`${order.bgColor} p-12 flex items-center justify-center rounded-xl min-h-[180px]`}>
            <div className="text-6xl drop-shadow-lg">{order.logo}</div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            {/* Name and Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{order.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{order.description}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Date and Price */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Purchase Date</p>
                <p className="text-sm font-semibold text-foreground">{order.purchaseDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Amount</p>
                <p className="text-sm font-semibold text-foreground">${order.amount}</p>
              </div>
            </div>

            {/* Transaction IDs */}
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              {/* Payarc Transaction ID */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Payarc Transaction ID
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                    <p className="text-xs font-mono text-foreground truncate">{order.payarcTransactionId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(order.payarcTransactionId, "payarc")}
                    className="px-3"
                  >
                    {copiedPayarc ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Reloadly Transaction ID */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Reloadly Transaction ID
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                    <p className="text-xs font-mono text-foreground truncate">{order.reloadlyTransactionId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(order.reloadlyTransactionId, "reloadly")}
                    className="px-3"
                  >
                    {copiedReloadly ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
