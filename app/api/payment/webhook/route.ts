import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensureRazorpayCaptured } from "@/lib/razorpay"
import crypto from "crypto"

// Webhooks have no user session — must use the admin client to bypass RLS
// This is a server-side fallback for the same flow as /api/payment/verify
// (in case the client never gets to call verify, e.g. tab closed right after paying).
// The DB order is only created here once payment is confirmed captured.
type CheckoutPayload = {
  user_id: string
  items: { variant_id: string; quantity: number; unit_price: number }[]
  shipping_address: Record<string, string>
  coupon_id: string | null
  discount_amount: number
  shipping_fee: number
  total_amount: number
}

async function handleOrderPaid(razorpay_order_id: string, payment_id: string) {
  const supabase = createAdminClient()

  // 1. Find the payment/checkout payload record
  const { data: payment } = await supabase
    .from("payments")
    .select("id, order_id, status, checkout_payload")
    .eq("razorpay_order_id", razorpay_order_id)
    .single()

  if (!payment) return

  // Idempotency: skip if already completed (e.g. client-side verify already handled it)
  if (payment.status === "completed" && payment.order_id) return

  // Claim this payment so a concurrent client-side verify call can't also create an order for it.
  const { data: claimed } = await supabase
    .from("payments")
    .update({ status: "processing" })
    .eq("id", payment.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle()

  if (!claimed) return // already being handled by /api/payment/verify

  const payload = payment.checkout_payload as CheckoutPayload | null

  if (!payload) {
    console.error("Webhook: missing checkout payload for payment", payment.id)
    await supabase.from("payments").update({ status: "pending" }).eq("id", payment.id)
    return
  }

  try {
    await ensureRazorpayCaptured(payment_id, payload.total_amount)
  } catch (captureError) {
    console.error("Webhook: Razorpay capture check failed:", captureError)
    await supabase.from("payments").update({ status: "pending" }).eq("id", payment.id)
    return
  }

  // 2. Create the real order now that payment is confirmed captured
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.user_id,
      status: "placed",
      total_amount: payload.total_amount,
      discount_amount: payload.discount_amount,
      shipping_fee: payload.shipping_fee,
      shipping_address: payload.shipping_address,
      coupon_id: payload.coupon_id,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error("Webhook: failed to create order", orderError)
    return
  }

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.unit_price * item.quantity,
  }))

  await supabase.from("order_items").insert(orderItems)

  // 3. Link payment to the order and mark it completed
  await supabase
    .from("payments")
    .update({
      order_id: order.id,
      status: "completed",
      razorpay_payment_id: payment_id,
      method: "razorpay",
    })
    .eq("id", payment.id)

  // 4. Trigger stock deduction
  await supabase.rpc("deduct_stock_for_order", {
    p_order_id: order.id
  })

  // 5. Update coupon usage
  if (payload.coupon_id) {
    await supabase.rpc('increment_coupon_usage', { p_coupon_id: payload.coupon_id })
  }
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature")
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: "No signature or secret provided" }, { status: 401 })
    }

    const payload = await req.text()
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
    }

    const eventData = JSON.parse(payload)
    const event = eventData.event

    console.log(`Razorpay Webhook event: ${event}`)

    if (event === "order.paid" || event === "payment.captured") {
      const order_id =
        eventData.payload?.order?.entity?.id ??
        eventData.payload?.payment?.entity?.order_id
      const payment_id = eventData.payload?.payment?.entity?.id
      if (order_id && payment_id) {
        await handleOrderPaid(order_id, payment_id)
        console.log(`Order ${order_id} marked as paid via webhook (${event})`)
      } else {
        console.error("Webhook missing order_id or payment_id:", event)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
