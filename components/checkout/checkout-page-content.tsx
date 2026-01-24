"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, AlertCircle, CreditCard, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import AmountSelector from "@/components/checkout/amount-selector"
import GiftCardPreview from "@/components/checkout/gift-card-preview"
import HowItWorksSection from "@/components/checkout/how-it-works-section"
import AddCardModal from "@/components/checkout/add-card-modal"
import PaymentMethodCard, { AddNewCardButton } from "@/components/checkout/payment-method-card"
import OrderStatusModal from "@/components/checkout/order-status-modal"
import { useAuth } from "@/lib/auth-context"
import {
  getSavedCards,
  purchaseGiftCardMerchant,
  createGiftCardOrder,
  calculateFinalPrice,
  type SavedCard,
  type GiftcardOrderRequestMerchant,
  type GiftcardOrderRequest,
} from "@/lib/api/checkout"

// Fallback card data for when product info is not available
const FALLBACK_CARD_DATA = {
  name: "Gift Card",
  bgColor: "bg-gradient-to-br from-primary/80 to-primary",
  logo: "🎁",
  discount: "0",
}

export default function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  // Get gift card data from URL params
  const productId = searchParams.get("productId")
  const productName = searchParams.get("productName") || FALLBACK_CARD_DATA.name
  const brandName = searchParams.get("brandName") || productName
  const logoUrl = searchParams.get("logoUrl") || ""
  const discountPercentage = parseFloat(searchParams.get("discount") || "0")
  const denominationType = searchParams.get("denominationType") as "FIXED" | "RANGE" | null
  const minDenomination = parseFloat(searchParams.get("minDenomination") || "5")
  const maxDenomination = parseFloat(searchParams.get("maxDenomination") || "500")
  const fixedDenominations = searchParams.get("fixedDenominations")
  const redeemInstruction = searchParams.get("redeemInstruction") || ""
  
  // Parse fixed denominations if available
  const fixedAmounts = fixedDenominations 
    ? fixedDenominations.split(",").map(Number).filter(n => !isNaN(n))
    : []

  // Card display data - use productName for full name (e.g., "Amazon US")
  const displayName = productName
  const cardDisplayData = {
    name: displayName,
    bgColor: "bg-gradient-to-br from-slate-700 to-slate-900",
    logo: logoUrl || "🎁",
    discount: discountPercentage.toString(),
  }

  // Form state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [emailError, setEmailError] = useState("")
  const [nameError, setNameError] = useState("")
  const [showBuyButton, setShowBuyButton] = useState(false)
  const howItWorksRef = useRef<HTMLElement>(null)

  // Payment state
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [loadingCards, setLoadingCards] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Order status modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "failed">("processing")
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string>("")

  // Check if user is MERCHANT
  const isMerchant = user?.accountType === "MERCHANT" || user?.accountType === "ADMIN"

  // Intersection Observer to track How It Works section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBuyButton(entry.isIntersecting)
      },
      {
        threshold: 0.4,
        rootMargin: "-20% 0px -20% 0px",
      }
    )

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current)
    }

    return () => {
      if (howItWorksRef.current) {
        observer.unobserve(howItWorksRef.current)
      }
    }
  }, [])

  // Load saved cards for MERCHANT users
  const loadSavedCards = useCallback(async () => {
    if (!isMerchant) return

    setLoadingCards(true)
    try {
      const response = await getSavedCards()
      const cards = response.data || []
      setSavedCards(cards)
      
      // Auto-select the default card or first card
      if (cards.length > 0) {
        const defaultCard = cards.find(c => c.isDefault) || cards[0]
        setSelectedCardId(defaultCard.cardId || defaultCard.id?.toString())
      }
    } catch (error) {
      console.error("Error loading cards:", error)
      // Don't show error toast - cards might not exist yet
    } finally {
      setLoadingCards(false)
    }
  }, [isMerchant])

  useEffect(() => {
    if (!authLoading && user && isMerchant) {
      loadSavedCards()
    }
  }, [authLoading, user, isMerchant, loadSavedCards])

  // Pre-fill recipient email with user's email
  useEffect(() => {
    if (user?.email && !recipientEmail) {
      setRecipientEmail(user.email)
    }
    if (user?.firstname && !recipientName) {
      setRecipientName(`${user.firstname} ${user.lastname || ""}`.trim())
    }
  }, [user, recipientEmail, recipientName])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setRecipientEmail(value)
    if (emailError && validateEmail(value)) {
      setEmailError("")
    }
  }

  const handleNameChange = (value: string) => {
    setRecipientName(value)
    if (nameError && value.trim().length >= 2) {
      setNameError("")
    }
  }

  const validateForm = (): boolean => {
    let isValid = true

    if (!selectedAmount) {
      toast.error("Please select an amount")
      isValid = false
    }

    if (!recipientEmail) {
      setEmailError("Email address is required")
      isValid = false
    } else if (!validateEmail(recipientEmail)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    if (isMerchant && !recipientName?.trim()) {
      setNameError("Recipient name is required")
      isValid = false
    }

    if (isMerchant && savedCards.length === 0) {
      toast.error("Please add a payment card first")
      setIsAddCardModalOpen(true)
      isValid = false
    }

    if (isMerchant && savedCards.length > 0 && !selectedCardId) {
      toast.error("Please select a payment method")
      isValid = false
    }

    if (!productId) {
      toast.error("Invalid gift card. Please go back and select a gift card.")
      isValid = false
    }

    return isValid
  }

  const handleMerchantPurchase = async () => {
    if (!productId || !selectedAmount || !recipientEmail || !recipientName) return

    setIsProcessing(true)
    // Show processing modal immediately
    setOrderStatus("processing")
    setIsOrderModalOpen(true)

    try {
      const orderData: GiftcardOrderRequestMerchant = {
        giftCardId: parseInt(productId),
        quantity: 1,
        unitPrice: selectedAmount,
        email: recipientEmail,
        name: recipientName.trim(),
      }

      const response = await purchaseGiftCardMerchant(orderData)
      
      console.log("[Checkout] Merchant purchase response:", response)
      
      // Check for success - API returns status 200 with message containing "success" even if data is empty
      const isSuccess = response.status === 200 || 
                       (response.message && response.message.toLowerCase().includes("success"))
      
      // Format the API message properly (fix capitalization and spacing)
      const formatMessage = (msg: string): string => {
        if (!msg) return "Payment successful! Gift card will be sent soon."
        // Capitalize first letter and fix spacing after periods
        return msg
          .replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
          .replace(/\.([A-Za-z])/g, ". $1") // Add space after period if missing
      }
      
      if (isSuccess) {
        // Store the formatted success message from API
        setOrderSuccessMessage(formatMessage(response.message))
        setCurrentOrderId(response.data?.orderId || response.data?.id?.toString() || null)
        // Update to success status
        setOrderStatus("success")
      } else {
        throw new Error(response.message || "Failed to process order")
      }
    } catch (error) {
      console.error("Merchant purchase error:", error)
      toast.error("Failed to process order", {
        description: error instanceof Error ? error.message : "Please try again",
      })
      setOrderStatus("failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUserPurchase = async () => {
    if (!productId || !selectedAmount) return

    setIsProcessing(true)

    try {
      const currentUrl = typeof window !== "undefined" ? window.location.origin : ""
      
      const orderData: GiftcardOrderRequest = {
        giftCardId: parseInt(productId),
        quantity: 1,
        unitPrice: selectedAmount,
        successUrl: `${currentUrl}/checkout/success`,
        failureUrl: `${currentUrl}/checkout/failure`,
      }

      console.log("[Checkout] Creating order for USER:", orderData)

      const response = await createGiftCardOrder(orderData)
      
      // Detailed client-side debugging
      console.log("[Checkout CLIENT] Full response object:", response)
      console.log("[Checkout CLIENT] response.data:", response.data)
      console.log("[Checkout CLIENT] response.data keys:", response.data ? Object.keys(response.data) : "no data")
      console.log("[Checkout CLIENT] response.data.paymentFormUrl:", response.data?.paymentFormUrl)
      console.log("[Checkout CLIENT] response.data.orderId:", response.data?.orderId)
      
      // Check for payment URL - paymentFormUrl is the primary field from PayArc
      const paymentUrl = response.data?.paymentFormUrl ||
                        response.data?.paymentUrl || 
                        response.data?.payment_url || 
                        response.data?.redirectUrl ||
                        response.data?.redirect_url ||
                        (response.data as any)?.url

      console.log("[Checkout CLIENT] Extracted paymentUrl:", paymentUrl)

      if (paymentUrl) {
        // Redirect to external payment page
        console.log("[Checkout] Redirecting to payment URL:", paymentUrl)
        window.location.href = paymentUrl
      } else if (response.data?.orderId || response.data?.id) {
        // If no payment URL but has order ID, show processing modal
        const orderId = response.data.orderId || response.data.id?.toString() || null
        console.log("[Checkout] No payment URL, showing processing modal for order:", orderId)
        setCurrentOrderId(orderId)
        setOrderStatus("processing")
        setIsOrderModalOpen(true)
      } else if (response.status === 200 && response.data) {
        // If response is successful but data structure is different, try to extract URL
        console.log("[Checkout] Checking response data for URL:", response.data)
        const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
        const urlMatch = dataStr.match(/https?:\/\/[^\s"']+/)
        if (urlMatch) {
          console.log("[Checkout] Found URL in response:", urlMatch[0])
          window.location.href = urlMatch[0]
        } else {
          throw new Error(response.message || "No payment URL received from server")
        }
      } else {
        throw new Error(response.message || "Failed to create order")
      }
    } catch (error) {
      console.error("User purchase error:", error)
      toast.error("Failed to create order", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBuyNow = async () => {
    if (!validateForm()) return

    if (isMerchant) {
      await handleMerchantPurchase()
    } else {
      await handleUserPurchase()
    }
  }

  const finalPrice = selectedAmount 
    ? calculateFinalPrice(selectedAmount, discountPercentage)
    : 0

  // Check if we have valid product data
  if (!productId) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-bold">No Gift Card Selected</h1>
          <p className="text-muted-foreground">
            Please go back to the gift cards page and select a card to purchase.
          </p>
          <Button onClick={() => router.push("/buy")}>
            Browse Gift Cards
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
          <button
            onClick={() => router.push("/buy")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gift Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Side - Gift Card Preview (30%) */}
          <aside className="w-full lg:w-[30%]">
            <GiftCardPreview 
              card={cardDisplayData} 
              showBuyButton={showBuyButton}
              logoUrl={logoUrl}
              redeemInstruction={redeemInstruction}
            />
          </aside>

          {/* Right Side - Checkout Form (70%) */}
          <section className="w-full lg:w-[70%]">
            <div className="space-y-7">
              {/* Header */}
              <div className="space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Email a {displayName} Digital Gift Card
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Select an amount and add recipient details
                </p>
              </div>

              {/* Step 1: Amount Selection */}
              <div className="space-y-3.5">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    1. Choose amount 
                    {denominationType === "RANGE" && ` ($${minDenomination} - $${maxDenomination})`}
                  </h2>
                  {selectedAmount && (
                    <span className="text-xs text-primary font-semibold">
                      Selected: ${selectedAmount}
                    </span>
                  )}
                </div>
                <AmountSelector 
                  selectedAmount={selectedAmount} 
                  onAmountChange={setSelectedAmount}
                  denominationType={denominationType || "RANGE"}
                  minAmount={minDenomination}
                  maxAmount={maxDenomination}
                  fixedAmounts={fixedAmounts.length > 0 ? fixedAmounts : undefined}
                />
              </div>

              {/* Step 2: Recipient Details */}
              <div className="space-y-3.5">
                <h2 className="text-lg font-bold text-foreground">2. Enter recipient details</h2>
                <div className="space-y-4">
                  {/* Recipient Name (Required for MERCHANT) */}
                  {isMerchant && (
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Recipient name"
                          value={recipientName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className={`pl-11 h-12 text-sm bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 focus:border-primary ${
                            nameError ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                      {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                    </div>
                  )}

                  {/* Recipient Email */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`pl-11 h-12 text-sm bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 focus:border-primary ${
                          emailError ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>
                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  </div>

                  <p className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-0.5 text-sm">ℹ️</span>
                    <span>
                      The digital gift card will be sent instantly to this email address. Please double-check the email
                      to ensure your recipient receives their gift card without any delays.
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 3: Payment Method (MERCHANT only) */}
              {isMerchant && (
                <div className="space-y-3.5">
                  <h2 className="text-lg font-bold text-foreground">3. Select payment method</h2>
                  
                  {loadingCards ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading payment methods...</span>
                    </div>
                  ) : savedCards.length > 0 ? (
                    <div className="space-y-3">
                      {savedCards.map((card) => (
                        <PaymentMethodCard
                          key={card.cardId || card.id}
                          card={card}
                          isSelected={selectedCardId === (card.cardId || card.id?.toString())}
                          onSelect={() => setSelectedCardId(card.cardId || card.id?.toString())}
                        />
                      ))}
                      <AddNewCardButton onClick={() => setIsAddCardModalOpen(true)} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              No payment method saved
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                              Add a credit or debit card to make purchases. Your card will be securely saved for future transactions.
                            </p>
                          </div>
                        </div>
                      </div>
                      <AddNewCardButton onClick={() => setIsAddCardModalOpen(true)} />
                    </div>
                  )}
                </div>
              )}

              {/* Summary Card */}
              {selectedAmount && (
                <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-sm">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gift Card</span>
                      <span className="font-semibold text-foreground">{displayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">${selectedAmount}</span>
                    </div>
                    {discountPercentage > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-semibold text-green-600">-{discountPercentage}%</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-bold text-foreground text-lg">
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={!selectedAmount || !recipientEmail || isProcessing}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>Buy Now {selectedAmount && `- $${finalPrice.toFixed(2)}`}</>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">🔒 Secure SSL Payment</span>
                <span className="flex items-center gap-1.5">⚡ Instant Email Delivery</span>
                <span className="flex items-center gap-1.5">✓ 100% Satisfaction Guaranteed</span>
              </div>

              {/* How It Works Section */}
              <HowItWorksSection ref={howItWorksRef} />
            </div>
          </section>
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onCardAdded={loadSavedCards}
      />

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false)
          setCurrentOrderId(null)
          setOrderStatus("processing")
          setOrderSuccessMessage("")
        }}
        orderId={currentOrderId}
        initialStatus={orderStatus}
        successMessage={orderSuccessMessage}
        recipientEmail={recipientEmail}
        giftCardName={displayName}
        amount={selectedAmount || undefined}
      />
    </main>
  )
}
