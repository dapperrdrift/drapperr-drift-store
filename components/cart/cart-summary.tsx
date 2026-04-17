"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shippingThreshold = 5000
  const shipping = subtotal >= shippingThreshold ? 0 : 299
  const discount = 0
  const total = subtotal - discount + shipping

  return (
    <div className="bg-surface-container-low p-5 sm:p-6 lg:p-8">
      <h2 className="headline-md text-foreground">Order Summary</h2>

      {/* Summary lines */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="body-md text-foreground">Rs. {subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Shipping</span>
          <span className="body-md text-foreground">
            {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>

        {shipping > 0 && (
          <p className="body-md rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            Add Rs. {(shippingThreshold - subtotal).toLocaleString("en-IN")} more for free shipping
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mt-6 flex justify-between border-t border-border pt-6">
        <span className="title-lg text-foreground">Total</span>
        <span className="title-lg text-foreground">Rs. {total.toLocaleString("en-IN")}</span>
      </div>

      {/* Checkout button */}
      <Button
        asChild
        className="mt-6 w-full py-6 label-md bg-primary text-primary-foreground hover:bg-primary-hover"
      >
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      {/* Additional info */}
      <div className="mt-6 space-y-2 text-center">
        <p className="body-md text-muted-foreground">
          Secure checkout powered by Razorpay
        </p>
        <p className="body-md text-muted-foreground">
          30-day easy returns
        </p>
      </div>
    </div>
  )
}
