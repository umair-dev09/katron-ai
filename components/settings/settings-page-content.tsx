"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import UserProfileSection from "@/components/settings/user-profile-section"
import ChangePasswordSection from "@/components/settings/change-password-section"
import AccountActionsSection from "@/components/settings/account-actions-section"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPageContent() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <button
            onClick={() => router.push("/buy")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gift Cards</span>
          </button>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* User Profile Section */}
          <UserProfileSection />

          {/* Change Password Section */}
          <ChangePasswordSection />

          {/* Account Actions Section */}
          <AccountActionsSection />
        </div>
      </div>
    </main>
  )
}
