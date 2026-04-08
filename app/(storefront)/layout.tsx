import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-header">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}
