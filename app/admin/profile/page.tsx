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
  Shield, LogOut, User, ArrowLeft, Loader2, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Mail, Phone, KeyRound, UserPlus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  adminChangePassword,
  adminForgotPassword,
  adminResetPassword,
  createAdminAccount,
  type AdminRegisterModel,
} from "@/lib/api/admin"

function AdminProfileContent() {
  const { admin, logout, refreshAdmin } = useAdminAuth()
  const router = useRouter()

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Reset password state
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetStep, setResetStep] = useState<"email" | "otp" | "done">("email")
  const [resetEmail, setResetEmail] = useState("")
  const [resetOtp, setResetOtp] = useState("")
  const [resetNewPw, setResetNewPw] = useState("")
  const [resetConfirmPw, setResetConfirmPw] = useState("")
  const [resetTempToken, setResetTempToken] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  // Create admin state (super admin only)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState<AdminRegisterModel>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: { addressLine1: "Admin Office", country: "US" },
    accountType: "ADMIN",
  })
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)

  const isSuperAdmin = admin?.accountType === "SUPER_ADMIN"

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" })
      return
    }

    setIsChangingPassword(true)
    try {
      const result = await adminChangePassword(oldPassword, newPassword, confirmPassword)
      if (result.status === 200) {
        toast({ title: "Success", description: "Password changed successfully" })
        setShowChangePassword(false)
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast({ title: "Error", description: result.message || "Failed to change password", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to change password", variant: "destructive" })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" })
      return
    }
    setIsResetting(true)
    try {
      const result = await adminForgotPassword(resetEmail)
      if (result.status === 200) {
        if (result.data?.token) {
          setResetTempToken(result.data.token)
        }
        setResetStep("otp")
        toast({ title: "Success", description: "OTP sent to your email" })
      } else {
        toast({ title: "Error", description: result.message || "Failed to send OTP", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to send reset email", variant: "destructive" })
    } finally {
      setIsResetting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetOtp || !resetNewPw || !resetConfirmPw) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" })
      return
    }
    if (resetNewPw !== resetConfirmPw) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    setIsResetting(true)
    try {
      const result = await adminResetPassword(resetOtp, resetNewPw, resetConfirmPw, resetTempToken)
      if (result.status === 200) {
        setResetStep("done")
        toast({ title: "Success", description: "Password reset successfully" })
      } else {
        toast({ title: "Error", description: result.message || "Failed to reset password", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to reset password", variant: "destructive" })
    } finally {
      setIsResetting(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdmin.firstname || !newAdmin.lastname || !newAdmin.email || !newAdmin.password || !newAdmin.phone) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" })
      return
    }
    if (newAdmin.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" })
      return
    }

    setIsCreatingAdmin(true)
    try {
      const result = await createAdminAccount(newAdmin)
      if (result.status === 200 || result.status === 255) {
        toast({ title: "Success", description: "Admin account created successfully" })
        setShowCreateAdmin(false)
        setNewAdmin({
          firstname: "", lastname: "", email: "", password: "", phone: "",
          address: { addressLine1: "Admin Office", country: "US" },
          accountType: "ADMIN",
        })
      } else {
        toast({ title: "Error", description: result.message || "Failed to create admin", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to create admin account", variant: "destructive" })
    } finally {
      setIsCreatingAdmin(false)
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
              <Badge variant="outline" className="text-xs">{admin?.accountType}</Badge>
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

        <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>

        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">First Name</label>
                <p className="text-sm font-medium mt-1">{admin?.firstname || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Last Name</label>
                <p className="text-sm font-medium mt-1">{admin?.lastname || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{admin?.email || "N/A"}</p>
                  {admin?.emailVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{admin?.phone || "N/A"}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase">Account Type</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">{admin?.accountType}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Password Management
            </CardTitle>
            <CardDescription>Change or reset your admin password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowChangePassword(true)} className="gap-2">
                <KeyRound className="h-4 w-4" /> Change Password
              </Button>
              <Button variant="outline" onClick={() => { setShowResetPassword(true); setResetStep("email"); setResetEmail(admin?.email || "") }} className="gap-2">
                <Lock className="h-4 w-4" /> Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Admin Account (Super Admin Only) */}
        {isSuperAdmin && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Create Admin Account
              </CardTitle>
              <CardDescription>Create new admin accounts (Super Admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowCreateAdmin(true)} className="gap-2">
                <UserPlus className="h-4 w-4" /> Create New Admin
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and a new password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <div className="relative">
                <Input type={showOldPw ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" />
                <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showOldPw ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 8 chars)" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showNewPw ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Changing...</> : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {resetStep === "email" && "Enter your email to receive a reset OTP"}
              {resetStep === "otp" && "Enter the OTP and your new password"}
              {resetStep === "done" && "Password reset successfully!"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {resetStep === "email" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="admin@example.com" />
              </div>
            )}
            {resetStep === "otp" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">OTP Code</label>
                  <Input type="text" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} placeholder="Enter OTP from email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" value={resetNewPw} onChange={(e) => setResetNewPw(e.target.value)} placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" value={resetConfirmPw} onChange={(e) => setResetConfirmPw(e.target.value)} placeholder="Confirm new password" />
                </div>
              </>
            )}
            {resetStep === "done" && (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Your password has been reset. You can now log in with your new password.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPassword(false)}>
              {resetStep === "done" ? "Close" : "Cancel"}
            </Button>
            {resetStep === "email" && (
              <Button onClick={handleForgotPassword} disabled={isResetting}>
                {isResetting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : "Send OTP"}
              </Button>
            )}
            {resetStep === "otp" && (
              <Button onClick={handleResetPassword} disabled={isResetting}>
                {isResetting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resetting...</> : "Reset Password"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      {isSuperAdmin && (
        <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Admin Account</DialogTitle>
              <DialogDescription>Create a new administrator account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input value={newAdmin.firstname} onChange={(e) => setNewAdmin(p => ({ ...p, firstname: e.target.value }))} placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input value={newAdmin.lastname} onChange={(e) => setNewAdmin(p => ({ ...p, lastname: e.target.value }))} placeholder="Last Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin(p => ({ ...p, email: e.target.value }))} placeholder="admin@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input type="tel" value={newAdmin.phone} onChange={(e) => setNewAdmin(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number (min 9 digits)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type</label>
                <select
                  value={newAdmin.accountType}
                  onChange={(e) => setNewAdmin(p => ({ ...p, accountType: e.target.value as "ADMIN" | "SUPER_ADMIN" }))}
                  className="w-full h-10 px-3 text-sm rounded-md border bg-background"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateAdmin(false)}>Cancel</Button>
              <Button onClick={handleCreateAdmin} disabled={isCreatingAdmin}>
                {isCreatingAdmin ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : "Create Admin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function AdminProfilePage() {
  return (
    <AdminProtectedGuard>
      <AdminProfileContent />
    </AdminProtectedGuard>
  )
}
