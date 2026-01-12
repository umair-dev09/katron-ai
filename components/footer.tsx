"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: "Browse Gift Cards", href: "/buy" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Gift Card Balance", href: "#balance" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Press Kit", href: "#press" },
    ],
    support: [
      { label: "Help Center", href: "#help" },
      { label: "Contact Us", href: "#contact" },
      { label: "FAQs", href: "#faqs" },
      { label: "Refund Policy", href: "#refund" },
    ],
    legal: [
      { label: "Terms of Service", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "Disclaimer", href: "#disclaimer" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-6xl bg-card px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid gap-10 py-12 sm:grid-cols-12 md:py-16">
          {/* Brand section */}
          <div className="space-y-4 sm:col-span-12 lg:col-span-4">
            <div className="-ml-7 -mt-3 -mb-3">
              <Link href="/" className="inline-block">
                <Image
                  src="/ktn-logo.png"
                  alt="Logo"
                  width={128}
                  height={64}
                  className="h-[70px] w-32"
                />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace for digital gift cards. Instant delivery, secure transactions, and thousands of brands to choose from.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@katron.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:border-primary hover:bg-primary/10"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        {/* <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <div>
              © {currentYear} Katron AI. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500">♥</span> for gifters
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Big text */}
      <div className="relative -mt-8 h-60 w-full overflow-hidden" aria-hidden="true">
        {/* Base gradient layer */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-8 text-center text-[348px] font-bold leading-none" style={{ 
          background: 'linear-gradient(to bottom, #ececf0 0%, rgba(246, 247, 249, 0.27) 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Katron
        </div>
        {/* Overlay layer for depth */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-8 text-center text-[348px] font-bold leading-none mix-blend-darken dark:mix-blend-lighten" style={{ 
          background: 'rgba(219, 222, 227, 0.65)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 1px 0 white'
        }}>
          Katron
        </div>
        {/* Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3"
          aria-hidden="true"
        >
          <div className="h-56 w-56 rounded-full border-[20px] border-primary blur-[80px]"></div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </footer>
  )
}
