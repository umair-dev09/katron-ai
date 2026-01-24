"use client"

import { Suspense } from "react"
import SettingsPageContent from "@/components/settings/settings-page-content"
import { ProtectedGuard } from "@/components/auth/auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

export default function SettingsPage() {
  return (
    <ProtectedGuard>
      <Suspense fallback={<PageLoader message="Loading settings..." />}>
        <SettingsPageContent />
      </Suspense>
    </ProtectedGuard>
  )
}
