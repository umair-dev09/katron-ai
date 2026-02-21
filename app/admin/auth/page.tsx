"use client"

import { Suspense } from "react"
import { AdminAuthPageContent } from "@/components/admin/admin-auth-page-content"
import { AdminGuestGuard } from "@/components/admin/admin-auth-guard"
import { PageLoader } from "@/components/ui/page-loader"

function AdminAuthLoading() {
  return <PageLoader message="Loading admin portal..." logoSrc="/katron-ai-logo-bg-transparent.png" />
}

export default function AdminAuthPage() {
  return (
    <AdminGuestGuard>
      <Suspense fallback={<AdminAuthLoading />}>
        <AdminAuthPageContent />
      </Suspense>
    </AdminGuestGuard>
  )
}
