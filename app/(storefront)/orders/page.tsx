"use client"

import { useEffect, useState } from "react"
import { Package, ChevronRight, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-yellow-100 text-yellow-800",
  payment_pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?next=/orders")
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          discount_amount,
          shipping_fee,
          created_at,
          order_items (
            quantity,
            unit_price,
            products (
              name,
              images
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="display-sm text-foreground">My Orders</h1>
          <p className="body-md text-muted-foreground mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/account">← Account</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-xl border border-dashed border-border">
          <ShoppingBag className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
          <h2 className="headline-md text-foreground mb-2">No orders yet</h2>
          <p className="body-lg text-muted-foreground mb-6">
            When you place an order, it will appear here.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const firstItem = order.order_items?.[0]
            const itemCount = order.order_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0
            const statusLabel = (order.status ?? "processing").replace(/_/g, " ")
            const statusClass = STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"

            return (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-background hover:shadow-md transition-shadow"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border">
                  <div className="flex gap-4 items-center">
                    {/* First item thumbnail */}
                    {firstItem?.products?.images?.[0] ? (
                      <div className="relative h-16 w-14 rounded overflow-hidden flex-shrink-0 bg-surface-container-low border border-border">
                        <Image
                          src={firstItem.products.images[0]}
                          alt={firstItem.products.name ?? "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-14 rounded bg-surface-container-low border border-border flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="label-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="title-md text-foreground mt-0.5">
                        {firstItem?.products?.name ?? "Order"}
                        {itemCount > 1 && (
                          <span className="text-muted-foreground font-normal"> +{itemCount - 1} more</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize", statusClass)}>
                      {statusLabel}
                    </span>
                    <p className="title-md text-foreground">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 flex items-center justify-between">
                  <p className="body-sm text-muted-foreground font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 label-sm text-primary hover:underline"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
