"use client"

import { useEffect, useState } from "react"
import { AdminProtectedGuard } from "@/components/admin/admin-auth-guard"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { getDashboardStats, type DashboardStats } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, LogOut, User, FileText, Store, Users, ArrowRight, Loader2, PenTool, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

function AdminDashboardContent() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome Admin!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Katron Gift Card platform from here
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published Blogs
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalPublishedBlogs ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Live blog posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Merchants
              </CardTitle>
              <Store className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalMerchants ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Registered merchants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Authors
              </CardTitle>
              <PenTool className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalAuthors ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Blog authors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/create-blog" className="block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span>Create Blog</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Write and publish new blog posts
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/merchants" className="block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <span>Merchants</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage all registered merchants
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users" className="block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span>Users</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage all registered users
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders" className="block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <span>Orders</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage all gift card orders
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminProtectedGuard>
      <AdminDashboardContent />
    </AdminProtectedGuard>
  )
}
