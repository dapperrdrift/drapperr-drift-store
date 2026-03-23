"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  
  const shippingThreshold = 5000
  const shipping = subtotal >= shippingThreshold ? 0 : 299
  const discount = appliedCoupon ? subtotal * 0.1 : 0 // Mock 10% discount
  const total = subtotal - discount + shipping

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setAppliedCoupon(couponCode)
      setCouponError(null)
    } else {
      setCouponError("Invalid coupon code")
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError(null)
  }

  return (
    <div className="bg-surface-container-low p-6 lg:p-8">
      <h2 className="headline-md text-foreground">Order Summary</h2>

      {/* Coupon input */}
      <div className="mt-6">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-surface-container-lowest p-3">
            <div>
              <span className="label-md text-primary">{appliedCoupon}</span>
              <span className="ml-2 body-md text-muted-foreground">applied</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="body-md text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border-b border-input bg-transparent px-0 py-2 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
                className="label-md"
              >
                Apply
              </Button>
            </div>
            {couponError && (
              <p className="body-md text-destructive">{couponError}</p>
            )}
            <p className="body-md text-muted-foreground">
              Try: WELCOME10 for 10% off
            </p>
          </div>
        )}
      </div>

      {/* Summary lines */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="body-md text-foreground">Rs. {subtotal.toLocaleString("en-IN")}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="body-md text-primary">Discount</span>
            <span className="body-md text-primary">-Rs. {discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Shipping</span>
          <span className="body-md text-foreground">
            {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
        
        {shipping > 0 && (
          <p className="body-md text-muted-foreground">
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
