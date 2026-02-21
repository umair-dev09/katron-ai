"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { Shield, Lock, AlertTriangle } from "lucide-react"
import Image from "next/image"

export function AdminAuthPageContent() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/admin")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-10">
      <div className="w-full max-w-lg md:max-w-4xl flex flex-col">
        <Card className="overflow-hidden border-border shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Left Panel - Branding & Info */}
            <div className="flex flex-col justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-primary blur-3xl" />
                <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-primary blur-3xl" />
              </div>

              <div className="relative space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/katron-ai-logo-bg-transparent.png"
                    alt="Katron AI"
                    width={140}
                    height={48}
                    className="h-12 w-auto object-contain"
                    priority
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      Admin Portal
                    </h1>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Secure access to the Katron Gift Card administration dashboard
                  </p>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
                  <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Secure Access</p>
                    <p className="text-xs text-muted-foreground">
                      This portal requires admin credentials. All access attempts are monitored and logged for security purposes.
                    </p>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Authorized Personnel Only</p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                      Unauthorized access attempts may result in account suspension and legal action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex flex-col justify-center p-8 md:p-12 bg-background">
              <div className="space-y-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                    Administrator Sign In
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your admin credentials to access the dashboard
                  </p>
                </div>

                <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Notice */}
        <p className="text-xs text-muted-foreground text-center mt-6 px-4">
          This is a restricted area. If you are not an authorized administrator,{" "}
          <a href="/" className="text-primary underline hover:no-underline">
            return to the main site
          </a>
        </p>
      </div>
    </div>
  )
}
