"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
  PackageOpen,
  Settings,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/layout/search-modal"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "New Arrivals", href: "/products?filter=new" },
  { name: "Collections", href: "/products" },
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
]

/* ────────────────────────────────────────────────
   Avatar / User Dropdown component
   ──────────────────────────────────────────────── */
function UserDropdown({ isSolid }: { isSolid: boolean }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!user) {
    /* ── Not logged in: show Login + Sign Up ── */
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "label-md transition-all duration-300",
            !isSolid
              ? "text-white hover:text-white hover:bg-white/20"
              : "text-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button
          size="sm"
          asChild
          className={cn(
            "label-md transition-all duration-300",
            !isSolid
              ? "bg-white text-foreground hover:bg-white/90"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          )}
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  /* ── Logged in: avatar + dropdown ── */
  const name: string =
    user.user_metadata?.name || user.user_metadata?.full_name || user.email || "Account"
  const avatarUrl: string | null =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null

  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          open && "ring-2 ring-primary"
        )}
        aria-label="User menu"
        aria-expanded={open}
      >
        {/* Avatar */}
        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-offset-1 ring-primary/40">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className={cn(
              "flex h-full w-full items-center justify-center text-[11px] font-bold",
              !isSolid ? "bg-white text-primary" : "bg-primary text-primary-foreground"
            )}>
              {initials || <User className="h-4 w-4" />}
            </div>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            !isSolid ? "text-white" : "text-muted-foreground",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 origin-top-right animate-in fade-in-0 zoom-in-95 duration-150 rounded-md border border-border bg-card shadow-xl z-50">
          {/* User info header */}
          <div className="border-b border-border px-4 py-3">
            <p className="title-md text-foreground truncate">{name}</p>
            <p className="body-md text-muted-foreground truncate text-xs">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 body-md text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Settings className="h-4 w-4" />
              My Profile
            </Link>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 body-md text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <PackageOpen className="h-4 w-4" />
              My Orders
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border py-1">
            <button
              onClick={() => { setOpen(false); logout() }}
              className="flex w-full items-center gap-3 px-4 py-2.5 body-md text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────
   Mobile auth section
   ──────────────────────────────────────────────── */
function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center gap-3 pt-1">
        <Button variant="outline" size="sm" asChild className="flex-1" onClick={onClose}>
          <Link href="/login">Login</Link>
        </Button>
        <Button size="sm" asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover" onClick={onClose}>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const name: string =
    user.user_metadata?.name || user.user_metadata?.full_name || user.email || "Account"

  return (
    <div className="flex flex-col gap-1 pt-1">
      <div className="flex items-center gap-3 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
          {name[0]?.toUpperCase() || <User className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <p className="title-md text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <Link href="/account" onClick={onClose} className="block py-2.5 pl-2 label-md text-muted-foreground hover:text-primary transition-colors">
        My Profile
      </Link>
      <Link href="/orders" onClick={onClose} className="block py-2.5 pl-2 label-md text-muted-foreground hover:text-primary transition-colors">
        My Orders
      </Link>
      <button
        onClick={() => { onClose(); logout() }}
        className="text-left py-2.5 pl-2 label-md text-destructive hover:opacity-80 transition-opacity"
      >
        Logout
      </button>
    </div>
  )
}

/* ────────────────────────────────────────────────
   Main Header component
   ──────────────────────────────────────────────── */
export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { loading: authLoading } = useAuth()

  const isHomePage = pathname === "/"
  const isSolid = scrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
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
        {/* Announcement bar */}
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
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
              <img
                src="/images/logo-black.svg"
                alt="Drapperr Drift"
                className={cn(
                  "h-8 w-auto transition-all duration-300",
                  !isSolid ? "brightness-0 invert drop-shadow-md" : "brightness-100"
                )}
              />
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-x-2">
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
                  {count > 0 && (
                    <span className={cn(
                      "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shadow-sm",
                      !isSolid ? "bg-white text-primary" : "bg-primary text-white"
                    )}>
                      {count}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Auth: Login/Signup or Avatar Dropdown */}
              {!authLoading && (
                <UserDropdown isSolid={isSolid} />
              )}
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

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
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
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                        {count}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>

              {/* Mobile Auth section */}
              <MobileAuthSection onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
