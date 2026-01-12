"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface AmountSelectorProps {
  selectedAmount: number | null
  onAmountChange: (amount: number) => void
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 150, 200, 250, 500]

export default function AmountSelector({ selectedAmount, onAmountChange }: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)

  const handlePresetClick = (amount: number) => {
    setIsCustom(false)
    setCustomAmount("")
    onAmountChange(amount)
  }

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "")
    setCustomAmount(numericValue)
    
    if (numericValue && parseInt(numericValue) >= 5 && parseInt(numericValue) <= 500) {
      setIsCustom(true)
      onAmountChange(parseInt(numericValue))
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PRESET_AMOUNTS.map((amount) => (
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

      {/* Custom Amount Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-semibold">
            $
          </span>
          <Input
            type="text"
            placeholder="Enter amount (5-500)"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="pl-8 h-12 text-base font-medium bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 focus:border-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">Enter any amount between $5 and $500</p>
      </div>
    </div>
  )
}
