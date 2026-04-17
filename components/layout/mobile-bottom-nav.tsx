"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3X3, ShoppingBag, UserRound } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    label: "Shop",
    href: "/products",
    icon: Grid3X3,
    isActive: (pathname: string) => pathname.startsWith("/products"),
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingBag,
    isActive: (pathname: string) => pathname.startsWith("/cart") || pathname.startsWith("/checkout"),
  },
  {
    label: "Account",
    href: "/account",
    icon: UserRound,
    isActive: (pathname: string) => pathname.startsWith("/account") || pathname.startsWith("/orders"),
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { count } = useCart()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-container-lowest/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive(pathname)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 rounded-md transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                {item.label}
              </span>
              {item.label === "Cart" && count > 0 && (
                <span className="absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
