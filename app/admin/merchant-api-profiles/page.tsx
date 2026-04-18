"use client"

import { useState } from "react"
import { AdminProtectedGuard } from "@/components/admin/admin-auth-guard"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield, LogOut, User, ArrowLeft, Loader2, Key,
  Power, PowerOff, DollarSign, ShoppingCart,
  RefreshCw, XCircle, RotateCcw, Mail,
  AlertTriangle, Info, Search,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  activateOrDeactivateMerchantApiProfile,
  loadBalance,
  listOrdersOfMerchantProfileApi,
  adminRefundOrder,
  adminVoidOrder,
  adminRefreshOrder,
  type AdminOrder,
} from "@/lib/api/admin"

interface MerchantApiAction {
  type: "activate" | "deactivate" | "loadBalance" | "viewOrders"
  email: string
}

function MerchantApiProfilesContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()

  // Search
  const [merchantEmail, setMerchantEmail] = useState("")

  // Orders state
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedEmail, setSearchedEmail] = useState("")

  // Action states
  const [isTogglingProfile, setIsTogglingProfile] = useState(false)
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState("")
  const [balanceEmail, setBalanceEmail] = useState("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Order action dialog
  const [showOrderActionDialog, setShowOrderActionDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [orderAction, setOrderAction] = useState<"refund" | "void" | "refresh" | null>(null)
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false)

  const searchOrders = async () => {
    if (!merchantEmail.trim()) {
      toast({ title: "Error", description: "Please enter a merchant email", variant: "destructive" })
      return
    }

    setIsLoadingOrders(true)
    setOrders([])
    setHasSearched(true)
    setSearchedEmail(merchantEmail.trim())

    try {
      const result = await listOrdersOfMerchantProfileApi(merchantEmail.trim())
      if (result.status === 200 && Array.isArray(result.data)) {
        setOrders(result.data)
        if (result.data.length === 0) {
          toast({ title: "Info", description: "No orders found for this merchant API profile" })
        }
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch orders", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleToggleProfile = async (activate: boolean) => {
    if (!merchantEmail.trim()) {
      toast({ title: "Error", description: "Please enter a merchant email", variant: "destructive" })
      return
    }

    setIsTogglingProfile(true)
    try {
      const result = await activateOrDeactivateMerchantApiProfile(merchantEmail.trim(), activate)
      if (result.status === 200) {
        toast({ title: "Success", description: `Merchant API profile ${activate ? "activated" : "deactivated"} successfully` })
      } else {
        toast({ title: "Error", description: result.message || "Failed to update profile", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update profile status", variant: "destructive" })
    } finally {
      setIsTogglingProfile(false)
    }
  }

  const handleLoadBalance = async () => {
    if (!balanceEmail || !balanceAmount) return

    setIsLoadingBalance(true)
    try {
      const result = await loadBalance(balanceEmail, parseFloat(balanceAmount))
      if (result.status === 200) {
        toast({ title: "Success", description: `$${balanceAmount} loaded to ${balanceEmail}` })
        setShowBalanceDialog(false)
        setBalanceAmount("")
      } else {
        toast({ title: "Error", description: result.message || "Failed to load balance", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to load balance", variant: "destructive" })
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleOrderAction = async () => {
    if (!selectedOrder || !orderAction) return

    setIsProcessingOrderAction(true)
    try {
      const orderId = selectedOrder.giftCardOrderId || selectedOrder.id
      let result

      switch (orderAction) {
        case "refund":
          result = await adminRefundOrder(orderId)
          break
        case "void":
          result = await adminVoidOrder(orderId)
          break
        case "refresh":
          result = await adminRefreshOrder(orderId)
          break
      }

      if (result?.status === 200) {
        toast({ title: "Success", description: `Order ${orderAction} completed successfully` })
        setShowOrderActionDialog(false)
        setSelectedOrder(null)
        setOrderAction(null)
        // Refresh the orders
        if (searchedEmail) {
          const refreshResult = await listOrdersOfMerchantProfileApi(searchedEmail)
          if (refreshResult.status === 200 && Array.isArray(refreshResult.data)) {
            setOrders(refreshResult.data)
          }
        }
      } else {
        toast({ title: "Error", description: result?.message || `Failed to ${orderAction} order`, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: `Failed to ${orderAction} order`, variant: "destructive" })
    } finally {
      setIsProcessingOrderAction(false)
    }
  }

  const isPaymentSuccessful = (order: AdminOrder): boolean => {
    const status = (order.status || order.paymentStatus || order.orderStatus || "").toUpperCase()
    return ["SUCCESS", "SUCCESSFUL", "COMPLETED", "PAYMENT_COMPLETED", "PAID"].includes(status)
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED": case "SUCCESS": case "SUCCESSFUL": case "PAID": case "PAYMENT_COMPLETED":
        return "default"
      case "PENDING": case "PROCESSING": case "PAYMENT_PENDING":
        return "secondary"
      case "FAILED": case "CANCELLED": case "VOIDED":
        return "destructive"
      case "REFUNDED":
        return "outline"
      default:
        return "secondary"
    }
  }

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

      <main className="container mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Merchant API Profiles</h1>
            <p className="text-muted-foreground mt-1">Manage merchant API profiles, balance, and orders</p>
          </div>
        </div>

        {/* Search & Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Merchant API Profile Actions
            </CardTitle>
            <CardDescription>Enter a merchant email to manage their API profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter merchant email address..."
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  className="pl-10"
                  type="email"
                  onKeyDown={(e) => e.key === "Enter" && searchOrders()}
                />
              </div>
              <Button onClick={searchOrders} disabled={isLoadingOrders || !merchantEmail.trim()}>
                {isLoadingOrders ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Searching...</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" /> Search Orders</>
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleProfile(true)}
                disabled={isTogglingProfile || !merchantEmail.trim()}
                className="gap-2"
              >
                {isTogglingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4 text-green-600" />}
                Activate Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleProfile(false)}
                disabled={isTogglingProfile || !merchantEmail.trim()}
                className="gap-2"
              >
                {isTogglingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4 text-red-600" />}
                Deactivate Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBalanceEmail(merchantEmail.trim())
                  setShowBalanceDialog(true)
                }}
                disabled={!merchantEmail.trim()}
                className="gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Load Balance
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  These actions apply specifically to the merchant&apos;s API profile (used for programmatic gift card purchases).
                  To manage the merchant account itself, visit the{" "}
                  <Link href="/admin/merchants" className="text-primary hover:underline">Merchants</Link> page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              API Profile Orders
              {orders.length > 0 && (
                <Badge variant="secondary" className="ml-2">{orders.length} found</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {hasSearched ? `Orders for API profile: ${searchedEmail}` : "Search by merchant email to view API profile orders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-12 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Enter a merchant email to search for API profile orders</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No API profile orders found for {searchedEmail}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const paymentOk = isPaymentSuccessful(order)
                      return (
                        <TableRow key={order.id || order.giftCardOrderId}>
                          <TableCell>
                            <span className="font-mono font-medium">#{order.giftCardOrderId || order.id}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.productName || order.brandName || "N/A"}</p>
                              {order.productId && <p className="text-xs text-muted-foreground">ID: {order.productId}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(order.totalAmount || order.amount) ? (
                              <span className="font-medium">${(order.totalAmount || order.amount || 0).toFixed(2)}</span>
                            ) : "N/A"}
                          </TableCell>
                          <TableCell>
                            {order.recipientEmail || order.customerEmail || order.email || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(order.status || order.paymentStatus || order.orderStatus)}>
                              {order.status || order.paymentStatus || order.orderStatus || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setOrderAction("refresh")
                                  setShowOrderActionDialog(true)
                                }}
                                title="Refresh Order Status"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                              {paymentOk && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setOrderAction("refund")
                                    setShowOrderActionDialog(true)
                                  }}
                                  title="Refund Order"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {paymentOk && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setOrderAction("void")
                                    setShowOrderActionDialog(true)
                                  }}
                                  title="Void Order"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Load Balance Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Load Balance
            </DialogTitle>
            <DialogDescription>Add funds to {balanceEmail}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
            <Input
              type="number"
              placeholder="Enter amount..."
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>Cancel</Button>
            <Button
              onClick={handleLoadBalance}
              disabled={!balanceAmount || parseFloat(balanceAmount) <= 0 || isLoadingBalance}
            >
              {isLoadingBalance ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
              ) : (
                <><DollarSign className="h-4 w-4 mr-2" /> Load ${balanceAmount || "0"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Action Confirmation Dialog */}
      <Dialog open={showOrderActionDialog} onOpenChange={setShowOrderActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {orderAction === "refund" && <RotateCcw className="h-5 w-5 text-orange-500" />}
              {orderAction === "void" && <XCircle className="h-5 w-5 text-red-500" />}
              {orderAction === "refresh" && <RefreshCw className="h-5 w-5 text-blue-500" />}
              Confirm {orderAction?.charAt(0).toUpperCase()}{orderAction?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {orderAction} order #{selectedOrder?.giftCardOrderId || selectedOrder?.id}?
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4 space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium">{selectedOrder.productName || selectedOrder.brandName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {(selectedOrder.totalAmount || selectedOrder.amount) ? `$${(selectedOrder.totalAmount || selectedOrder.amount || 0).toFixed(2)}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(selectedOrder.status || selectedOrder.paymentStatus)}>
                    {selectedOrder.status || selectedOrder.paymentStatus || "Unknown"}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {orderAction === "refund" && (
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                    This will refund the payment for this order. This action may not be reversible.
                  </p>
                )}
                {orderAction === "void" && (
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    This will void the payment and cancel the order. This action cannot be undone.
                  </p>
                )}
                {orderAction === "refresh" && (
                  <p className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                    This will refresh the order status from the payment provider.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderActionDialog(false)}>Cancel</Button>
            <Button
              onClick={handleOrderAction}
              disabled={isProcessingOrderAction}
              variant={orderAction === "void" ? "destructive" : "default"}
            >
              {isProcessingOrderAction ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <>Confirm {orderAction?.charAt(0).toUpperCase()}{orderAction?.slice(1)}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function MerchantApiProfilesPage() {
  return (
    <AdminProtectedGuard>
      <MerchantApiProfilesContent />
    </AdminProtectedGuard>
  )
}
