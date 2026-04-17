"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Check, CreditCard, MapPin, Shield } from "lucide-react"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

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

interface SavedAddress {
  id: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  is_default: boolean | null
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
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; couponId: string; discountAmount: number } | null>(null)
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    let isCancelled = false

    const fetchSavedAddresses = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user
      if (!user) return
      setUserEmail(user.email ?? "")

      const { data } = await supabase
        .from("addresses")
        .select("id, first_name, last_name, phone, address, city, state, pincode, is_default")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (!isCancelled && data) {
        setSavedAddresses(data as SavedAddress[])
        if (data.length > 0) {
          const defaultAddress = (data as SavedAddress[]).find((address) => address.is_default) ?? data[0]
          setSelectedAddressId(defaultAddress.id)
        }
        setShowNewAddressForm(data.length === 0)
      }
    }

    fetchSavedAddresses()

    return () => {
      isCancelled = true
    }
  }, [supabase])

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
      const normalizedCode = code.trim().toUpperCase()
      if (!normalizedCode) {
        throw new Error("Coupon code is required")
      }

      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode, amount: subtotal }),
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

  const handleShippingSubmit = async (address: ShippingAddress) => {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    if (user) {
      const { data: existing } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .eq("first_name", address.firstName)
        .eq("last_name", address.lastName)
        .eq("phone", address.phone)
        .eq("address", address.address)
        .eq("city", address.city)
        .eq("state", address.state)
        .eq("pincode", address.pincode)
        .maybeSingle()

      if (!existing) {
        const { data: inserted } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            first_name: address.firstName,
            last_name: address.lastName,
            phone: address.phone,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            type: "home",
            is_default: savedAddresses.length === 0,
          })
          .select("id, first_name, last_name, phone, address, city, state, pincode, is_default")
          .single()

        if (inserted) {
          setSavedAddresses((prev) => [inserted as SavedAddress, ...prev])
        }
      }
    }

    setShippingAddress(address)
    setCurrentStep("payment")
  }

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setShippingAddress({
      firstName: address.first_name,
      lastName: address.last_name,
      email: userEmail,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    })
    setSelectedAddressId(address.id)
  }

  const handleDeliverToSelectedAddress = () => {
    if (!shippingAddress) return
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
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-wide text-foreground sm:display-md">
          DRAPPERR
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 body-md text-muted-foreground transition-colors hover:text-foreground sm:gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Cart</span>
          <span className="sm:hidden">Cart</span>
        </Link>
      </div>

      {/* Progress steps */}
      <div className="no-scrollbar sticky top-header-offset z-20 mt-6 flex items-center justify-start overflow-x-auto border-y border-border bg-background/95 px-1 py-3 backdrop-blur-sm sm:justify-center lg:static lg:mt-8 lg:justify-center lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
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
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "border-2 border-foreground text-foreground"
                      : "border border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "hidden md:block label-md",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 sm:mx-4 sm:w-24",
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
            <div className="space-y-6">
              {savedAddresses.length > 0 && (
                <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="headline-md text-foreground">Saved Addresses</h2>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm((prev) => !prev)}
                      className="body-md text-primary hover:underline"
                    >
                      {showNewAddressForm ? "Hide New Address Form" : "Use New Address"}
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {savedAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={cn(
                          "rounded-md border bg-background p-4 transition-colors",
                          selectedAddressId === address.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="title-md text-foreground">{address.first_name} {address.last_name}</p>
                            <p className="body-md text-muted-foreground mt-1">{address.address}</p>
                            <p className="body-md text-muted-foreground">{address.city}, {address.state} {address.pincode}</p>
                            <p className="body-md text-muted-foreground">{address.phone}</p>
                          </div>
                          {address.is_default && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          <Button
                            type="button"
                            variant={selectedAddressId === address.id ? "default" : "outline"}
                            size="sm"
                            className="label-md w-full sm:w-auto"
                            onClick={() => handleSelectSavedAddress(address)}
                          >
                            {selectedAddressId === address.id ? "Selected" : "Select"}
                          </Button>
                          {selectedAddressId === address.id && (
                            <Button
                              type="button"
                              size="sm"
                              className="label-md w-full bg-primary text-primary-foreground hover:bg-primary-hover sm:w-auto"
                              onClick={handleDeliverToSelectedAddress}
                            >
                              Deliver Here
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(showNewAddressForm || savedAddresses.length === 0) && (
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  initialData={shippingAddress || undefined}
                />
              )}
            </div>
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
