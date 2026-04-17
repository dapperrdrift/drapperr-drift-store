"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronLeft, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function OrderDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getOrder() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      
      const { data: orderData, error } = await supabase
        .from("orders")
        .select(`
          *,
          payments (
            id,
            status,
            method,
            razorpay_payment_id,
            created_at
          ),
          order_items (
            *,
            variants (
              size,
              color,
              products (
                name,
                images,
                description
              )
            )
          )
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle()

      if (error || !orderData) {
        setLoading(false)
        return
      }

      setOrder(orderData)
      setLoading(false)
    }

    if (id) getOrder()
  }, [id, supabase, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
      case "payment_pending":
        return Clock
      case "shipped":
        return Truck
      case "delivered":
        return CheckCircle
      default:
        return Package
    }
  }

  const getStatusText = (status: string) => {
    return (status || "Processing").replace("_", " ").toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="headline-md text-foreground mb-4">Order Not Found</h1>
        <p className="body-lg text-muted-foreground mb-8">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Button asChild>
          <Link href="/account">Back to My Account</Link>
        </Button>
      </div>
    )
  }

  const paymentStatus = Array.isArray(order.payments)
    ? order.payments[0]?.status
    : order.payments?.status
  const paymentMethod = Array.isArray(order.payments)
    ? order.payments[0]?.method
    : order.payments?.method
  const isPaymentCompleted = paymentStatus === "completed"

  const trackingSteps = [
    { status: "Order Placed", completed: true, date: new Date(order.created_at).toLocaleString() },
    { status: "Payment Completed", completed: isPaymentCompleted, date: isPaymentCompleted ? "Verified" : "" },
    { status: "Shipped", completed: ["shipped", "delivered"].includes(order.status), date: "" },
    { status: "Delivered", completed: order.status === "delivered", date: "" },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:px-8">
      <Link 
        href="/orders"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto md:hidden">
        <Link
          href="/orders"
          className="shrink-0 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          Orders
        </Link>
        <Link
          href="/account"
          className="shrink-0 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Account
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="display-sm text-foreground mb-2">Order Detail</h1>
          <p className="no-scrollbar overflow-x-auto whitespace-nowrap body-md text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-border">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="label-md text-foreground capitalize">{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <section className="rounded-lg border border-border p-4 sm:p-6">
            <h2 className="headline-sm text-foreground mb-6">Order Items</h2>
            <div className="space-y-6">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex gap-3 sm:gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded border border-border bg-surface-container-lowest sm:h-24 sm:w-20">
                    <Image
                      src={item.variants?.products?.images?.[0] || "/images/placeholder.jpg"}
                      alt={item.variants?.products?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="title-md line-clamp-2 text-foreground">{item.variants?.products?.name || "Product"}</h3>
                    <p className="body-md text-muted-foreground">Size: {item.variants?.size || "-"} | Color: {item.variants?.color || "-"}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="body-md text-foreground">Qty: {item.quantity}</span>
                      <span className="title-md text-foreground">Rs. {Number(item.unit_price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tracking */}
          <section className="rounded-lg border border-border p-4 sm:p-6">
            <h2 className="headline-sm text-foreground mb-6">Order Timeline</h2>
            <div className="space-y-6">
              {trackingSteps.map((step, index) => {
                const Icon = getStatusIcon(step.status.toLowerCase().split(" ")[0])
                const isLast = index === trackingSteps.length - 1
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2",
                          step.completed ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"
                        )}
                      >
                        {step.completed ? <CheckCircle className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                      </div>
                      {!isLast && (
                        <div className={cn("w-0.5 h-12", step.completed ? "bg-primary" : "bg-border")} />
                      )}
                    </div>
                    <div>
                      <p className={cn("title-sm", step.completed ? "text-foreground" : "text-muted-foreground")}>
                        {step.status}
                      </p>
                      {step.date && <p className="body-xs text-muted-foreground">{step.date}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Shipping Address */}
          <section className="rounded-lg border border-border p-4 sm:p-6">
            <h2 className="headline-sm text-foreground mb-4">Shipping Info</h2>
            <div className="space-y-2 body-md text-muted-foreground">
              <p className="text-foreground font-medium">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
              <p className="pt-2">{order.shipping_address?.phone}</p>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="rounded-lg border border-border bg-surface-container-low p-4 sm:p-6">
            <h2 className="headline-sm text-foreground mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between body-md">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">Rs. {order.total_amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between body-md">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Free</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between title-md">
                <span className="text-foreground">Total</span>
                <span className="text-primary">Rs. {order.total_amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-6 p-3 rounded bg-surface text-center">
              <p className="body-xs text-muted-foreground">Paid via {paymentMethod ? String(paymentMethod).toUpperCase() : "Razorpay"}</p>
              <p className="body-xs font-mono text-muted-foreground">{isPaymentCompleted ? "Verified" : "Pending Verification"}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
