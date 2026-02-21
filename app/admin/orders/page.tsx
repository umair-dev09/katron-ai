"use client"

import { useState } from "react"
import { AdminProtectedGuard } from "@/components/admin/admin-auth-guard"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ShoppingCart, 
  ArrowLeft, 
  Search, 
  Loader2,
  RefreshCw,
  XCircle,
  RotateCcw,
  Store,
  Hash,
  Mail,
  AlertTriangle,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface Order {
  id: number
  giftCardOrderId?: number
  productName?: string
  amount?: number
  status?: string
  createdAt?: string
  customerEmail?: string
  recipientEmail?: string
  cardNumber?: string
  cardPin?: string
  productId?: number
}

function OrdersPageContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()
  
  // Search states
  const [searchType, setSearchType] = useState<"user" | "merchant">("user")
  const [userId, setUserId] = useState("")
  const [merchantEmail, setMerchantEmail] = useState("")
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Order action dialog
  const [showOrderActionDialog, setShowOrderActionDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderAction, setOrderAction] = useState<"refund" | "void" | "refresh" | null>(null)
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false)

  const getAdminToken = () => {
    return localStorage.getItem("admin_auth_token")
  }

  const searchOrders = async () => {
    if (searchType === "user" && !userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive",
      })
      return
    }
    if (searchType === "merchant" && !merchantEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Merchant Email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setOrders([])
    setHasSearched(true)
    
    try {
      const token = getAdminToken()
      let url: string
      
      if (searchType === "user") {
        url = `/api/admin/users/orders?userId=${userId.trim()}`
      } else {
        url = `/api/admin/merchants/orders?merchantEmail=${encodeURIComponent(merchantEmail.trim())}`
      }
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      
      if (data.status === 200 && Array.isArray(data.data)) {
        setOrders(data.data)
        if (data.data.length === 0) {
          toast({
            title: "No Orders",
            description: `No orders found for this ${searchType}`,
          })
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderAction = async () => {
    if (!selectedOrder || !orderAction) return
    
    setIsProcessingOrderAction(true)
    try {
      const token = getAdminToken()
      const orderId = selectedOrder.giftCardOrderId || selectedOrder.id
      
      const response = await fetch("/api/admin/orders/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          giftCardOrderId: orderId,
          action: orderAction,
        }),
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
        // Refresh the search
        searchOrders()
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

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "SUCCESS":
        return "default"
      case "PENDING":
      case "PROCESSING":
        return "secondary"
      case "FAILED":
      case "CANCELLED":
      case "VOIDED":
        return "destructive"
      case "REFUNDED":
        return "outline"
      default:
        return "secondary"
    }
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

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Orders
              </h1>
              <p className="text-muted-foreground mt-1">
                Search and manage gift card orders
              </p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Orders
            </CardTitle>
            <CardDescription>
              Search orders by User ID or Merchant Email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "user" | "merchant")}>
              <TabsList className="mb-4">
                <TabsTrigger value="user" className="gap-2">
                  <User className="h-4 w-4" />
                  By User ID
                </TabsTrigger>
                <TabsTrigger value="merchant" className="gap-2">
                  <Store className="h-4 w-4" />
                  By Merchant Email
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="mt-0">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter User ID (e.g., 123)"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10"
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && searchOrders()}
                    />
                  </div>
                  <Button onClick={searchOrders} disabled={isLoading || !userId.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="merchant" className="mt-0">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter Merchant Email"
                      value={merchantEmail}
                      onChange={(e) => setMerchantEmail(e.target.value)}
                      className="pl-10"
                      type="email"
                      onKeyDown={(e) => e.key === "Enter" && searchOrders()}
                    />
                  </div>
                  <Button onClick={searchOrders} disabled={isLoading || !merchantEmail.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  To find a User ID or Merchant Email, visit the{" "}
                  <Link href="/admin/users" className="text-primary hover:underline">Users</Link> or{" "}
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
              Orders
              {orders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {orders.length} found
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {hasSearched 
                ? `Showing orders for ${searchType === "user" ? `User #${userId}` : merchantEmail}`
                : "Use the search above to find orders"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Enter a User ID or Merchant Email to search for orders</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No orders found</p>
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
                    {orders.map((order) => (
                      <TableRow key={order.id || order.giftCardOrderId}>
                        <TableCell>
                          <span className="font-mono font-medium">
                            #{order.giftCardOrderId || order.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.productName || "N/A"}</p>
                            {order.productId && (
                              <p className="text-xs text-muted-foreground">
                                ID: {order.productId}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.amount ? (
                            <span className="font-medium">${order.amount.toFixed(2)}</span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {order.recipientEmail || order.customerEmail || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderActionDialog(order, "refresh")}
                              title="Refresh Order Status"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderActionDialog(order, "refund")}
                              title="Refund Order"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderActionDialog(order, "void")}
                              title="Void Order"
                            >
                              <XCircle className="h-3.5 w-3.5" />
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
                  <span className="font-medium">{selectedOrder.productName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {selectedOrder.amount ? `$${selectedOrder.amount.toFixed(2)}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status || "Unknown"}
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

export default function OrdersPage() {
  return (
    <AdminProtectedGuard>
      <OrdersPageContent />
    </AdminProtectedGuard>
  )
}
