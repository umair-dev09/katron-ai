"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface AmountSelectorProps {
  selectedAmount: number | null
  onAmountChange: (amount: number) => void
  denominationType?: "FIXED" | "RANGE"
  minAmount?: number
  maxAmount?: number
  fixedAmounts?: number[]
}

// Default preset amounts for RANGE type
const DEFAULT_PRESET_AMOUNTS = [10, 25, 50, 100, 150, 200, 250, 500]

export default function AmountSelector({
  selectedAmount,
  onAmountChange,
  denominationType = "RANGE",
  minAmount = 5,
  maxAmount = 500,
  fixedAmounts,
}: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)

  // Use fixed amounts if provided, otherwise generate preset amounts within range
  const presetAmounts = denominationType === "FIXED" && fixedAmounts && fixedAmounts.length > 0
    ? fixedAmounts.sort((a, b) => a - b)
    : DEFAULT_PRESET_AMOUNTS.filter(amount => amount >= minAmount && amount <= maxAmount)

  const handlePresetClick = (amount: number) => {
    setIsCustom(false)
    setCustomAmount("")
    onAmountChange(amount)
  }

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "")
    setCustomAmount(numericValue)
    
    const parsedAmount = parseInt(numericValue)
    if (numericValue && parsedAmount >= minAmount && parsedAmount <= maxAmount) {
      setIsCustom(true)
      onAmountChange(parsedAmount)
    }
  }

  // For FIXED denomination, don't show custom input
  const showCustomInput = denominationType === "RANGE"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={`px-5 py-3.5 rounded-lg font-semibold text-base transition-all border-2 ${
              selectedAmount === amount && !isCustom
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Custom Amount Input - Only for RANGE type */}
      {showCustomInput && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Custom amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-semibold">
              $
            </span>
            <Input
              type="text"
              placeholder={`Enter amount (${minAmount}-${maxAmount})`}
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className={`pl-8 h-12 text-base font-medium bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 focus:border-primary ${
                isCustom && selectedAmount === parseInt(customAmount)
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter any amount between ${minAmount} and ${maxAmount}
          </p>
        </div>
      )}

      {/* FIXED denomination notice */}
      {denominationType === "FIXED" && (
        <p className="text-xs text-muted-foreground">
          This gift card is only available in the preset amounts shown above.
        </p>
      )}
    </div>
  )
}
