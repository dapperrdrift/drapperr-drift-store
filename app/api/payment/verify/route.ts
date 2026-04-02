import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      )
    }

    // 1. Verify the signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex")

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // 2. Update Supabase
    const supabase = await createClient()

    // Find the payment record associated with this Razorpay order
    const { data: payment, error: paymentFetchError } = await supabase
      .from("payments")
      .select("order_id, id")
      .eq("razorpay_order_id", razorpay_order_id)
      .single()

    if (paymentFetchError || !payment) {
      console.error("Payment record not found for verification:", razorpay_order_id)
      return NextResponse.json({ error: "Order record not found" }, { status: 404 })
    }

    // Update payment record
    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        razorpay_payment_id: razorpay_payment_id,
        method: "razorpay" // or whatever method is used, but razorpay is the proxy
      })
      .eq("id", payment.id)

    if (paymentUpdateError) {
      console.error("Failed to update payment status:", paymentUpdateError)
    }

    // Update order status to 'placed'
    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: "placed" })
      .eq("id", payment.order_id)

    if (orderUpdateError) {
      console.error("Failed to update order status:", orderUpdateError)
    }

    // 3. Deduct stock via RPC
    const { error: rpcError } = await supabase.rpc("deduct_stock_for_order", {
      p_order_id: payment.order_id
    })

    if (rpcError) {
      console.error("Failed to deduct stock:", rpcError)
    }

    // 4. Update coupon usage if applicable
    const { data: order } = await supabase
      .from("orders")
      .select("coupon_id")
      .eq("id", payment.order_id)
      .single()

    if (order?.coupon_id) {
      await supabase.rpc('increment_coupon_usage', { p_coupon_id: order.coupon_id })
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    })
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

