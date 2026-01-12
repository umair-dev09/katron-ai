"use client"

import { Suspense } from "react"
import SettingsPageContent from "@/components/settings/settings-page-content"

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SettingsPageContent />
    </Suspense>
  )
}
