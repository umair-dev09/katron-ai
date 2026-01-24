"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
  className?: string
  showLogo?: boolean
}

export function PageLoader({ 
  message = "Loading...", 
  fullScreen = true,
  className,
  showLogo = true
}: PageLoaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[400px]",
        className
      )}
    >
      {/* Logo with animation */}
      {showLogo && (
        <div className="mb-6 animate-pulse">
          <Image
            src="/ktn-logo.png"
            alt="Katron AI"
            width={140}
            height={60}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
      )}

      {/* Animated Spinner Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring - slow rotation */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-primary/10 animate-[spin_3s_linear_infinite]" />
        
        {/* Middle ring - medium rotation, opposite direction */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-transparent border-t-primary/30 border-r-primary/30 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Inner ring - fast rotation with gradient effect */}
        <div className="absolute w-8 h-8 rounded-full border-2 border-transparent border-t-primary animate-[spin_0.8s_linear_infinite]" />
        
        {/* Center pulse dot */}
        <div className="relative w-3 h-3">
          <div className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
          <div className="relative rounded-full w-3 h-3 bg-primary" />
        </div>
      </div>

      {/* Loading text with subtle animation */}
      <div className="mt-6 flex flex-col items-center space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {message}
        </p>
        
        {/* Animated progress bar */}
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* CSS for custom animation */}
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  )
}

// Minimal loader for inline use
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  )
}

// Skeleton loader for content
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4 bg-muted rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Premium full-page loader with backdrop
export function PremiumLoader({ 
  message = "Please wait...",
  submessage 
}: { 
  message?: string
  submessage?: string 
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent/5 to-transparent rounded-full animate-pulse [animation-delay:1s]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/ktn-logo.png"
            alt="Katron AI"
            width={160}
            height={70}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        {/* Animated rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-20 h-20 rounded-full border border-primary/10 animate-[ping_2s_ease-in-out_infinite]" />
          <div className="absolute w-16 h-16 rounded-full border-2 border-primary/20 animate-[spin_4s_linear_infinite]" />
          <div className="absolute w-12 h-12 rounded-full border-2 border-transparent border-t-primary/40 border-r-primary/40 animate-[spin_2s_linear_infinite_reverse]" />
          <div className="absolute w-8 h-8 rounded-full border-2 border-transparent border-t-primary animate-[spin_1s_linear_infinite]" />
          <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/30" />
        </div>

        {/* Messages */}
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-foreground">{message}</p>
          {submessage && (
            <p className="text-sm text-muted-foreground">{submessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
