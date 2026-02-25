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
  Users, 
  ArrowLeft, 
  Search, 
  Loader2,
  ShoppingCart,
  RefreshCw,
  XCircle,
  RotateCcw,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

interface UserAccount {
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

function UsersPageContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()
  
  // State
  const [users, setUsers] = useState<UserAccount[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selected user for actions
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null)
  
  // Dialog states
  const [showOrdersDialog, setShowOrdersDialog] = useState(false)
  const [showOrderActionDialog, setShowOrderActionDialog] = useState(false)
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderAction, setOrderAction] = useState<"refund" | "void" | "refresh" | null>(null)
  
  // Action loading states
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.firstname.toLowerCase().includes(query) ||
            u.lastname.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.phone?.includes(query)
        )
      )
    }
  }, [searchQuery, users])

  const getAdminToken = () => {
    return localStorage.getItem("admin_auth_token")
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = getAdminToken()
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/getAllUsers?accountType=USER`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.status === 200 && Array.isArray(data.data)) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserOrders = async (user: UserAccount) => {
    setSelectedUser(user)
    setShowOrdersDialog(true)
    setIsLoadingOrders(true)
    setOrders([])
    
    try {
      const token = getAdminToken()
      const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/admin/giftCard/listAllOrdersOfUserAndMerchant?userId=${user.id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      
      if (data.status === 200 && Array.isArray(data.data)) {
        setOrders(data.data)
      } else {
        toast({
          title: "Info",
          description: data.message || "No orders found",
        })
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error)
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
        if (selectedUser) {
          fetchUserOrders(selectedUser)
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
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Users
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
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

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Users
            </CardTitle>
            <CardDescription>
              View user accounts and their order history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? "No users match your search" : "No users found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.profilePhoto ? (
                                <Image
                                  src={user.profilePhoto}
                                  alt={user.firstname}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {user.firstname} {user.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={user.emailVerified ? "default" : "secondary"} className="w-fit">
                              {user.emailVerified ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              Email {user.emailVerified ? "Verified" : "Not Verified"}
                            </Badge>
                            <Badge variant={user.phoneVerified ? "default" : "secondary"} className="w-fit">
                              {user.phoneVerified ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              Phone {user.phoneVerified ? "Verified" : "Not Verified"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUserOrders(user)}
                            title="View Orders"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            View Orders
                          </Button>
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

      {/* View Orders Dialog */}
      <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Orders for {selectedUser?.firstname} {selectedUser?.lastname}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No orders found for this user
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

export default function UsersPage() {
  return (
    <AdminProtectedGuard>
      <UsersPageContent />
    </AdminProtectedGuard>
  )
}
