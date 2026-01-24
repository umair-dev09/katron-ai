"use client"

import { useState } from "react"
import { CreditCard, Lock, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  addCardToPayArc,
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateCardNumber,
  validateExpiryDate,
  validateCvv,
  type CardCreateRequestModel,
} from "@/lib/api/checkout"
import { toast } from "sonner"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onCardAdded: () => void
}

interface FormErrors {
  cardNumber?: string
  cardholderName?: string
  expiryDate?: string
  cvv?: string
}

export default function AddCardModal({ isOpen, onClose, onCardAdded }: AddCardModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const cardType = detectCardType(cardNumber)

  const getCardIcon = () => {
    switch (cardType) {
      case "VISA":
        return (
          <svg className="w-8 h-5" viewBox="0 0 50 16" fill="none">
            <rect width="50" height="16" rx="2" fill="#1A1F71" />
            <path d="M19.5 12.5L21.5 3.5H24L22 12.5H19.5Z" fill="white" />
            <path d="M31.5 3.7C30.9 3.5 30 3.3 28.9 3.3C25.9 3.3 23.8 4.8 23.8 6.9C23.8 8.5 25.3 9.4 26.4 9.9C27.6 10.5 28 10.8 28 11.3C28 12 27.1 12.3 26.3 12.3C25.2 12.3 24.6 12.1 23.6 11.7L23.2 11.5L22.8 14C23.6 14.4 25.1 14.7 26.6 14.7C29.8 14.7 31.8 13.2 31.8 11C31.8 9.7 31 8.7 29.3 7.9C28.3 7.4 27.7 7.1 27.7 6.5C27.7 6 28.3 5.5 29.5 5.5C30.5 5.5 31.2 5.7 31.7 5.9L32 6L31.5 3.7Z" fill="white" />
            <path d="M36.8 3.5H34.5C33.8 3.5 33.2 3.7 32.9 4.4L28.5 12.5H31.7L32.3 10.8H36.2L36.6 12.5H39.5L36.8 3.5ZM33.2 8.6C33.4 8.1 34.5 5.3 34.5 5.3C34.5 5.3 34.8 4.5 35 4L35.2 5.2C35.2 5.2 35.9 8 36 8.6H33.2Z" fill="white" />
            <path d="M17.7 3.5L14.7 9.8L14.4 8.3C13.8 6.6 12.2 4.7 10.4 3.8L13.1 12.5H16.4L21 3.5H17.7Z" fill="white" />
            <path d="M12.3 3.5H7.5L7.4 3.7C11.1 4.6 13.5 6.8 14.4 8.3L13.4 4.5C13.2 3.8 12.6 3.5 12.3 3.5Z" fill="#F9A51A" />
          </svg>
        )
      case "MASTERCARD":
        return (
          <svg className="w-8 h-5" viewBox="0 0 50 30" fill="none">
            <circle cx="18" cy="15" r="12" fill="#EB001B" />
            <circle cx="32" cy="15" r="12" fill="#F79E1B" />
            <path d="M25 5.5C27.8 7.8 29.5 11.2 29.5 15C29.5 18.8 27.8 22.2 25 24.5C22.2 22.2 20.5 18.8 20.5 15C20.5 11.2 22.2 7.8 25 5.5Z" fill="#FF5F00" />
          </svg>
        )
      case "AMEX":
        return (
          <svg className="w-8 h-5" viewBox="0 0 50 16" fill="none">
            <rect width="50" height="16" rx="2" fill="#016FD0" />
            <path d="M10 5L7 11H9L9.5 10H12.5L13 11H15L12 5H10ZM10.5 8.5L11 7L11.5 8.5H10.5Z" fill="white" />
            <path d="M15 5V11H17V9H18.5L20 11H22.5L20.5 8.5C21.5 8 22 7 22 6C22 4.5 20.5 5 20.5 5H15ZM17 6.5H19.5C19.5 6.5 20 6.5 20 7C20 7.5 19.5 7.5 19.5 7.5H17V6.5Z" fill="white" />
            <path d="M23 5V11H25V9H27V7.5H25V6.5H28V5H23Z" fill="white" />
            <path d="M29 5V11H34V9.5H31V8.5H34V7H31V6.5H34V5H29Z" fill="white" />
            <path d="M35 5V11H37V8L40 11H43V5H41V8L38 5H35Z" fill="white" />
          </svg>
        )
      default:
        return <CreditCard className="w-5 h-5 text-muted-foreground" />
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!cardNumber || !validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!cardholderName || cardholderName.trim().length < 2) {
      newErrors.cardholderName = "Please enter the cardholder name"
    }

    if (!expiryDate || !validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!cvv || !validateCvv(cvv, cardType)) {
      newErrors.cvv = cardType === "AMEX" ? "Please enter a valid 4-digit CVV" : "Please enter a valid 3-digit CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const cardData: CardCreateRequestModel = {
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardExpiryDate: expiryDate,
        cardholderName: cardholderName.trim(),
        cardIssuerType: cardType,
        cvv: cvv,
      }

      await addCardToPayArc(cardData)

      toast.success("Card added successfully!", {
        description: "Your payment method has been saved securely.",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      })

      // Reset form
      setCardNumber("")
      setCardholderName("")
      setExpiryDate("")
      setCvv("")
      setErrors({})

      onCardAdded()
      onClose()
    } catch (error) {
      console.error("Error adding card:", error)
      toast.error("Failed to add card", {
        description: error instanceof Error ? error.message : "Please check your card details and try again.",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted)
      if (errors.cardNumber) {
        setErrors((prev) => ({ ...prev, cardNumber: undefined }))
      }
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: undefined }))
      }
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const maxLength = cardType === "AMEX" ? 4 : 3
    if (value.length <= maxLength) {
      setCvv(value)
      if (errors.cvv) {
        setErrors((prev) => ({ ...prev, cvv: undefined }))
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Add Payment Card</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Your card will be securely saved for future purchases
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                autoComplete="cc-number"
                className={`pl-4 pr-12 h-11 ${errors.cardNumber ? "border-red-500 focus:border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getCardIcon()}</div>
            </div>
            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholderName" className="text-sm font-medium">
              Cardholder Name
            </Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="JOHN DOE"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value.toUpperCase())
                if (errors.cardholderName) {
                  setErrors((prev) => ({ ...prev, cardholderName: undefined }))
                }
              }}
              autoComplete="cc-name"
              className={`h-11 uppercase ${errors.cardholderName ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.cardholderName && <p className="text-xs text-red-500">{errors.cardholderName}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                autoComplete="cc-exp"
                className={`h-11 ${errors.expiryDate ? "border-red-500 focus:border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </Label>
              <div className="relative">
                <Input
                  id="cvv"
                  type="password"
                  placeholder={cardType === "AMEX" ? "1234" : "123"}
                  value={cvv}
                  onChange={handleCvvChange}
                  autoComplete="cc-csc"
                  className={`h-11 ${errors.cvv ? "border-red-500 focus:border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Your card information is encrypted and securely processed by PayArc. We never store your full card details.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Card"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
