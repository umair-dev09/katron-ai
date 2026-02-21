"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  getMerchantAccountDetails,
  createMerchantApiProfile,
  reissueApiToken,
  getMerchantFeePreference,
  type MerchantApiProfile,
  type FeePreference,
  type ChargeType,
} from "@/lib/api/merchant"
import { AuthApiError } from "@/lib/api/auth"
import { toast } from "sonner"
import {
  Key,
  Shield,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  CreditCard,
  Wallet,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Zap,
  Code2,
  Globe,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type PageState = "loading" | "no-profile" | "has-profile" | "error"

const PROFILE_STORAGE_KEY = "merchant_api_profile"

function getStorageKey(userId?: number) {
  return userId ? `${PROFILE_STORAGE_KEY}_${userId}` : PROFILE_STORAGE_KEY
}

function saveProfileLocally(profile: MerchantApiProfile, userId?: number) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(profile))
  } catch {}
}

function loadProfileLocally(userId?: number): MerchantApiProfile | null {
  try {
    const stored = localStorage.getItem(getStorageKey(userId))
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function clearProfileLocally(userId?: number) {
  try {
    localStorage.removeItem(getStorageKey(userId))
  } catch {}
}

export default function MerchantApiPageContent() {
  const router = useRouter()
  const { user } = useAuth()

  const [pageState, setPageState] = useState<PageState>("loading")
  const [profile, setProfile] = useState<MerchantApiProfile | null>(null)
  const [feePreference, setFeePreference] = useState<FeePreference | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [selectedChargeType, setSelectedChargeType] = useState<ChargeType>("CHARGE_CARD")
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Redirect non-merchant users
  useEffect(() => {
    if (user && user.accountType !== "MERCHANT") {
      toast.error("Only merchant accounts can access API profiles")
      router.replace("/buy")
    }
  }, [user, router])

  const fetchProfile = useCallback(async (userId?: number) => {
    try {
      setPageState("loading")

      // First check localStorage for a saved profile
      const cached = loadProfileLocally(userId)
      if (cached) {
        setProfile(cached)
        setSelectedChargeType(cached.chargeType || "CHARGE_CARD")
        setPageState("has-profile")
        // Still try the API in the background to refresh
        try {
          const apiResponse = await getMerchantAccountDetails()
          if (apiResponse.status === 200 && apiResponse.data) {
            const merged = { ...cached, ...apiResponse.data }
            setProfile(merged)
            setSelectedChargeType(merged.chargeType || "CHARGE_CARD")
            saveProfileLocally(merged, userId)
          }
        } catch {
          // Silently ignore — we already have cached data to show
        }
        // Also fetch fee preference
        try {
          const feeResponse = await getMerchantFeePreference()
          if (feeResponse.status === 200 && feeResponse.data) {
            setFeePreference(feeResponse.data)
          }
        } catch {}
        return
      }

      // No cache — try the API
      const response = await getMerchantAccountDetails()
      if (response.status === 200 && response.data) {
        setProfile(response.data)
        setSelectedChargeType(response.data.chargeType || "CHARGE_CARD")
        saveProfileLocally(response.data, userId)
        setPageState("has-profile")
        try {
          const feeResponse = await getMerchantFeePreference()
          if (feeResponse.status === 200 && feeResponse.data) {
            setFeePreference(feeResponse.data)
          }
        } catch {}
      } else {
        setPageState("no-profile")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load profile"
      const lowerMessage = message.toLowerCase()
      const errorStatus = error instanceof AuthApiError ? error.status : 0
      // Treat 400/403 or access-denied messages as "no profile created yet"
      if (
        errorStatus === 400 ||
        errorStatus === 403 ||
        lowerMessage.includes("not found") ||
        lowerMessage.includes("no merchant") ||
        lowerMessage.includes("not exist") ||
        lowerMessage.includes("create") ||
        lowerMessage.includes("access denied") ||
        lowerMessage.includes("denied") ||
        lowerMessage.includes("not authorized") ||
        lowerMessage.includes("no api profile") ||
        lowerMessage.includes("profile not")
      ) {
        setPageState("no-profile")
      } else {
        setErrorMessage(message)
        setPageState("error")
      }
    }
  }, [])

  useEffect(() => {
    if (user?.accountType === "MERCHANT") {
      fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  const handleCreateProfile = async () => {
    setIsCreating(true)
    try {
      const response = await createMerchantApiProfile(selectedChargeType)
      if (response.status === 200) {
        // Backend may return full profile data or just a message
        const profileData: MerchantApiProfile = response.data
          ? { ...response.data, chargeType: response.data.chargeType || selectedChargeType, active: true }
          : { chargeType: selectedChargeType, active: true }
        setProfile(profileData)
        setSelectedChargeType(selectedChargeType)
        saveProfileLocally(profileData, user?.id)
        setPageState("has-profile")
        toast.success(response.message || "API profile created! Your API key has been sent to your email.")
        setShowCreateDialog(false)
      } else {
        toast.error(response.message || "Failed to create API profile")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create API profile"
      const lower = message.toLowerCase()
      // If profile already exists, show it (check email for key)
      if (lower.includes("already") || lower.includes("exists") || lower.includes("duplicate")) {
        const profileData: MerchantApiProfile = { chargeType: selectedChargeType, active: true }
        setProfile(profileData)
        saveProfileLocally(profileData, user?.id)
        setPageState("has-profile")
        setShowCreateDialog(false)
        toast.info("You already have an API profile. Check your email for your API key, or regenerate it below.")
      } else {
        toast.error(message)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleRegenerateToken = async () => {
    setIsRegenerating(true)
    try {
      const response = await reissueApiToken()
      if (response.status === 200) {
        const updated = profile
          ? { ...profile, ...(response.data || {}), active: true }
          : { ...(response.data || {}), chargeType: selectedChargeType, active: true }
        setProfile(updated)
        saveProfileLocally(updated, user?.id)
        toast.success(response.message || "API key regenerated! Your new key has been sent to your email.")
        setShowApiKey(true)
        setShowRegenerateDialog(false)
      } else {
        toast.error(response.message || "Failed to regenerate API key")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to regenerate API key"
      toast.error(message)
    } finally {
      setIsRegenerating(false)
    }
  }



  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied to clipboard`),
      () => toast.error("Failed to copy to clipboard")
    )
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return "••••••••••••"
    return key.substring(0, 6) + "••••••••••••••••" + key.substring(key.length - 6)
  }

  const apiKeyValue = profile?.token || profile?.apiKey || ""

  if (user?.accountType !== "MERCHANT") {
    return null
  }

  return (
    <main className="min-h-screen bg-background pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">API Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your merchant API keys and integration settings
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {pageState === "loading" && <LoadingSkeleton />}

        {/* Error State */}
        {pageState === "error" && (
          <Card className="border-red-200 dark:border-red-800/50">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Failed to Load Profile</h3>
                <p className="text-sm text-muted-foreground max-w-sm">{errorMessage}</p>
              </div>
              <Button onClick={() => fetchProfile(user?.id)} variant="outline" className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Profile - Create New */}
        {pageState === "no-profile" && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Code2 className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-xl font-semibold text-foreground">Create Your API Profile</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set up your merchant API profile to integrate gift card purchasing directly into your 
                  applications. Get access to your unique API key and start automating gift card operations.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-2">
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                  <Globe className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">REST API Access</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                  <Lock className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">Secure Bearer Auth</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                  <Zap className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">Instant Setup</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-4 px-8 h-12 text-base font-semibold"
                onClick={() => setShowCreateDialog(true)}
              >
                <Key className="w-5 h-5 mr-2" />
                Create API Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Dashboard */}
        {pageState === "has-profile" && profile && (
          <div className="space-y-6">
            {/* Status Banner */}
            <Card className={profile.active !== false 
              ? "border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/10" 
              : "border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/10"
            }>
              <CardContent className="flex items-center gap-4 py-4">
                {profile.active !== false ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {profile.active !== false ? "Your API profile is active and ready to use" : "Your API profile is currently inactive"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {profile.active !== false 
                      ? "You can use your API key to make authenticated requests" 
                      : "Contact support to reactivate your API profile"}
                  </p>
                </div>
                <Badge variant={profile.active !== false ? "default" : "secondary"} className={
                  profile.active !== false 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" 
                    : ""
                }>
                  {profile.active !== false ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>

            {/* API Key Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Key</CardTitle>
                    <CardDescription>Your secret key for authenticating API requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeyValue ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-muted/70 rounded-lg border border-border font-mono text-sm overflow-hidden">
                        <code className="flex-1 truncate select-all">
                          {showApiKey ? apiKeyValue : maskApiKey(apiKeyValue)}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 h-[46px] w-[46px]"
                        onClick={() => setShowApiKey(!showApiKey)}
                        title={showApiKey ? "Hide API key" : "Show API key"}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 h-[46px] w-[46px]"
                        onClick={() => copyToClipboard(apiKeyValue, "API key")}
                        title="Copy API key"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        Keep your API key secret. Do not share it in public repositories, client-side code, 
                        or any insecure location. If compromised, regenerate it immediately.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 w-full">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        Your API key was sent to your registered email address. Check your inbox and use
                        it as the Bearer token in your API requests. You can regenerate a new key below if needed.
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Regenerate API Key</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This will invalidate your current key and generate a new one
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowRegenerateDialog(true)}
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                    <CardDescription>Charge type configured at profile creation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                  selectedChargeType === "CHARGE_CARD"
                    ? "border-primary bg-primary/5"
                    : "border-primary bg-primary/5"
                }`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    {selectedChargeType === "CHARGE_CARD"
                      ? <CreditCard className="w-5 h-5 text-primary" />
                      : <Wallet className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {selectedChargeType === "CHARGE_CARD" ? "Charge Card" : "Account Balance"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedChargeType === "CHARGE_CARD"
                        ? "Purchases are charged directly to your card on file"
                        : "Purchases are deducted from your account balance"}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment method is set at profile creation. To change it, contact support or recreate your API profile.
                </p>

                {/* Account Balance Display */}
                {profile.balance !== undefined && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Account Balance</p>
                          <p className="text-xs text-muted-foreground">Available funds for API purchases</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        ${typeof profile.balance === "number" ? profile.balance.toFixed(2) : "0.00"}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Fee Schedule */}
            {feePreference && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Fee Schedule</CardTitle>
                      <CardDescription>Transaction fees applied to API purchases</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {feePreference.feeFor1To99 !== undefined && (
                      <FeeItem label="$1 – $99" value={`$${feePreference.feeFor1To99}`} />
                    )}
                    {feePreference.feeFor100To250 !== undefined && (
                      <FeeItem label="$100 – $250" value={`$${feePreference.feeFor100To250}`} />
                    )}
                    {feePreference.feeFor251To500 !== undefined && (
                      <FeeItem label="$251 – $500" value={`$${feePreference.feeFor251To500}`} />
                    )}
                    {feePreference.feeFor501To750 !== undefined && (
                      <FeeItem label="$501 – $750" value={`$${feePreference.feeFor501To750}`} />
                    )}
                    {feePreference.feeFor751To999 !== undefined && (
                      <FeeItem label="$751 – $999" value={`$${feePreference.feeFor751To999}`} />
                    )}
                    {feePreference.feePercentageFor1000To5000 !== undefined && (
                      <FeeItem label="$1,000 – $5,000" value={`${feePreference.feePercentageFor1000To5000}%`} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Start Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quick Start</CardTitle>
                    <CardDescription>Use your API key to authenticate requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Authentication</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Include your API key in the Authorization header of every request:
                  </p>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-slate-950 dark:bg-slate-900 text-slate-50 text-sm font-mono overflow-x-auto">
                      <code>{`curl -X GET \\
  "https://api.ktngiftcard.katronai.com/katron-gift-card/api/merchant/giftCard/listGiftCards" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      onClick={() =>
                        copyToClipboard(
                          `curl -X GET \\\n  "https://api.ktngiftcard.katronai.com/katron-gift-card/api/merchant/giftCard/listGiftCards" \\\n  -H "Authorization: Bearer ${apiKeyValue || "YOUR_API_KEY"}" \\\n  -H "Content-Type: application/json"`,
                          "cURL command"
                        )
                      }
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Available Endpoints</p>
                  <div className="space-y-2">
                    <EndpointItem method="GET" path="/api/merchant/giftCard/listGiftCards" description="List all available gift cards" />
                    <EndpointItem method="POST" path="/api/merchant/giftCard/purchaseGiftCard" description="Purchase a gift card" />
                    <EndpointItem method="GET" path="/api/merchant/giftCard/listAllGiftCardOrders" description="List all gift card orders" />
                    <EndpointItem method="GET" path="/api/merchant/giftCard/getGiftCardCredentials" description="Get gift card credentials" />
                    <EndpointItem method="GET" path="/api/merchant/getAccountDetails" description="Get account details" />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Base URL: <code className="font-mono font-semibold">https://api.ktngiftcard.katronai.com/katron-gift-card</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Profile Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Create API Profile
            </DialogTitle>
            <DialogDescription>
              Choose how you want to be charged for gift card purchases made through the API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Payment Method</label>
              <Select
                value={selectedChargeType}
                onValueChange={(value) => setSelectedChargeType(value as ChargeType)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHARGE_CARD">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Charge Card</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CHARGE_ACCOUNT_BALANCE">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>Account Balance</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {selectedChargeType === "CHARGE_CARD"
                  ? "Purchases will be charged directly to your card on file."
                  : "Purchases will be deducted from your account balance."}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Create Profile
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Token Confirmation Dialog */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Regenerate API Key
            </DialogTitle>
            <DialogDescription>
              This action will immediately invalidate your current API key. Any applications or 
              services using the old key will stop working until updated with the new key.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 my-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              Make sure to update your API key in all integrations immediately after regeneration.
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRegenerateDialog(false)} disabled={isRegenerating}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenerateToken}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Key
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

// Sub-components

function FeeItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

function EndpointItem({ method, path, description }: { method: string; path: string; description: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
      <Badge
        variant="secondary"
        className={`font-mono text-[10px] min-w-[42px] justify-center ${
          method === "GET"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        }`}
      >
        {method}
      </Badge>
      <code className="text-xs font-mono text-foreground truncate flex-1">{path}</code>
      <span className="text-xs text-muted-foreground hidden sm:block">{description}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
