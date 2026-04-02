import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

// We use the same business logic as the verify route for paid orders
async function handleOrderPaid(order_id: string, payment_id: string) {
  const supabase = await createClient()

  // 1. Find the order through the payment record
  const { data: payment } = await supabase
    .from("payments")
    .select("order_id, status")
    .eq("razorpay_order_id", order_id)
    .single()

  if (!payment) return

  // Idempotency: skip if already completed
  if (payment.status === "completed") return

  // 2. Update payment and order records
  await supabase
    .from("payments")
    .update({ 
      status: "completed", 
      razorpay_payment_id: payment_id 
    })
    .eq("razorpay_order_id", order_id)

  await supabase
    .from("orders")
    .update({ status: "placed" })
    .eq("id", payment.order_id)

  // 3. Trigger stock deduction
  await supabase.rpc("deduct_stock_for_order", {
    p_order_id: payment.order_id
  })

  // 4. Update coupon usage
  const { data: order } = await supabase
    .from("orders")
    .select("coupon_id")
    .eq("id", payment.order_id)
    .single()

  if (order?.coupon_id) {
    await supabase.rpc('increment_coupon_usage', { p_coupon_id: order.coupon_id })
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

    if (event === "order.paid") {
      const order_id = eventData.payload.order.entity.id
      const payment_id = eventData.payload.payment.entity.id
      await handleOrderPaid(order_id, payment_id)
      console.log(`Order ${order_id} marked as paid via webhook`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
