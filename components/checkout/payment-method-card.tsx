"use client"

import { CreditCard, Check, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SavedCard } from "@/lib/api/checkout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PaymentMethodCardProps {
  card: SavedCard
  isSelected: boolean
  onSelect: () => void
  onDelete?: () => void
  onEdit?: () => void
  showActions?: boolean
}

export default function PaymentMethodCard({
  card,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  showActions = false,
}: PaymentMethodCardProps) {
  // Parse card data from API response format
  // cardNumber comes as "401200....5439" - extract last 4 digits
  const extractLastFour = (cardNum: string): string => {
    if (!cardNum) return "****"
    // Remove dots and get last 4 characters
    const cleaned = cardNum.replace(/\./g, "")
    return cleaned.slice(-4) || "****"
  }
  
  // Parse expiry date from "12/26" format
  const parseExpiry = (expiryDate: string): { month: string; year: string } => {
    if (!expiryDate) return { month: "", year: "" }
    const parts = expiryDate.split("/")
    return {
      month: parts[0] || "",
      year: parts[1] || "",
    }
  }
  
  // Detect card brand from card number (first 4-6 digits)
  const detectCardBrand = (cardNum: string): string => {
    if (!cardNum) return ""
    const firstDigits = cardNum.replace(/\./g, "").slice(0, 6)
    if (firstDigits.startsWith("4")) return "visa"
    if (firstDigits.startsWith("5") || firstDigits.startsWith("2")) return "mastercard"
    if (firstDigits.startsWith("34") || firstDigits.startsWith("37")) return "amex"
    if (firstDigits.startsWith("6")) return "discover"
    return ""
  }

  const lastFour = card.lastFour || extractLastFour(card.cardNumber)
  const expiry = parseExpiry(card.cardExpiryDate)
  const expiryMonth = card.expiryMonth || expiry.month
  const expiryYear = card.expiryYear || expiry.year
  const cardBrand = card.cardBrand || detectCardBrand(card.cardNumber) || card.cardType || ""
  const cardholderName = card.cardholderName || ""
  
  const getCardBrandIcon = () => {
    const brandLower = cardBrand?.toLowerCase() || ""
    
    if (brandLower.includes("visa")) {
      return (
        <svg className="w-10 h-6" viewBox="0 0 50 16" fill="none">
          <rect width="50" height="16" rx="2" fill="#1A1F71" />
          <path d="M19.5 12.5L21.5 3.5H24L22 12.5H19.5Z" fill="white" />
          <path d="M31.5 3.7C30.9 3.5 30 3.3 28.9 3.3C25.9 3.3 23.8 4.8 23.8 6.9C23.8 8.5 25.3 9.4 26.4 9.9C27.6 10.5 28 10.8 28 11.3C28 12 27.1 12.3 26.3 12.3C25.2 12.3 24.6 12.1 23.6 11.7L23.2 11.5L22.8 14C23.6 14.4 25.1 14.7 26.6 14.7C29.8 14.7 31.8 13.2 31.8 11C31.8 9.7 31 8.7 29.3 7.9C28.3 7.4 27.7 7.1 27.7 6.5C27.7 6 28.3 5.5 29.5 5.5C30.5 5.5 31.2 5.7 31.7 5.9L32 6L31.5 3.7Z" fill="white" />
          <path d="M36.8 3.5H34.5C33.8 3.5 33.2 3.7 32.9 4.4L28.5 12.5H31.7L32.3 10.8H36.2L36.6 12.5H39.5L36.8 3.5ZM33.2 8.6C33.4 8.1 34.5 5.3 34.5 5.3C34.5 5.3 34.8 4.5 35 4L35.2 5.2C35.2 5.2 35.9 8 36 8.6H33.2Z" fill="white" />
          <path d="M17.7 3.5L14.7 9.8L14.4 8.3C13.8 6.6 12.2 4.7 10.4 3.8L13.1 12.5H16.4L21 3.5H17.7Z" fill="white" />
          <path d="M12.3 3.5H7.5L7.4 3.7C11.1 4.6 13.5 6.8 14.4 8.3L13.4 4.5C13.2 3.8 12.6 3.5 12.3 3.5Z" fill="#F9A51A" />
        </svg>
      )
    }
    
    if (brandLower.includes("master")) {
      return (
        <svg className="w-10 h-6" viewBox="0 0 50 30" fill="none">
          <circle cx="18" cy="15" r="12" fill="#EB001B" />
          <circle cx="32" cy="15" r="12" fill="#F79E1B" />
          <path d="M25 5.5C27.8 7.8 29.5 11.2 29.5 15C29.5 18.8 27.8 22.2 25 24.5C22.2 22.2 20.5 18.8 20.5 15C20.5 11.2 22.2 7.8 25 5.5Z" fill="#FF5F00" />
        </svg>
      )
    }
    
    if (brandLower.includes("amex") || brandLower.includes("american")) {
      return (
        <svg className="w-10 h-6" viewBox="0 0 50 16" fill="none">
          <rect width="50" height="16" rx="2" fill="#016FD0" />
          <text x="25" y="11" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">AMEX</text>
        </svg>
      )
    }
    
    if (brandLower.includes("discover")) {
      return (
        <svg className="w-10 h-6" viewBox="0 0 50 16" fill="none">
          <rect width="50" height="16" rx="2" fill="#FF6000" />
          <text x="25" y="11" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">DISCOVER</text>
        </svg>
      )
    }
    
    return <CreditCard className="w-6 h-6 text-muted-foreground" />
  }

  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg border-2 transition-all duration-200",
        "flex items-center gap-4 text-left",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-800 hover:border-primary/50 bg-background"
      )}
    >
      {/* Clickable area for selection */}
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        {/* Card Brand Icon */}
        <div className="flex-shrink-0">
          {getCardBrandIcon()}
        </div>

        {/* Card Details */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              •••• {lastFour}
            </span>
            {card.isDefault && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-left">
            {expiryMonth && expiryYear ? `Expires ${expiryMonth}/${expiryYear}` : cardholderName || "Card"}
          </p>
        </div>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {showActions && onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            title="Edit card"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        
        {showActions && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={(e) => e.stopPropagation()}
                title="Remove card"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the card ending in {lastFour} from your saved payment methods. You can always add a new card later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove Card
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        {/* Selection Indicator */}
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ml-1",
            isSelected
              ? "border-primary bg-primary"
              : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>
    </div>
  )
}

interface AddNewCardButtonProps {
  onClick: () => void
}

export function AddNewCardButton({ onClick }: AddNewCardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary/50 transition-all duration-200 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <CreditCard className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground">Add new card</p>
        <p className="text-sm text-muted-foreground">Credit or debit card</p>
      </div>
      <div className="text-primary">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </button>
  )
}
