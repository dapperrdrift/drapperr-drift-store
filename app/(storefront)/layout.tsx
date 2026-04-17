import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { AOSInit } from "@/components/layout/aos-init"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { WishlistProvider } from "@/contexts/wishlist-context"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AOSInit />
          <div className="flex min-h-screen flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-header md:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}
