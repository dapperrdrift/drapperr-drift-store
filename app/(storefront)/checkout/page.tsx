"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Check, CreditCard, MapPin, Shield } from "lucide-react"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock cart data - will be replaced with actual cart state
const cartItems = [
  {
    id: "cart-1",
    name: "Cashmere Knit Sweater",
    image: "/images/product-1.jpg",
    price: 12500,
    size: "M",
    color: "Cream",
    quantity: 1,
  },
  {
    id: "cart-2",
    name: "Tailored Wool Blazer",
    image: "/images/product-2.jpg",
    price: 24500,
    size: "L",
    color: "Charcoal",
    quantity: 1,
  },
]

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
const discount = 0
const shipping = subtotal >= 5000 ? 0 : 299
const total = subtotal - discount + shipping

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

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setCurrentStep("payment")
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing - will be replaced with Razorpay integration
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setCurrentStep("confirmation")
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
              <h2 className="headline-md text-foreground">Review & Pay</h2>

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
                  You will be redirected to Razorpay&apos;s secure payment page to complete your purchase.
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
                    Processing...
                  </span>
                ) : (
                  `Pay Rs. ${total.toLocaleString("en-IN")}`
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
                Order #DD{Date.now().toString().slice(-8)}
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
            items={cartItems}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}
