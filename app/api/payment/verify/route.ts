import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createShiprocketOrder } from "@/lib/shiprocket"
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

    // 2. Look up the pending payment/checkout payload created before the Razorpay modal opened
    const adminDb = createAdminClient()

    const { data: payment, error: paymentFetchError } = await adminDb
      .from("payments")
      .select("id, order_id, status, checkout_payload")
      .eq("razorpay_order_id", razorpay_order_id)
      .single()

    if (paymentFetchError || !payment) {
      console.error("Payment record not found for verification:", razorpay_order_id, paymentFetchError)
      return NextResponse.json({ error: "Order record not found" }, { status: 404 })
    }

    // Idempotency: if this payment was already verified (e.g. handler fired twice), just return the existing order.
    if (payment.status === "completed" && payment.order_id) {
      return NextResponse.json({
        verified: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        dbOrderId: payment.order_id,
      })
    }

    // Claim this payment for processing so a concurrent webhook call can't also create an order for it.
    const { data: claimed } = await adminDb
      .from("payments")
      .update({ status: "processing" })
      .eq("id", payment.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle()

    if (!claimed) {
      // Someone else (the webhook) is already handling this payment — poll briefly for the resulting order.
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 1000))
        const { data: recheck } = await adminDb
          .from("payments")
          .select("order_id, status")
          .eq("id", payment.id)
          .single()
        if (recheck?.status === "completed" && recheck.order_id) {
          return NextResponse.json({
            verified: true,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            dbOrderId: recheck.order_id,
          })
        }
      }
      return NextResponse.json({ error: "Payment is still being processed, please check your orders shortly" }, { status: 409 })
    }

    const payload = payment.checkout_payload as {
      user_id: string
      items: { variant_id: string; quantity: number; unit_price: number }[]
      shipping_address: Record<string, string>
      coupon_id: string | null
      discount_amount: number
      shipping_fee: number
      total_amount: number
    } | null

    if (!payload) {
      console.error("Missing checkout payload for payment:", payment.id)
      return NextResponse.json({ error: "Order data missing, please contact support" }, { status: 500 })
    }

    // 3. Only now do we create the real order — payment is verified, so it's safe to materialize.
    const { data: order, error: orderError } = await adminDb
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
      console.error("Failed to create order after payment verification:", orderError)
      return NextResponse.json({ error: "Payment verified but order creation failed. Please contact support." }, { status: 500 })
    }

    const orderItems = payload.items.map((item) => ({
      order_id: order.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await adminDb
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Failed to create order items after payment verification:", itemsError)
    }

    // Link the payment to the newly created order and mark it completed
    const { error: paymentUpdateError } = await adminDb
      .from("payments")
      .update({
        order_id: order.id,
        status: "completed",
        razorpay_payment_id: razorpay_payment_id,
        method: "razorpay"
      })
      .eq("id", payment.id)

    if (paymentUpdateError) {
      console.error("Failed to update payment status:", paymentUpdateError)
    }

    // 4. Deduct stock via RPC
    const { error: rpcError } = await adminDb.rpc("deduct_stock_for_order", {
      p_order_id: order.id
    })

    if (rpcError) {
      console.error("Failed to deduct stock:", rpcError)
    }

    // 5. Update coupon usage if applicable
    if (payload.coupon_id) {
      await adminDb.rpc('increment_coupon_usage', { p_coupon_id: payload.coupon_id })
    }

    // 6. Push order to Shiprocket (non-fatal — payment is already confirmed)
    try {
      const { data: fullOrder } = await adminDb
        .from("orders")
        .select(`
          id, created_at, total_amount, shipping_fee, shipping_address, user_id,
          order_items (
            quantity, unit_price,
            variants ( sku, products ( name ) )
          )
        `)
        .eq("id", order.id)
        .single()

      if (fullOrder) {
        const addr = fullOrder.shipping_address as {
          firstName: string
          lastName: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          pincode: string
        }

        const orderDate = new Date(fullOrder.created_at)
          .toISOString()
          .replace("T", " ")
          .slice(0, 16) // "YYYY-MM-DD HH:MM"

        type OrderItemRow = { quantity: number; unit_price: number; variants: { sku: string; products: { name: string } } }
        const srItems = (fullOrder.order_items as OrderItemRow[]).map((item) => ({
          name: item.variants.products.name,
          sku: item.variants.sku,
          units: item.quantity,
          selling_price: item.unit_price,
        }))

        const srResult = await createShiprocketOrder({
          order_id: fullOrder.id,
          order_date: orderDate,
          pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary",
          billing_customer_name: addr.firstName,
          billing_last_name: addr.lastName,
          billing_address: addr.address,
          billing_city: addr.city,
          billing_pincode: addr.pincode,
          billing_state: addr.state,
          billing_country: "India",
          billing_email: addr.email,
          billing_phone: addr.phone,
          shipping_is_billing: true,
          order_items: srItems,
          payment_method: "Prepaid",
          sub_total: fullOrder.total_amount - fullOrder.shipping_fee,
          length: 30,
          breadth: 25,
          height: 5,
          weight: 0.5,
        })

        await adminDb
          .from("orders")
          .update({
            shiprocket_order_id: String(srResult.order_id),
            shiprocket_shipment_id: String(srResult.shipment_id),
          })
          .eq("id", fullOrder.id)
      }
    } catch (srError) {
      console.error("Shiprocket order push failed (non-fatal):", srError)
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      dbOrderId: order.id,
    })
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
