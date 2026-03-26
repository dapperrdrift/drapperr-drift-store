"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"

// Mock cart data - will be replaced with actual cart state
const initialCartItems = [
  {
    id: "cart-1",
    productId: "1",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    image: "/images/product-1.jpg",
    price: 12500,
    size: "M",
    color: "Cream",
    quantity: 1,
  },
  {
    id: "cart-2",
    productId: "2",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    image: "/images/product-2.jpg",
    price: 24500,
    size: "L",
    color: "Charcoal",
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
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
    </div>
  )
}
