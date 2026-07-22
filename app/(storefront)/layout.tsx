import { AOSInit } from "@/components/layout/aos-init"
import { StorefrontChrome } from "@/components/layout/storefront-chrome"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

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
          <StorefrontChrome>{children}</StorefrontChrome>
          <Toaster />
          <SonnerToaster position="top-center" richColors closeButton />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}
