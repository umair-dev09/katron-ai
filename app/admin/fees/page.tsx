"use client"

import { useEffect, useState } from "react"
import { AdminProtectedGuard } from "@/components/admin/admin-auth-guard"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield, LogOut, User, ArrowLeft, Loader2, DollarSign,
  Save, RefreshCw, CheckCircle, AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  getActiveFeePreference,
  setFeePreference,
  type GiftCardFeePreference,
} from "@/lib/api/admin"

type FeeType = "FEE_TYPE_USER" | "FEE_TYPE_MERCHANT" | "FEE_TYPE_MERCHANT_API"

const FEE_TYPES: { value: FeeType; label: string; description: string }[] = [
  { value: "FEE_TYPE_USER", label: "User Fees", description: "Fees charged to regular users" },
  { value: "FEE_TYPE_MERCHANT", label: "Merchant Fees", description: "Fees charged to merchants" },
  { value: "FEE_TYPE_MERCHANT_API", label: "Merchant API Fees", description: "Fees charged for API purchases" },
]

const DEFAULT_FEE: GiftCardFeePreference = {
  giftCardFeeType: "FEE_TYPE_USER",
  feeFor1To99: 0,
  feeFor100To250: 0,
  feeFor251To500: 0,
  feeFor501To750: 0,
  feeFor751To999: 0,
  feePercentageFor1000To5000: 0,
}

function FeesPageContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()

  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>("FEE_TYPE_USER")
  const [fees, setFees] = useState<Record<FeeType, GiftCardFeePreference>>({
    FEE_TYPE_USER: { ...DEFAULT_FEE, giftCardFeeType: "FEE_TYPE_USER" },
    FEE_TYPE_MERCHANT: { ...DEFAULT_FEE, giftCardFeeType: "FEE_TYPE_MERCHANT" },
    FEE_TYPE_MERCHANT_API: { ...DEFAULT_FEE, giftCardFeeType: "FEE_TYPE_MERCHANT_API" },
  })
  const [isLoading, setIsLoading] = useState<Record<FeeType, boolean>>({
    FEE_TYPE_USER: true,
    FEE_TYPE_MERCHANT: true,
    FEE_TYPE_MERCHANT_API: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [loadedTypes, setLoadedTypes] = useState<Set<FeeType>>(new Set())

  // Fetch all fee types on mount
  useEffect(() => {
    FEE_TYPES.forEach(({ value }) => fetchFees(value))
  }, [])

  const fetchFees = async (feeType: FeeType) => {
    setIsLoading(prev => ({ ...prev, [feeType]: true }))
    try {
      const result = await getActiveFeePreference(feeType)
      if (result.status === 200 && result.data) {
        setFees(prev => ({ ...prev, [feeType]: { ...DEFAULT_FEE, ...result.data, giftCardFeeType: feeType } }))
        setLoadedTypes(prev => new Set(prev).add(feeType))
      } else {
        setFees(prev => ({ ...prev, [feeType]: { ...DEFAULT_FEE, giftCardFeeType: feeType } }))
        setLoadedTypes(prev => new Set(prev).add(feeType))
      }
    } catch {
      toast({ title: "Warning", description: `Could not load ${feeType} fees`, variant: "destructive" })
    } finally {
      setIsLoading(prev => ({ ...prev, [feeType]: false }))
    }
  }

  const handleSave = async () => {
    const currentFee = fees[selectedFeeType]
    setIsSaving(true)
    try {
      const result = await setFeePreference(currentFee)
      if (result.status === 200) {
        toast({ title: "Success", description: "Fee preference saved successfully" })
      } else {
        toast({ title: "Error", description: result.message || "Failed to save fees", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to save fee preference", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const updateFeeField = (field: keyof GiftCardFeePreference, value: string) => {
    const numValue = parseFloat(value) || 0
    setFees(prev => ({
      ...prev,
      [selectedFeeType]: { ...prev[selectedFeeType], [field]: numValue },
    }))
  }

  const currentFee = fees[selectedFeeType]
  const currentLoading = isLoading[selectedFeeType]

  const handleLogout = () => {
    logout()
    router.push("/admin/auth")
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/katron-ai-logo-bg-transparent.png" alt="Katron AI" width={120} height={48} className="h-10 w-auto object-contain" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Admin Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{admin?.firstname} {admin?.lastname}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {admin?.accountType}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fee Structure</h1>
            <p className="text-muted-foreground mt-1">Configure processing fees for users, merchants, and API profiles</p>
          </div>
        </div>

        {/* Fee Type Tabs */}
        <Tabs value={selectedFeeType} onValueChange={(v) => setSelectedFeeType(v as FeeType)}>
          <TabsList className="mb-6 w-full grid grid-cols-3">
            {FEE_TYPES.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="gap-2">
                {loadedTypes.has(value) ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                ) : isLoading[value] ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {FEE_TYPES.map(({ value, label, description }) => (
            <TabsContent key={value} value={value}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    {label}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Fixed Fee Ranges */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Fixed Fees (USD)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FeeInput
                            label="$1 – $99"
                            value={currentFee.feeFor1To99}
                            onChange={(v) => updateFeeField("feeFor1To99", v)}
                            prefix="$"
                          />
                          <FeeInput
                            label="$100 – $250"
                            value={currentFee.feeFor100To250}
                            onChange={(v) => updateFeeField("feeFor100To250", v)}
                            prefix="$"
                          />
                          <FeeInput
                            label="$251 – $500"
                            value={currentFee.feeFor251To500}
                            onChange={(v) => updateFeeField("feeFor251To500", v)}
                            prefix="$"
                          />
                          <FeeInput
                            label="$501 – $750"
                            value={currentFee.feeFor501To750}
                            onChange={(v) => updateFeeField("feeFor501To750", v)}
                            prefix="$"
                          />
                          <FeeInput
                            label="$751 – $999"
                            value={currentFee.feeFor751To999}
                            onChange={(v) => updateFeeField("feeFor751To999", v)}
                            prefix="$"
                          />
                        </div>
                      </div>

                      {/* Percentage Fee */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Percentage Fee</h3>
                        <div className="max-w-xs">
                          <FeeInput
                            label="$1,000 – $5,000"
                            value={currentFee.feePercentageFor1000To5000}
                            onChange={(v) => updateFeeField("feePercentageFor1000To5000", v)}
                            suffix="%"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                          {isSaving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                          ) : (
                            <><Save className="h-4 w-4" /> Save Fees</>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fetchFees(selectedFeeType)}
                          disabled={currentLoading}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" /> Reload
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

function FeeInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string
  value?: number
  onChange: (v: string) => void
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{prefix}</span>
        )}
        <Input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(e.target.value)}
          min="0"
          step="0.01"
          className={`${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{suffix}</span>
        )}
      </div>
    </div>
  )
}

export default function FeesPage() {
  return (
    <AdminProtectedGuard>
      <FeesPageContent />
    </AdminProtectedGuard>
  )
}
