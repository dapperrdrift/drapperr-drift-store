"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingBag, Search, User, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/layout/search-modal"
import { cn } from "@/lib/utils"
import { NotificationIndicator } from "@/components/layout/notification-indicator"
import { useCart } from "@/contexts/cart-context"

const navigation = [
  { name: "New Arrivals", href: "/products?filter=new" },
  { name: "Collections", href: "/products" },
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHomePage = pathname === "/"
  const isSolid = scrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    // Set initial state in case page loads mid-scroll
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { count } = useCart()

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isSolid
            ? "bg-surface-container-lowest shadow-sm"
            : "bg-transparent"
        )}
      >
        {/* Announcement bar — only visible when not scrolled */}
        <div
          className={cn(
            "bg-primary text-primary-foreground overflow-hidden transition-all duration-500 ease-in-out",
            scrolled ? "max-h-0 py-0" : "max-h-10 py-2"
          )}
        >
          <div className="mx-auto max-w-7xl px-4">
            <p className="text-center label-md">
              Complimentary shipping on orders over Rs. 5,000
            </p>
          </div>
        </div>

        {/* Main header */}
        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            isSolid ? "border-b border-border" : "border-b border-transparent"
          )}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className={cn(
                  "transition-colors duration-300",
                  !isSolid && !mobileMenuOpen
                    ? "text-white hover:text-white hover:bg-white/20"
                    : "text-foreground hover:text-primary"
                )}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "label-md transition-colors duration-300",
                    isSolid
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/90 hover:text-white drop-shadow-sm"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
              <img
                src="/images/logo-black.svg"
                alt="Drapper Drift"
                className={cn(
                  "h-8 w-auto transition-all duration-300",
                  !isSolid ? "brightness-0 invert drop-shadow-md" : "brightness-100"
                )}
              />
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-x-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={cn(
                  "transition-all duration-300",
                  !isSolid
                    ? "text-white hover:text-white hover:bg-white/20"
                    : "text-foreground hover:bg-primary hover:text-white"
                )}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative transition-all duration-300",
                  !isSolid
                    ? "text-white hover:text-white hover:bg-white/20"
                    : "text-foreground hover:bg-primary hover:text-white"
                )}
                asChild
              >
                <Link href="/cart" aria-label="Shopping cart">
                  <ShoppingBag className="h-5 w-5" />
                  <span className={cn(
                    "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shadow-sm",
                    !isSolid ? "bg-white text-primary" : "bg-primary text-white"
                  )}>
                    {count}
                  </span>
                </Link>
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  "transition-all duration-300",
                  !isSolid
                    ? "text-white hover:text-white hover:bg-white/20"
                    : "text-foreground hover:bg-primary hover:text-white"
                )}
              >
                <Link href="/account" aria-label="Account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        <div className={cn("lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
          <div className="space-y-1 border-b border-border bg-surface-container-lowest px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 label-md text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex items-center justify-between border-t border-border">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="text-foreground hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative text-foreground hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                    {count}
                  </span>
                </Link>
              </Button>

              {/* Mobile Profile */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-foreground hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
