import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

function mapShiprocketStatus(status: string): OrderStatus | null {
  const s = status.toLowerCase()
  if (s === "pending" || s === "pickup scheduled") return "confirmed"
  if (s === "pickup generated" || s === "pickup queued" || s === "in transit") return "processing"
  if (s === "dispatched" || s === "shipped") return "shipped"
  if (s === "out for delivery") return "out_for_delivery"
  if (s === "delivered") return "delivered"
  if (s === "cancelled" || s.startsWith("rto")) return "cancelled"
  return null
}

const NOTIFICATION_MESSAGES: Record<OrderStatus, { title: string; body: string } | null> = {
  placed: null,
  confirmed: {
    title: "Order Confirmed",
    body: "Your order has been confirmed and pickup is being scheduled.",
  },
  processing: {
    title: "Order Picked Up",
    body: "Your order has been picked up and is now in transit.",
  },
  shipped: {
    title: "Order Shipped",
    body: "Your order has been dispatched. Track it using the AWB number in your order details.",
  },
  out_for_delivery: {
    title: "Out for Delivery",
    body: "Your order is out for delivery today! Please be available to receive it.",
  },
  delivered: {
    title: "Order Delivered",
    body: "Your order has been delivered. We hope you love your new purchase!",
  },
  cancelled: {
    title: "Order Cancelled",
    body: "Your order has been cancelled. Please contact support if this was unexpected.",
  },
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validate secret token
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")

    if (!secret || secret !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse payload
    const payload = await req.json() as {
      awb?: number | string
      current_status: string
      order_id?: string
      channel_order_id?: string
      courier_name?: string
      current_status_id?: number
    }

    const { awb, current_status, channel_order_id, courier_name } = payload

    // channel_order_id is our Supabase order UUID passed when creating the Shiprocket order
    if (!channel_order_id) {
      console.warn("Shiprocket webhook received without channel_order_id:", payload)
      // Return 200 to prevent Shiprocket from retrying endlessly
      return NextResponse.json({ received: true })
    }

    // 3. Map Shiprocket status to our order_status enum
    const newStatus = mapShiprocketStatus(current_status)

    const adminDb = createAdminClient()

    // 4. Fetch current order to get user_id for notification
    const { data: existingOrder } = await adminDb
      .from("orders")
      .select("id, user_id, status")
      .eq("id", channel_order_id)
      .single()

    if (!existingOrder) {
      console.warn(`Shiprocket webhook: order ${channel_order_id} not found in DB`)
      return NextResponse.json({ received: true })
    }

    // 5. Build and apply DB update
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (awb) updatePayload.tracking_id = String(awb)
    if (courier_name) updatePayload.carrier_name = courier_name
    if (newStatus) updatePayload.status = newStatus

    const { error: updateError } = await adminDb
      .from("orders")
      .update(updatePayload)
      .eq("id", channel_order_id)

    if (updateError) {
      console.error("Failed to update order from Shiprocket webhook:", updateError)
    }

    // 6. Send notification to user if status changed and we have a message for it
    if (existingOrder.user_id && newStatus) {
      const msg = NOTIFICATION_MESSAGES[newStatus]
      // Override shipped message to include carrier name if available
      const body =
        newStatus === "shipped" && courier_name
          ? `Your order has been dispatched via ${courier_name}. Track it using the AWB number in your order details.`
          : msg?.body

      if (msg && body) {
        const { error: notifError } = await adminDb
          .from("notifications")
          .insert({
            recipient_id: existingOrder.user_id,
            type: "order_update",
            title: msg.title,
            body,
          })

        if (notifError) {
          console.error("Failed to insert notification:", notifError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Shiprocket webhook error:", error)
    // Return 200 even on error to prevent Shiprocket from retrying on server errors
    return NextResponse.json({ received: true })
  }
}
