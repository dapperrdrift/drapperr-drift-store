"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items: cartItems, updateQty, removeItem, total: subtotal, count: itemCount, loading } = useCart()

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQty(id, quantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mt-6 headline-lg text-foreground">Your cart is empty</h1>
          <p className="mt-2 body-lg text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary-hover">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-34 pt-8 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="display-md text-foreground">Shopping Cart</h1>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 body-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="border-t border-border">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        {/* Cart summary */}
        <div className="lg:sticky lg:top-header-offset lg:h-fit">
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
        </div>
      </div>

      <div className="fixed bottom-18 left-1/2 z-30 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 rounded-xl border border-border bg-surface-container-low p-3 shadow-lg md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="title-md text-foreground">Rs. {subtotal.toLocaleString("en-IN")}</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
