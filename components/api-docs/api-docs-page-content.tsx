"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Book,
  Key,
  CreditCard,
  Shield,
  Zap,
  ArrowRight,
  Copy,
  Check,
  Menu,
  X,
  Search,
  Globe,
  Wallet,
  AlertTriangle,
  ListOrdered,
  Tags,
  UserCheck,
  ServerCrash,
  Terminal,
  Lock,
  Sparkles,
} from "lucide-react"

// ─── Section data ───────────────────────────────────────────────────────────

interface NavSection {
  id: string
  label: string
  icon: React.ReactNode
  children?: { id: string; label: string }[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "introduction",
    label: "Introduction",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "overview", label: "Overview" },
      { id: "base-url", label: "Base URL" },
      { id: "authentication", label: "Authentication" },
    ],
  },
  {
    id: "quickstart",
    label: "Quick Start",
    icon: <Zap className="w-4 h-4" />,
    children: [
      { id: "create-profile", label: "1. Create Profile" },
      { id: "get-api-key", label: "2. Get API Key" },
      { id: "first-request", label: "3. First Request" },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: <UserCheck className="w-4 h-4" />,
    children: [
      { id: "get-account-details", label: "Get Account Details" },
      { id: "update-charge-type", label: "Update Charge Type" },
      { id: "reissue-token", label: "Reissue API Token" },
      { id: "fee-preference", label: "Fee Preference" },
    ],
  },
  {
    id: "gift-cards",
    label: "Gift Cards",
    icon: <CreditCard className="w-4 h-4" />,
    children: [
      { id: "list-gift-cards", label: "List Gift Cards" },
      { id: "purchase-gift-card", label: "Purchase Gift Card" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ListOrdered className="w-4 h-4" />,
    children: [
      { id: "list-orders", label: "List All Orders" },
      { id: "get-credentials", label: "Get Credentials" },
      { id: "resend-credentials", label: "Resend Credentials" },
      { id: "refresh-order", label: "Refresh Order" },
      { id: "refund-order", label: "Refund Payment" },
      { id: "void-order", label: "Void Payment" },
    ],
  },
  {
    id: "schemas",
    label: "Schemas",
    icon: <Tags className="w-4 h-4" />,
    children: [
      { id: "response-schema", label: "Response" },
      { id: "purchase-request-schema", label: "Purchase Request" },
      { id: "charge-type-enum", label: "Charge Type Enum" },
    ],
  },
  {
    id: "errors",
    label: "Error Handling",
    icon: <ServerCrash className="w-4 h-4" />,
    children: [
      { id: "error-format", label: "Error Format" },
      { id: "common-errors", label: "Common Errors" },
    ],
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white/80 transition-all"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02] my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider ml-2">{language}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="text-white/80 font-mono">{code}</code>
      </pre>
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    PUT: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/25",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono border ${colors[method] || "bg-gray-500/15 text-gray-400 border-gray-500/25"}`}>
      {method}
    </span>
  )
}

function EndpointHeader({ method, path, title, description }: { method: string; path: string; title: string; description: string }) {
  return (
    <div className="my-6 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/50 mb-3">{description}</p>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-sm">
        <MethodBadge method={method} />
        <code className="text-white/70 break-all">{path}</code>
      </div>
    </div>
  )
}

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; description: string; extra?: string }[] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-2xl border border-white/[0.08]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Parameter</th>
            <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Required</th>
            <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-white/[0.05] last:border-0">
              <td className="px-4 py-3"><code className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-mono border border-purple-500/20">{p.name}</code></td>
              <td className="px-4 py-3 text-white/40 font-mono text-xs">{p.type}</td>
              <td className="px-4 py-3">
                {p.required
                  ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">Required</span>
                  : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-white/40 border border-white/[0.08]">Optional</span>}
              </td>
              <td className="px-4 py-3 text-white/50 text-xs">{p.description}{p.extra && <><br /><span className="text-xs text-white/30">{p.extra}</span></>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InfoCallout({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" | "tip" }) {
  const styles = {
    info: "bg-blue-500/[0.06] border-blue-500/20 text-blue-300",
    warning: "bg-amber-500/[0.06] border-amber-500/20 text-amber-300",
    tip: "bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-300",
  }
  const icons = {
    info: <Globe className="w-4 h-4 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />,
    tip: <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />,
  }
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed my-4 ${styles[variant]}`}>
      {icons[variant]}
      <div className="text-white/60 [&_strong]:text-white/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono [&_code]:bg-white/[0.06] [&_code]:text-white/60">{children}</div>
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ApiDocsPageContent() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    )

    const sections = document.querySelectorAll("[data-section]")
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top, behavior: "smooth" })
      setSidebarOpen(false)
    }
  }, [])

  const filteredSections = searchQuery
    ? NAV_SECTIONS.map((s) => ({
        ...s,
        children: s.children?.filter(
          (c) =>
            c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((s) => (s.children && s.children.length > 0) || s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : NAV_SECTIONS

  const BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-28">

      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.04] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-purple-500/15 text-purple-400 border border-purple-500/25">
                <Terminal className="w-3 h-3" />
                Merchant API
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0 Stable
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
              KTN Gift Card<br />
              <span className="text-white/50">API Documentation</span>
            </h1>
            <p className="text-base lg:text-lg text-white/50 leading-relaxed mb-8 max-w-xl">
              Integrate gift card purchasing directly into your applications. List cards, manage orders, retrieve credentials — all with simple Bearer token auth.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection("create-profile")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#9333EA] text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/25"
              >
                Quick Start
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push("/merchant-api")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/[0.06] text-white/80 border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                API Profile
              </button>
            </div>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Secure</p>
                <p className="text-xs text-white/40">Bearer token auth</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Fast</p>
                <p className="text-xs text-white/40">Low latency responses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">RESTful</p>
                <p className="text-xs text-white/40">JSON over HTTPS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Layout ────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto flex relative">

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-24 md:top-28 z-40 h-[calc(100vh-96px)] md:h-[calc(100vh-112px)] w-72 border-r border-white/[0.06] bg-black/95 backdrop-blur-xl overflow-y-auto slim-scrollbar transition-transform lg:transition-none lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 transition-all"
              />
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {filteredSections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => scrollToSection(section.children?.[0]?.id || section.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-white/50 rounded-xl hover:bg-white/[0.04] hover:text-white/70 transition-all"
                >
                  <span className="text-white/30">{section.icon}</span>
                  {section.label}
                </button>
                {section.children && (
                  <div className="ml-4 pl-3 border-l border-white/[0.06] space-y-0.5 mb-2">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => scrollToSection(child.id)}
                        className={`w-full text-left px-3 py-1.5 text-[13px] rounded-lg transition-all ${
                          activeSection === child.id
                            ? "text-purple-400 bg-purple-500/10 font-medium border-l-2 border-purple-500 -ml-[13px] pl-[23px]"
                            : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 mt-auto border-t border-white/[0.06]">
            <button
              onClick={() => router.push("/merchant-api")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              Go to API Profile
            </button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile floating sidebar toggle */}
        <button
          className="fixed bottom-6 left-6 z-50 lg:hidden p-3 rounded-full bg-[#9333EA] text-white shadow-lg shadow-purple-500/30 hover:bg-purple-500 transition-all"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 min-w-0 lg:ml-0">
          <div className="max-w-3xl mx-auto px-6 py-10 lg:px-12 lg:py-14">

            {/* ── INTRODUCTION ─────────────────────────────────────────── */}
            <section id="overview" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Book className="w-5 h-5 text-purple-400" />
                </div>
                Introduction
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                The KTN Gift Card Merchant API is a RESTful service that lets you programmatically list available gift cards,
                purchase them, manage orders, retrieve gift card credentials, and handle refunds. All communication happens
                over HTTPS with JSON request and response bodies.
              </p>
            </section>

            <section id="base-url" data-section className="scroll-mt-32 mt-12">
              <h3 className="text-lg font-bold text-white mb-3">Base URL</h3>
              <p className="text-sm text-white/50 mb-3">
                All API requests should be made to the following base URL. All communication is over HTTPS.
              </p>
              <CodeBlock language="text" code={BASE_URL} />
              <InfoCallout variant="info">
                All endpoints in this documentation are relative to the base URL above. For example,
                <code>/api/merchant/getAccountDetails</code> resolves to <code>{BASE_URL}/api/merchant/getAccountDetails</code>.
              </InfoCallout>
            </section>

            <section id="authentication" data-section className="scroll-mt-32 mt-12">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Authentication
              </h3>
              <p className="text-sm text-white/50 mb-3">
                The API uses <strong className="text-white/70">Bearer Token</strong> authentication. When you create a Merchant API profile,
                an API key (JWT token) is sent to your registered email address. Include this token in the
                <code className="mx-1 px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">Authorization</code> header
                of every request.
              </p>
              <CodeBlock language="http" code={`GET /api/merchant/getAccountDetails HTTP/1.1
Host: api.ktngiftcard.katronai.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`} />
              <InfoCallout variant="warning">
                <strong>Keep your API key secret.</strong> Do not share it in public repositories, client-side code, or
                any insecure location. If your key is compromised, regenerate it immediately from your API Profile page
                or by calling the reissue token endpoint.
              </InfoCallout>
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── QUICK START ──────────────────────────────────────────── */}
            <section id="create-profile" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                Quick Start Guide
              </h2>
              <p className="text-sm text-white/50 mb-8">
                Get up and running in three simple steps. From creating your merchant API profile to making your first
                API request — here&apos;s everything you need to start.
              </p>

              {/* Step indicator */}
              <div className="relative pl-6 border-l-2 border-purple-500/20 space-y-8 mb-8">
                <div className="relative">
                  <div className="absolute -left-[31px] w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-purple-500/30">1</div>
                  <h3 className="text-base font-semibold text-white mb-2">Create Your Merchant API Profile</h3>
                  <p className="text-sm text-white/50 mb-3">
                    Register as a <strong className="text-white/70">MERCHANT</strong> user on KTN Gift Card, then navigate to
                    <strong className="text-white/70"> API Profile</strong> or call the endpoint below. Choose a charge type that determines how purchases are billed.
                  </p>
                </div>
              </div>

              <EndpointHeader
                method="POST"
                path="/api/user/createMerchantApiProfile?type=CHARGE_CARD"
                title="Create Merchant API Profile"
                description="Creates a new API profile for the authenticated merchant user. Requires user JWT (not the merchant API key)."
              />

              <ParamTable params={[
                { name: "type", type: "string", required: true, description: "The billing method for API purchases.", extra: "Enum: CHARGE_CARD | CHARGE_ACCOUNT_BALANCE" },
              ]} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-sm font-semibold text-white">CHARGE_CARD</p>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">Purchases are charged directly to your card on file. Best for pay-as-you-go usage.</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-semibold text-white">CHARGE_ACCOUNT_BALANCE</p>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">Purchases are deducted from pre-loaded account balance. Best for high-volume usage.</p>
                </div>
              </div>

              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/user/createMerchantApiProfile?type=CHARGE_CARD" \\
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN" \\
  -H "Content-Type: application/json"`} />
            </section>

            <section id="get-api-key" data-section className="scroll-mt-32 mt-10">
              <div className="relative pl-6 border-l-2 border-purple-500/20 mb-4">
                <div className="absolute -left-[11px] w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-purple-500/30">2</div>
                <h3 className="text-base font-semibold text-white mb-2">Retrieve Your API Key</h3>
                <p className="text-sm text-white/50 mb-3">
                  After creating your profile, your API key (Bearer token) is sent to your registered email address.
                  This token is used for all subsequent calls to <code className="px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">/api/merchant/*</code> endpoints.
                </p>
              </div>
              <InfoCallout variant="tip">
                <strong>Tip:</strong> Check your spam/junk folder if you don&apos;t receive the email. You can also regenerate
                your token at any time using the <code>reissueTokenForMerchantApiProfile</code> endpoint.
              </InfoCallout>
            </section>

            <section id="first-request" data-section className="scroll-mt-32 mt-10">
              <div className="relative pl-6 border-l-2 border-purple-500/20 mb-4">
                <div className="absolute -left-[11px] w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-purple-500/30">3</div>
                <h3 className="text-base font-semibold text-white mb-2">Make Your First Request</h3>
                <p className="text-sm text-white/50 mb-3">
                  Use your merchant API key to list all available gift cards:
                </p>
              </div>
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/giftCard/listGiftCards" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY" \\
  -H "Content-Type: application/json"`} />

              <p className="text-sm text-white/50 mt-4 mb-2">
                <strong className="text-white/70">Example successful response:</strong>
              </p>
              <CodeBlock language="json" code={`{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "productId": 1234,
      "productName": "Amazon Gift Card",
      "denominationType": "FIXED",
      "recipientCurrencyCode": "USD",
      "fixedRecipientDenominations": [25, 50, 100],
      "logoUrls": ["https://..."],
      "brand": { "brandId": 1, "brandName": "Amazon" },
      "category": { "id": 1, "name": "Shopping" },
      "country": { "isoName": "US", "name": "United States" }
    }
  ]
}`} />
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── ACCOUNT ──────────────────────────────────────────────── */}
            <section id="get-account-details" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                </div>
                Account
              </h2>

              <EndpointHeader
                method="GET"
                path="/api/merchant/getAccountDetails"
                title="Get Account Details"
                description="Retrieve your merchant account information including profile status, balance, and configuration."
              />
              <p className="text-sm text-white/50 mb-3">
                Returns detailed information about your merchant API profile including your current balance,
                active status, charge type, and other account metadata.
              </p>
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/getAccountDetails" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="update-charge-type" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/updateMerchantApiProfileGiftCardChargeType?type={type}"
                title="Update Charge Type"
                description="Change how your API purchases are billed."
              />
              <ParamTable params={[
                { name: "type", type: "string", required: true, description: "The new charge type.", extra: "Enum: CHARGE_CARD | CHARGE_ACCOUNT_BALANCE" },
              ]} />
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/updateMerchantApiProfileGiftCardChargeType?type=CHARGE_ACCOUNT_BALANCE" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="reissue-token" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/reissueTokenForMerchantApiProfile"
                title="Reissue API Token"
                description="Regenerate your API key. The current key will be invalidated immediately and a new one will be sent to your email."
              />
              <InfoCallout variant="warning">
                <strong>Caution:</strong> Reissuing your token immediately invalidates the current one. All applications
                using the old key will receive authentication errors. Update your integrations promptly after reissuing.
              </InfoCallout>
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/reissueTokenForMerchantApiProfile" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="fee-preference" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="GET"
                path="/api/merchant/giftCard/getActiveFeePreference"
                title="Get Active Fee Preference"
                description="Retrieve the current fee schedule that applies to your merchant API transactions."
              />
              <p className="text-sm text-white/50 mb-3">
                Fees are tier-based and vary by purchase amount. The response contains fixed fees for smaller
                amounts and a percentage-based fee for larger transactions.
              </p>
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/giftCard/getActiveFeePreference" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />

              <p className="text-sm text-white/50 mt-4 mb-2"><strong className="text-white/70">Example response:</strong></p>
              <CodeBlock language="json" code={`{
  "status": 200,
  "message": "Success",
  "data": {
    "giftCardFeeType": "FEE_TYPE_MERCHANT_API",
    "feeFor1To99": 2.50,
    "feeFor100To250": 3.50,
    "feeFor251To500": 5.00,
    "feeFor501To750": 6.50,
    "feeFor751To999": 8.00,
    "feePercentageFor1000To5000": 1.5
  }
}`} />

              <div className="overflow-x-auto my-4 rounded-2xl border border-white/[0.08]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Amount Range</th>
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Fee Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Field</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b border-white/[0.05]"><td className="px-4 py-2.5 text-white/50">$1 – $99</td><td className="px-4 py-2.5 text-white/50">Fixed ($)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feeFor1To99</code></td></tr>
                    <tr className="border-b border-white/[0.05]"><td className="px-4 py-2.5 text-white/50">$100 – $250</td><td className="px-4 py-2.5 text-white/50">Fixed ($)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feeFor100To250</code></td></tr>
                    <tr className="border-b border-white/[0.05]"><td className="px-4 py-2.5 text-white/50">$251 – $500</td><td className="px-4 py-2.5 text-white/50">Fixed ($)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feeFor251To500</code></td></tr>
                    <tr className="border-b border-white/[0.05]"><td className="px-4 py-2.5 text-white/50">$501 – $750</td><td className="px-4 py-2.5 text-white/50">Fixed ($)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feeFor501To750</code></td></tr>
                    <tr className="border-b border-white/[0.05]"><td className="px-4 py-2.5 text-white/50">$751 – $999</td><td className="px-4 py-2.5 text-white/50">Fixed ($)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feeFor751To999</code></td></tr>
                    <tr><td className="px-4 py-2.5 text-white/50">$1,000 – $5,000</td><td className="px-4 py-2.5 text-white/50">Percentage (%)</td><td className="px-4 py-2.5"><code className="bg-white/[0.06] px-1.5 rounded-md font-mono text-white/60">feePercentageFor1000To5000</code></td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── GIFT CARDS ───────────────────────────────────────────── */}
            <section id="list-gift-cards" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <CreditCard className="w-5 h-5 text-pink-400" />
                </div>
                Gift Cards
              </h2>

              <EndpointHeader
                method="GET"
                path="/api/merchant/giftCard/listGiftCards"
                title="List Gift Cards"
                description="Retrieve all available gift cards that can be purchased through your merchant API profile."
              />
              <p className="text-sm text-white/50 mb-3">
                Returns a comprehensive list of gift cards including product details, denominations, pricing,
                brand information, country availability, and redemption instructions. Each card has either
                <code className="mx-1 px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">FIXED</code> or
                <code className="mx-1 px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">RANGE</code> denomination types.
              </p>
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/giftCard/listGiftCards" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />

              <p className="text-sm text-white/50 mt-4 mb-2"><strong className="text-white/70">Response fields per gift card:</strong></p>
              <ParamTable params={[
                { name: "productId", type: "integer (int64)", required: true, description: "Unique identifier for the gift card product. Used when purchasing." },
                { name: "productName", type: "string", required: true, description: "Display name of the gift card." },
                { name: "denominationType", type: "string", required: true, description: "FIXED (specific amounts) or RANGE (min/max range)." },
                { name: "fixedRecipientDenominations", type: "number[]", required: false, description: "Available fixed denominations (when type is FIXED)." },
                { name: "minRecipientDenomination", type: "number", required: false, description: "Minimum denomination (when type is RANGE)." },
                { name: "maxRecipientDenomination", type: "number", required: false, description: "Maximum denomination (when type is RANGE)." },
                { name: "recipientCurrencyCode", type: "string", required: true, description: "Currency code for the gift card (e.g., USD, EUR)." },
                { name: "senderFee", type: "number", required: true, description: "Fixed fee charged to the sender." },
                { name: "senderFeePercentage", type: "number", required: true, description: "Percentage fee charged to the sender." },
                { name: "discountPercentage", type: "number", required: true, description: "Discount percentage applied to the card." },
                { name: "logoUrls", type: "string[]", required: true, description: "Array of logo image URLs for the card." },
                { name: "brand", type: "object", required: true, description: "Brand info: { brandId, brandName }." },
                { name: "category", type: "object", required: true, description: "Category info: { id, name }." },
                { name: "country", type: "object", required: true, description: "Country info: { isoName, name, flagUrl }." },
                { name: "redeemInstruction", type: "object", required: true, description: "Redemption instructions: { concise, verbose }." },
              ]} />
            </section>

            <section id="purchase-gift-card" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/purchaseGiftCard"
                title="Purchase Gift Card"
                description="Purchase a gift card through your merchant API profile. The purchase will be charged according to your configured charge type."
              />
              <p className="text-sm text-white/50 mb-3">
                Send a JSON request body with the gift card details. The <code className="px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">productId</code> can be
                obtained from the list gift cards endpoint. The <code className="px-1.5 py-0.5 bg-white/[0.06] rounded-md text-xs font-mono text-white/60">unitPrice</code> must match
                one of the available denominations for the selected gift card.
              </p>

              <p className="text-sm font-semibold text-white/80 mb-2">Request Body</p>
              <ParamTable params={[
                { name: "productId", type: "integer (int64)", required: true, description: "The ID of the gift card product to purchase." },
                { name: "unitPrice", type: "number (float)", required: true, description: "The denomination/amount of the gift card." },
                { name: "email", type: "string", required: false, description: "Recipient email address for gift card delivery." },
                { name: "senderName", type: "string", required: true, description: "Name of the sender/purchaser." },
              ]} />

              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/purchaseGiftCard" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "productId": 1234,
    "unitPrice": 50.00,
    "email": "recipient@example.com",
    "senderName": "Acme Corp"
  }'`} />

              <p className="text-sm text-white/50 mt-4 mb-2"><strong className="text-white/70">Example response:</strong></p>
              <CodeBlock language="json" code={`{
  "status": 200,
  "message": "Gift card purchased successfully",
  "data": {
    "orderId": 5678,
    "productId": 1234,
    "productName": "Amazon Gift Card",
    "unitPrice": 50.00,
    "status": "COMPLETED",
    "email": "recipient@example.com"
  }
}`} />

              <InfoCallout variant="tip">
                <strong>FIXED denomination cards:</strong> The <code>unitPrice</code> must
                exactly match one of the values in <code>fixedRecipientDenominations</code>.
                <br /><br />
                <strong>RANGE denomination cards:</strong> The <code>unitPrice</code> must
                be between <code>minRecipientDenomination</code> and <code>maxRecipientDenomination</code>.
              </InfoCallout>
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── ORDERS ───────────────────────────────────────────────── */}
            <section id="list-orders" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <ListOrdered className="w-5 h-5 text-orange-400" />
                </div>
                Orders
              </h2>

              <EndpointHeader
                method="GET"
                path="/api/merchant/giftCard/listAllGiftCardOrders"
                title="List All Orders"
                description="Retrieve a list of all gift card orders placed through your merchant API profile."
              />
              <p className="text-sm text-white/50 mb-3">
                Returns all orders with details including order status, product information, pricing, and timestamps.
                Use this to reconcile purchases and track delivery status.
              </p>
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/giftCard/listAllGiftCardOrders" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="get-credentials" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="GET"
                path="/api/merchant/giftCard/getGiftCardCredentials?giftCardOrderId={orderId}"
                title="Get Gift Card Credentials"
                description="Retrieve the actual gift card details (activation code, PIN, URL, etc.) for a completed order."
              />
              <ParamTable params={[
                { name: "giftCardOrderId", type: "integer (int64)", required: true, description: "The ID of the gift card order." },
              ]} />
              <CodeBlock language="bash" code={`curl -X GET \\
  "${BASE_URL}/api/merchant/giftCard/getGiftCardCredentials?giftCardOrderId=5678" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
              <InfoCallout variant="info">
                Gift card credentials typically include an activation code, PIN, and/or a redemption URL depending on
                the card brand. Some cards may take a few moments to be fulfilled — use the <strong>Refresh Order</strong> endpoint
                if the credentials are not yet available.
              </InfoCallout>
            </section>

            <section id="resend-credentials" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/resendGiftCardCredentials?giftCardOrderId={orderId}"
                title="Resend Gift Card Credentials"
                description="Resend the gift card credentials to the recipient's email address."
              />
              <ParamTable params={[
                { name: "giftCardOrderId", type: "integer (int64)", required: true, description: "The ID of the gift card order to resend credentials for." },
              ]} />
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/resendGiftCardCredentials?giftCardOrderId=5678" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="refresh-order" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/refreshOrder?giftCardOrderId={orderId}"
                title="Refresh Order"
                description="Refresh the status of a gift card order. Useful if the order is still processing or if credentials haven't been delivered yet."
              />
              <ParamTable params={[
                { name: "giftCardOrderId", type: "integer (int64)", required: true, description: "The ID of the order to refresh." },
              ]} />
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/refreshOrder?giftCardOrderId=5678" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
            </section>

            <section id="refund-order" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/refundOrderPayment?giftCardOrderId={orderId}"
                title="Refund Order Payment"
                description="Request a refund for a gift card order. Refund eligibility depends on the card brand and order status."
              />
              <ParamTable params={[
                { name: "giftCardOrderId", type: "integer (int64)", required: true, description: "The ID of the order to refund." },
              ]} />
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/refundOrderPayment?giftCardOrderId=5678" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
              <InfoCallout variant="warning">
                Refund availability varies by card provider. Some gift cards are non-refundable once fulfilled. The endpoint
                will return an error if the order is not eligible for a refund.
              </InfoCallout>
            </section>

            <section id="void-order" data-section className="scroll-mt-32 mt-10">
              <EndpointHeader
                method="POST"
                path="/api/merchant/giftCard/voidOrderPayment?giftCardOrderId={orderId}"
                title="Void Order Payment"
                description="Void the payment for a pending or recently placed order before it is fully processed."
              />
              <ParamTable params={[
                { name: "giftCardOrderId", type: "integer (int64)", required: true, description: "The ID of the order to void." },
              ]} />
              <CodeBlock language="bash" code={`curl -X POST \\
  "${BASE_URL}/api/merchant/giftCard/voidOrderPayment?giftCardOrderId=5678" \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY"`} />
              <InfoCallout variant="info">
                Voiding a payment is different from a refund. A void cancels a pending transaction <strong>before</strong> it has fully settled,
                while a refund reverses a completed transaction. Use void for recent orders that haven&apos;t been processed yet.
              </InfoCallout>
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── SCHEMAS ──────────────────────────────────────────────── */}
            <section id="response-schema" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Tags className="w-5 h-5 text-violet-400" />
                </div>
                Schemas
              </h2>

              <h3 className="text-lg font-semibold text-white mb-2">Response Object</h3>
              <p className="text-sm text-white/50 mb-3">
                All API endpoints return a standardized response envelope with the following structure:
              </p>
              <CodeBlock language="json" code={`{
  "status": 200,         // HTTP status code (integer)
  "message": "Success",  // Human-readable message (string)
  "data": { ... }        // Response payload (object, array, or null)
}`} />
              <ParamTable params={[
                { name: "status", type: "integer (int32)", required: true, description: "HTTP status code mirrored in the response body." },
                { name: "message", type: "string", required: true, description: "Human-readable status message." },
                { name: "data", type: "object | null", required: true, description: "The response payload. May be null on errors." },
              ]} />
            </section>

            <section id="purchase-request-schema" data-section className="scroll-mt-32 mt-10">
              <h3 className="text-lg font-semibold text-white mb-2">MerchantApiProfileGiftCardOrderRequest</h3>
              <p className="text-sm text-white/50 mb-3">
                The request body schema for purchasing a gift card through the merchant API.
              </p>
              <CodeBlock language="typescript" code={`interface MerchantApiProfileGiftCardOrderRequest {
  productId: number;   // int64 — Gift card product ID
  unitPrice: number;   // float — Denomination amount
  email?: string;      // Recipient email for delivery
  senderName: string;  // Required — Sender/purchaser name
}`} />
              <ParamTable params={[
                { name: "productId", type: "integer (int64)", required: true, description: "The product ID from the list gift cards response." },
                { name: "unitPrice", type: "number (float)", required: true, description: "Must match a fixed denomination or fall within the min/max range." },
                { name: "email", type: "string", required: false, description: "Email address where the gift card credentials will be sent." },
                { name: "senderName", type: "string", required: true, description: "The name displayed as the sender of the gift card." },
              ]} />
            </section>

            <section id="charge-type-enum" data-section className="scroll-mt-32 mt-10">
              <h3 className="text-lg font-semibold text-white mb-2">ChargeType Enum</h3>
              <p className="text-sm text-white/50 mb-3">
                The charge type determines how gift card purchases are billed to your merchant account.
                Set during profile creation and updateable via the update charge type endpoint.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Value</th>
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.05]">
                      <td className="px-4 py-3"><code className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-mono border border-purple-500/20">CHARGE_CARD</code></td>
                      <td className="px-4 py-3 text-white/50 text-xs">Purchases are charged directly to the credit/debit card on file. Ideal for pay-as-you-go usage patterns.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-mono border border-purple-500/20">CHARGE_ACCOUNT_BALANCE</code></td>
                      <td className="px-4 py-3 text-white/50 text-xs">Purchases are deducted from the pre-loaded merchant account balance. Ideal for high-volume, prepaid usage.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── ERRORS ───────────────────────────────────────────────── */}
            <section id="error-format" data-section className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <ServerCrash className="w-5 h-5 text-red-400" />
                </div>
                Error Handling
              </h2>

              <h3 className="text-lg font-semibold text-white mb-2">Error Response Format</h3>
              <p className="text-sm text-white/50 mb-3">
                When an error occurs, the API returns a consistent error envelope. The HTTP status code is mirrored in
                the response body for convenience.
              </p>
              <CodeBlock language="json" code={`{
  "status": "error",
  "message": "Access Denied",
  "errors": ""
}`} />
            </section>

            <section id="common-errors" data-section className="scroll-mt-32 mt-10">
              <h3 className="text-lg font-semibold text-white mb-3">Common Error Codes</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">Meaning</th>
                      <th className="text-left px-4 py-3 font-semibold text-white/80 text-xs uppercase tracking-wider">How to Fix</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b border-white/[0.05]">
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">400</span></td>
                      <td className="px-4 py-3 text-white/50">Bad Request — Invalid or missing parameters</td>
                      <td className="px-4 py-3 text-white/50">Check the request format, required parameters, and enum values.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">401</span></td>
                      <td className="px-4 py-3 text-white/50">Unauthorized — Missing or invalid API key</td>
                      <td className="px-4 py-3 text-white/50">Ensure the Authorization header contains a valid Bearer token.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">403</span></td>
                      <td className="px-4 py-3 text-white/50">Forbidden — Access denied for this resource</td>
                      <td className="px-4 py-3 text-white/50">Ensure you&apos;re using the correct endpoint and your profile is active.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">404</span></td>
                      <td className="px-4 py-3 text-white/50">Not Found — Resource does not exist</td>
                      <td className="px-4 py-3 text-white/50">Verify the order ID or product ID is correct.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">500</span></td>
                      <td className="px-4 py-3 text-white/50">Internal Server Error</td>
                      <td className="px-4 py-3 text-white/50">Retry after a moment. If the issue persists, contact support.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <InfoCallout variant="tip">
                <strong>Best practice:</strong> Always check the <code>status</code> field
                in the response body, not just the HTTP status code. Some successful operations may return additional context in the
                <code>message</code> field.
              </InfoCallout>
            </section>

            <div className="my-16 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Footer CTA */}
            <div className="relative text-center py-16 mb-8">
              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[400px] h-[200px] bg-purple-500/[0.06] rounded-full blur-[100px]" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                  <Sparkles className="w-3 h-3" />
                  Get Started
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Ready to integrate?</h3>
                <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
                  Create your Merchant API profile and start purchasing gift cards programmatically in minutes.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => router.push("/auth")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#9333EA] text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/25"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push("/merchant-api")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white/[0.06] text-white/80 border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-all"
                  >
                    <Key className="w-4 h-4" />
                    API Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
