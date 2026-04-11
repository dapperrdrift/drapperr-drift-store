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

    // 2. Update Supabase using admin client to bypass RLS
    const adminDb = createAdminClient()

    // Find the payment record associated with this Razorpay order
    const { data: payment, error: paymentFetchError } = await adminDb
      .from("payments")
      .select("order_id, id")
      .eq("razorpay_order_id", razorpay_order_id)
      .single()

    if (paymentFetchError || !payment) {
      console.error("Payment record not found for verification:", razorpay_order_id, paymentFetchError)
      return NextResponse.json({ error: "Order record not found" }, { status: 404 })
    }

    // Update payment record
    const { error: paymentUpdateError } = await adminDb
      .from("payments")
      .update({
        status: "completed",
        razorpay_payment_id: razorpay_payment_id,
        method: "razorpay"
      })
      .eq("id", payment.id)

    if (paymentUpdateError) {
      console.error("Failed to update payment status:", paymentUpdateError)
    }

    // Update order status to 'placed'
    const { error: orderUpdateError } = await adminDb
      .from("orders")
      .update({ status: "placed" })
      .eq("id", payment.order_id)

    if (orderUpdateError) {
      console.error("Failed to update order status:", orderUpdateError)
    }

    // 3. Deduct stock via RPC
    const { error: rpcError } = await adminDb.rpc("deduct_stock_for_order", {
      p_order_id: payment.order_id
    })

    if (rpcError) {
      console.error("Failed to deduct stock:", rpcError)
    }

    // 4. Update coupon usage if applicable
    const { data: order } = await adminDb
      .from("orders")
      .select("coupon_id")
      .eq("id", payment.order_id)
      .single()

    if (order?.coupon_id) {
      await adminDb.rpc('increment_coupon_usage', { p_coupon_id: order.coupon_id })
    }

    // 5. Push order to Shiprocket (non-fatal — payment is already confirmed)
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
        .eq("id", payment.order_id)
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

        const srItems = (fullOrder.order_items as any[]).map((item) => ({
          name: item.variants.products.name as string,
          sku: item.variants.sku as string,
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
          .update({ shiprocket_order_id: String(srResult.order_id) } as any)
          .eq("id", fullOrder.id)
      }
    } catch (srError) {
      console.error("Shiprocket order push failed (non-fatal):", srError)
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

