"use client"

import { useEffect, useState } from "react"
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
  Shield, 
  LogOut, 
  User, 
  Store, 
  ArrowLeft, 
  Search, 
  Loader2,
  Power,
  PowerOff,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  XCircle,
  RotateCcw,
  Eye,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

interface Merchant {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  accountType: string
  emailVerified: boolean
  phoneVerified: boolean
  profilePhoto?: string
  createdAt?: string
}

interface Order {
  id: number
  giftCardOrderId?: number
  productName?: string
  amount?: number
  status?: string
  createdAt?: string
  customerEmail?: string
  cardNumber?: string
  cardPin?: string
}

function MerchantsPageContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()
  
  // State
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selected merchant for actions
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  
  // Dialog states
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)
  const [showOrdersDialog, setShowOrdersDialog] = useState(false)
  const [showOrderActionDialog, setShowOrderActionDialog] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState("")
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderAction, setOrderAction] = useState<"refund" | "void" | "refresh" | null>(null)
  
  // Action loading states
  const [isToggling, setIsToggling] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false)

  // Fetch merchants on mount
  useEffect(() => {
    fetchMerchants()
  }, [])

  // Filter merchants on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMerchants(merchants)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredMerchants(
        merchants.filter(
          (m) =>
            m.firstname.toLowerCase().includes(query) ||
            m.lastname.toLowerCase().includes(query) ||
            m.email.toLowerCase().includes(query) ||
            m.phone?.includes(query)
        )
      )
    }
  }, [searchQuery, merchants])

  const getAdminToken = () => {
    return localStorage.getItem("admin_auth_token")
  }

  const fetchMerchants = async () => {
    setIsLoading(true)
    try {
      const token = getAdminToken()
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=MERCHANT`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.status === 200 && Array.isArray(data.data)) {
        setMerchants(data.data)
        setFilteredMerchants(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch merchants",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch merchants:", error)
      toast({
        title: "Error",
        description: "Failed to fetch merchants",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (merchant: Merchant, activate: boolean) => {
    setIsToggling(merchant.id)
    try {
      const token = getAdminToken()
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/activateOrDeactivateMerchantApiProfile?email=${encodeURIComponent(merchant.email)}&activate=${activate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.status === 200) {
        toast({
          title: "Success",
          description: `Merchant ${activate ? "activated" : "deactivated"} successfully`,
        })
        fetchMerchants() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update merchant status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to toggle merchant status:", error)
      toast({
        title: "Error",
        description: "Failed to update merchant status",
        variant: "destructive",
      })
    } finally {
      setIsToggling(null)
    }
  }

  const handleLoadBalance = async () => {
    if (!selectedMerchant || !balanceAmount) return
    
    setIsLoadingBalance(true)
    try {
      const token = getAdminToken()
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/external/giftCard/loadBalance?email=${encodeURIComponent(selectedMerchant.email)}&balance=${parseFloat(balanceAmount)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.status === 200) {
        toast({
          title: "Success",
          description: `$${balanceAmount} loaded to ${selectedMerchant.email}`,
        })
        setShowBalanceDialog(false)
        setBalanceAmount("")
        setSelectedMerchant(null)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load balance",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to load balance:", error)
      toast({
        title: "Error",
        description: "Failed to load balance",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const fetchMerchantOrders = async (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setShowOrdersDialog(true)
    setIsLoadingOrders(true)
    setOrders([])
    
    try {
      const token = getAdminToken()
      // Try both endpoints - by user ID and by merchant email
      const [ordersById, ordersByEmail] = await Promise.all([
        fetch(`${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfUserAndMerchant?userId=${merchant.id}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }).then(r => r.json()).catch(() => null),
        fetch(`${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfMerchantProfileApi?merchantEmail=${encodeURIComponent(merchant.email)}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }).then(r => r.json()).catch(() => null),
      ])
      
      let allOrders: Order[] = []
      
      if (ordersById?.status === 200 && Array.isArray(ordersById.data)) {
        allOrders = [...ordersById.data]
      }
      if (ordersByEmail?.status === 200 && Array.isArray(ordersByEmail.data)) {
        // Merge unique orders
        const existingIds = new Set(allOrders.map(o => o.id || o.giftCardOrderId))
        ordersByEmail.data.forEach((order: Order) => {
          const orderId = order.id || order.giftCardOrderId
          if (orderId && !existingIds.has(orderId)) {
            allOrders.push(order)
          }
        })
      }
      
      setOrders(allOrders)
    } catch (error) {
      console.error("Failed to fetch merchant orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleOrderAction = async () => {
    if (!selectedOrder || !orderAction) return
    
    setIsProcessingOrderAction(true)
    try {
      const token = getAdminToken()
      const orderId = selectedOrder.giftCardOrderId || selectedOrder.id
      
      const actionEndpoints: Record<string, string> = {
          refund: "refundOrderPayment",
          void: "voidOrderPayment",
          refresh: "refreshOrder",
        }
      const endpointName = actionEndpoints[orderAction]
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/giftCard/${endpointName}?giftCardOrderId=${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.status === 200) {
        toast({
          title: "Success",
          description: `Order ${orderAction} completed successfully`,
        })
        setShowOrderActionDialog(false)
        setSelectedOrder(null)
        setOrderAction(null)
        // Refresh orders
        if (selectedMerchant) {
          fetchMerchantOrders(selectedMerchant)
        }
      } else {
        toast({
          title: "Error",
          description: data.message || `Failed to ${orderAction} order`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to perform order action:", error)
      toast({
        title: "Error",
        description: `Failed to ${orderAction} order`,
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrderAction(false)
    }
  }

  const openOrderActionDialog = (order: Order, action: "refund" | "void" | "refresh") => {
    setSelectedOrder(order)
    setOrderAction(action)
    setShowOrderActionDialog(true)
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
            <Image
              src="/katron-ai-logo-bg-transparent.png"
              alt="Katron AI"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Merchants
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredMerchants.length} merchant{filteredMerchants.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Merchants Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              All Merchants
            </CardTitle>
            <CardDescription>
              Manage merchant accounts, load balance, and view orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMerchants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? "No merchants match your search" : "No merchants found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {merchant.profilePhoto ? (
                                <Image
                                  src={merchant.profilePhoto}
                                  alt={merchant.firstname}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <Store className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {merchant.firstname} {merchant.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ID: {merchant.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{merchant.email}</span>
                            </div>
                            {merchant.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{merchant.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={merchant.emailVerified ? "default" : "secondary"} className="w-fit">
                              {merchant.emailVerified ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              Email {merchant.emailVerified ? "Verified" : "Not Verified"}
                            </Badge>
                            <Badge variant={merchant.phoneVerified ? "default" : "secondary"} className="w-fit">
                              {merchant.phoneVerified ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              Phone {merchant.phoneVerified ? "Verified" : "Not Verified"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchMerchantOrders(merchant)}
                              title="View Orders"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMerchant(merchant)
                                setShowBalanceDialog(true)
                              }}
                              title="Load Balance"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(merchant, true)}
                              disabled={isToggling === merchant.id}
                              title="Activate"
                            >
                              {isToggling === merchant.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Power className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(merchant, false)}
                              disabled={isToggling === merchant.id}
                              title="Deactivate"
                            >
                              {isToggling === merchant.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <PowerOff className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
            <DialogDescription>
              Add funds to {selectedMerchant?.email}
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLoadBalance}
              disabled={!balanceAmount || parseFloat(balanceAmount) <= 0 || isLoadingBalance}
            >
              {isLoadingBalance ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Load ${balanceAmount || "0"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Orders Dialog */}
      <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Orders for {selectedMerchant?.firstname} {selectedMerchant?.lastname}
            </DialogTitle>
            <DialogDescription>
              {selectedMerchant?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No orders found for this merchant
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id || order.giftCardOrderId}>
                      <TableCell className="font-mono">
                        #{order.giftCardOrderId || order.id}
                      </TableCell>
                      <TableCell>{order.productName || "N/A"}</TableCell>
                      <TableCell>
                        {order.amount ? `$${order.amount.toFixed(2)}` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
                          {order.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOrderActionDialog(order, "refresh")}
                            title="Refresh Order"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOrderActionDialog(order, "refund")}
                            title="Refund"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOrderActionDialog(order, "void")}
                            title="Void"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
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
          <div className="py-4 text-sm text-muted-foreground">
            {orderAction === "refund" && (
              <p>This will refund the payment for this order.</p>
            )}
            {orderAction === "void" && (
              <p>This will void the payment and cancel the order.</p>
            )}
            {orderAction === "refresh" && (
              <p>This will refresh the order status from the payment provider.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderActionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleOrderAction}
              disabled={isProcessingOrderAction}
              variant={orderAction === "void" ? "destructive" : "default"}
            >
              {isProcessingOrderAction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
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

export default function MerchantsPage() {
  return (
    <AdminProtectedGuard>
      <MerchantsPageContent />
    </AdminProtectedGuard>
  )
}
