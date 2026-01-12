"use client"

import { Button } from "@/components/ui/button"

interface UserTypeSelectionProps {
  onSelect: (type: "merchant" | "user") => void
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Welcome to Katron AI</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Choose your account type to get started with our platform
        </p>
      </div>

      <div className="space-y-3 pt-3">
        <Button
          onClick={() => onSelect("merchant")}
          className="w-full h-11 md:h-12 text-sm md:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          Continue as Merchant
        </Button>

        <Button
          onClick={() => onSelect("user")}
          variant="outline"
          className="w-full h-11 md:h-12 text-sm md:text-base font-semibold rounded-lg border border-primary/40 text-primary hover:bg-primary/5 transition-all duration-200"
        >
          Continue as User
        </Button>
      </div>
    </div>
  )
}
