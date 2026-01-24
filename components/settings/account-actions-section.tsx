"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

export default function AccountActionsSection() {
  const router = useRouter()
  const { logout, isLoading } = useAuth()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      logout()
      toast.success("Logged out successfully")
      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  const handleDeleteAccount = () => {
    // Note: Backend doesn't have delete account endpoint yet
    // This is a placeholder for future implementation
    toast.info("Account deletion is not available at this time. Please contact support.")
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-4">
      {/* Logout Section */}
      <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Sign Out</h3>
            <p className="text-sm text-muted-foreground">
              Sign out of your account on this device
            </p>
          </div>
          <Button
            onClick={() => setShowLogoutDialog(true)}
            variant="outline"
            disabled={isLoggingOut || isLoading}
            className="w-full sm:w-auto h-11 px-6 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900/50 font-semibold"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-red-600 dark:text-red-500">Delete Account</h3>
            <p className="text-sm text-red-600/80 dark:text-red-500/80">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-primary hover:bg-primary/90 font-semibold"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                "Sign Out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <AlertDialogTitle className="text-red-600 dark:text-red-500">Delete Account</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-foreground">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              <br />
              <br />
              <strong className="text-red-600 dark:text-red-500">Are you absolutely sure?</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Yes, Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
