"use client"

import { useState } from "react"
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock order data for demo
const mockOrderData = {
  orderId: "ORD-2024-001234",
  status: "in-transit",
  placedDate: "March 20, 2024",
  estimatedDelivery: "March 27, 2024",
  items: [
    { name: "Cashmere Knit Sweater", size: "M", quantity: 1, price: 12500 },
    { name: "Tailored Wool Blazer", size: "L", quantity: 1, price: 24500 },
  ],
  shippingAddress: {
    name: "Arjun Sharma",
    address: "42, Park Street",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
  },
  trackingSteps: [
    { status: "Order Placed", date: "March 20, 2024, 10:30 AM", completed: true },
    { status: "Order Confirmed", date: "March 20, 2024, 11:00 AM", completed: true },
    { status: "Shipped", date: "March 21, 2024, 2:15 PM", completed: true },
    { status: "In Transit", date: "March 23, 2024, 9:00 AM", completed: true, current: true },
    { status: "Out for Delivery", date: "Expected March 27", completed: false },
    { status: "Delivered", date: "", completed: false },
  ],
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [orderData, setOrderData] = useState<typeof mockOrderData | null>(null)
  const [error, setError] = useState("")

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, show mock data if order number matches pattern
    if (orderNumber.toUpperCase().startsWith("ORD-")) {
      setOrderData({ ...mockOrderData, orderId: orderNumber.toUpperCase() })
    } else {
      setError("Order not found. Please check your order number and try again.")
      setOrderData(null)
    }

    setIsSearching(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "Order Confirmed":
        return CheckCircle
      case "Shipped":
      case "In Transit":
        return Truck
      case "Out for Delivery":
        return MapPin
      case "Delivered":
        return Package
      default:
        return Clock
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Track Your Order</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your order number and email to track your order status in real-time.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-lg border border-border p-6 sm:p-8 mb-12">
        <form onSubmit={handleTrackOrder} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="orderNumber" className="label-md text-foreground block mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                placeholder="e.g., ORD-2024-001234"
              />
            </div>
            <div>
              <label htmlFor="email" className="label-md text-foreground block mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-3"
          >
            {isSearching ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Track Order
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="body-md text-destructive">{error}</p>
          </div>
        )}
      </div>

      {/* Order Results */}
      {orderData && (
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="rounded-lg border border-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-border">
              <div>
                <p className="label-md text-muted-foreground mb-1">Order Number</p>
                <p className="title-lg text-foreground">{orderData.orderId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                  <Truck className="h-4 w-4" />
                  <span className="label-md">In Transit</span>
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="label-md text-muted-foreground mb-1">Order Placed</p>
                <p className="body-md text-foreground">{orderData.placedDate}</p>
              </div>
              <div>
                <p className="label-md text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="body-md text-foreground font-medium">{orderData.estimatedDelivery}</p>
              </div>
              <div>
                <p className="label-md text-muted-foreground mb-1">Shipping To</p>
                <p className="body-md text-foreground">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="headline-sm text-foreground mb-6">Tracking Updates</h2>
            <div className="relative">
              {orderData.trackingSteps.map((step, index) => {
                const Icon = getStatusIcon(step.status)
                const isLast = index === orderData.trackingSteps.length - 1
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          step.completed
                            ? step.current
                              ? "bg-primary text-primary-foreground"
                              : "bg-green-100 text-green-600"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "w-0.5 h-16",
                            step.completed ? "bg-green-200" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                    <div className="pb-8">
                      <p
                        className={cn(
                          "title-md mb-1",
                          step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="body-md text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="headline-sm text-foreground mb-6">Order Items</h2>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div>
                    <p className="title-md text-foreground">{item.name}</p>
                    <p className="body-md text-muted-foreground">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="title-md text-foreground">Rs. {item.price.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="headline-sm text-foreground mb-4">Shipping Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="title-md text-foreground">{orderData.shippingAddress.name}</p>
                <p className="body-md text-muted-foreground">
                  {orderData.shippingAddress.address}<br />
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      {!orderData && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-surface-container-low p-6">
            <h3 className="title-lg text-foreground mb-2">Where&apos;s my order number?</h3>
            <p className="body-md text-muted-foreground">
              Your order number was sent to your email when you placed your order. It starts with &quot;ORD-&quot; followed by the year and a unique number.
            </p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-6">
            <h3 className="title-lg text-foreground mb-2">Already have an account?</h3>
            <p className="body-md text-muted-foreground mb-4">
              Sign in to view all your orders and tracking information in one place.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center text-primary label-md hover:underline"
            >
              Go to My Account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
