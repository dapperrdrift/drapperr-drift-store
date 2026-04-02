"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Check, CreditCard, MapPin, Shield } from "lucide-react"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Declare the Razorpay global injected by the script
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type CheckoutStep = "shipping" | "payment" | "confirmation"

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

/** Dynamically loads the Razorpay checkout SDK script */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { items: cartItems, total: cartTotal, loading: cartLoading } = useCart()
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; couponId: string; discountAmount: number } | null>(null)
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null)

  if (cartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const subtotal = cartTotal
  const discount = appliedCoupon?.discountAmount || 0
  const shipping = subtotal >= 5000 ? 0 : 299
  const total = subtotal - discount + shipping

  const handleApplyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: subtotal }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Invalid coupon")
      }
      const data = await res.json()
      setAppliedCoupon({
        code: data.code,
        couponId: data.couponId,
        discountAmount: data.discountAmount
      })
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setCurrentStep("payment")
  }

  const handlePayment = async () => {
    if (!shippingAddress) return
    setIsProcessing(true)

    try {
      // 1. Load the Razorpay SDK
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        alert("Failed to load Razorpay. Please check your internet connection and try again.")
        setIsProcessing(false)
        return
      }

      // 2. Create a Razorpay order on the server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cartItems, 
          shippingAddress,
          couponId: appliedCoupon?.couponId
        }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json()
        alert(errData.error || "Could not initiate payment. Please try again.")
        setIsProcessing(false)
        return
      }

      const { orderId, amount: orderAmount, currency, keyId, dbOrderId } = await orderRes.json()
      setConfirmedOrderId(dbOrderId)

      // 3. Open the Razorpay checkout modal
      const options = {
        key: keyId,
        amount: orderAmount, // in paise
        currency,
        name: "Drapperr Drift",
        description: `Order #DD${Date.now().toString().slice(-8)}`,
        order_id: orderId,
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        notes: {
          shipping_address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}`,
        },
        theme: {
          color: "#1a1a1a",
        },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // 4. Verify the payment on the server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyRes.ok) {
            setCurrentStep("confirmation")
          } else {
            const errData = await verifyRes.json()
            alert(errData.error || "Payment verification failed. Please contact support.")
          }
          setIsProcessing(false)
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Payment error:", err)
      alert("An unexpected error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  const steps = [
    { id: "shipping", name: "Shipping", icon: MapPin },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "confirmation", name: "Confirmation", icon: Check },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="display-md text-foreground">
          DRAPPERR
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 body-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      {/* Progress steps */}
      <div className="mt-8 flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted =
            (currentStep === "payment" && step.id === "shipping") ||
            (currentStep === "confirmation" && (step.id === "shipping" || step.id === "payment"))

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "border-2 border-foreground text-foreground"
                      : "border border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "hidden sm:block label-md",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-[2px] w-12 sm:w-24",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        {/* Main content */}
        <div className="lg:col-span-3">
          {currentStep === "shipping" && (
            <ShippingForm onSubmit={handleShippingSubmit} />
          )}

          {currentStep === "payment" && shippingAddress && (
            <div className="space-y-6">
              <h2 className="headline-md text-foreground">Review &amp; Pay</h2>

              {/* Shipping address summary */}
              <div className="border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="label-md text-foreground">Shipping Address</span>
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="body-md text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="mt-2 body-md text-muted-foreground">
                  {shippingAddress.firstName} {shippingAddress.lastName}<br />
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}<br />
                  {shippingAddress.phone}
                </p>
              </div>

              {/* Payment info */}
              <div className="border border-border p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="label-md text-foreground">Secure Payment via Razorpay</span>
                </div>
                <p className="mt-2 body-md text-muted-foreground">
                  A Razorpay checkout window will open to complete your payment securely.
                  We accept UPI, cards, net banking, and wallets.
                </p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-6 label-md bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Opening Payment Gateway...
                  </span>
                ) : (
                  `Pay ₹${total.toLocaleString("en-IN")}`
                )}
              </Button>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                <Check className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="mt-6 headline-lg text-foreground">Order Confirmed!</h2>
              <p className="mt-2 body-lg text-muted-foreground">
                Thank you for your order. We&apos;ll send you an email confirmation shortly.
              </p>
              <p className="mt-4 title-md text-foreground">
                Order ID: {confirmedOrderId || "Processing..."}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  <Link href="/orders">View Order</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 lg:h-fit">
          <OrderSummary
            items={cartItems.map(item => ({
              ...item,
              image: item.image || "/images/placeholder.jpg"
            }))}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            onApplyCoupon={handleApplyCoupon}
            appliedCouponCode={appliedCoupon?.code}
          />
        </div>
      </div>
    </div>
  )
}
