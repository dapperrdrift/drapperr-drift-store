"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

// Routes that render as a standalone customer dashboard — no marketing
// navbar / footer / mobile bottom-nav, just the page itself.
const BARE_ROUTE_PREFIXES = ["/account"]

function isBareRoute(pathname: string): boolean {
  return BARE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (isBareRoute(pathname)) {
    return (
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-header md:pb-0">{children}</main>
      <MobileBottomNav />
      <Footer />
    </div>
  )
}
