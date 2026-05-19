"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Instagram } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

const footerNavigation = {
  shop: [
    { name: "New Arrivals", href: "/products?filter=new" },
    { name: "Best Sellers", href: "/products?filter=bestsellers" },
    { name: "About Us", href: "/about" },
  ],
  help: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping & Returns", href: "/shipping-returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Track Order", href: "/orders" },
  ],
  categories: [
    { name: "T-Shirts", href: "/products?category=t-shirts" },
    { name: "Hoodies", href: "/products?category=hoodies" },
    { name: "Denim", href: "/products?category=denim" },
    { name: "Accessories", href: "/products?category=accessories" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/dapperr.drift", icon: Instagram },
  // { name: "Twitter", href: "#", icon: Twitter },
  // { name: "Facebook", href: "#", icon: Facebook },
]

export function Footer() {
  const pathname = usePathname()
  const showNewsletter = pathname === "/"
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("newsletter_subscribers").insert({ email })
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed", description: "This email is already on the list." })
        } else {
          throw error
        }
      } else {
        toast({ title: "You're in!", description: "Thanks for subscribing to Dapperr Drift." })
        setEmail("")
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" })
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="bg-surface-container-low">
      {showNewsletter && (
        <div className="hidden md:block border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="headline-lg text-foreground">Join the Inner Circle</h3>
              <p className="mt-2 body-lg text-muted-foreground max-w-md">
                Be the first to know about new collections, exclusive offers, and style inspiration.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-input bg-transparent px-4 py-3 rounded-md body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-primary px-8 py-3 rounded-md label-md text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {subscribing ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden bg-surface-container-lowest px-6 pt-12 pb-8 text-center">
        <div className="text-xl font-bold uppercase tracking-wider text-foreground">Dapperr Drift</div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">
          <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="/shipping-returns" className="transition-colors hover:text-foreground">Shipping</Link>
          <Link href="https://www.instagram.com/dapperr.drift" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Instagram</Link>
        </div>
        <p className="mt-6 text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
          &copy; {new Date().getFullYear()} Dapperr. Est 2021.
        </p>
      </div>

      {/* Links section */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <img
                src="/images/logo-black.svg"
                alt="Dapperr Drift — Streetwear Brand in Kota, Rajasthan"
                className="h-8 w-auto grayscale brightness-0 opacity-80"
              />
            </Link>
            <p className="mt-4 body-md text-muted-foreground mr-4">
              Redefining contemporary elegance through high fashion pieces. CURATED. TIMELESS. BOLD.
            </p>
          </div>
          <div>
            <h4 className="label-md text-foreground">Shop</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-md text-foreground">Help</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.help.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-md text-foreground">Categories</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-md text-foreground">Legal</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hidden md:block border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`Follow Dapperr Drift on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
            <p className="body-md text-muted-foreground">
              &copy; {new Date().getFullYear()} Dapperr Drift. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
