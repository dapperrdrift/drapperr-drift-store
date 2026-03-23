import Link from "next/link"
import { Instagram, Twitter, Facebook } from "lucide-react"

const footerNavigation = {
  shop: [
    { name: "New Arrivals", href: "/products?filter=new" },
    { name: "Best Sellers", href: "/products?filter=bestsellers" },
    { name: "Men", href: "/products?category=men" },
    { name: "Women", href: "/products?category=women" },
    { name: "Sale", href: "/products?filter=sale" },
  ],
  help: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping & Returns", href: "/shipping-returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Track Order", href: "/orders" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Facebook", href: "#", icon: Facebook },
]

export function Footer() {
  return (
    <footer className="bg-surface-container-low">
      {/* Newsletter section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h3 className="headline-lg text-foreground">Join the Inner Circle</h3>
            <p className="mt-2 body-lg text-muted-foreground max-w-md">
              Be the first to know about new collections, exclusive offers, and style inspiration.
            </p>
            <form className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border-b border-input bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-primary px-8 py-3 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="label-md text-foreground">Shop</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-foreground"
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
                    className="body-md text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-md text-foreground">Company</h4>
            <ul className="mt-4 space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="body-md text-muted-foreground transition-colors hover:text-foreground"
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
                    className="body-md text-muted-foreground transition-colors hover:text-foreground"
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
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
            <p className="body-md text-muted-foreground">
              &copy; {new Date().getFullYear()} Drapperr Drift. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
