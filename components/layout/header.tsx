"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Search, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "New Arrivals", href: "/products?filter=new" },
  { name: "Collections", href: "/products" },
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest">
      {/* Announcement bar */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <p className="text-center label-md text-background/90">
            Complimentary shipping on orders over Rs. 5,000
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
                className="label-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="display-md text-foreground tracking-tight">
              DRAPPERR
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart" aria-label="Shopping cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 border-b border-border bg-surface-container-lowest px-4 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-3 label-md text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Search className="h-5 w-5" />
              <span className="label-md">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
