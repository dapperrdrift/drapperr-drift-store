import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

interface CartItem {
  variant_id: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const { items, shippingAddress, couponId }: { items: CartItem[]; shippingAddress: Record<string, string>; couponId?: string } = await req.json()

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // Use user client only to authenticate; use admin client for DB writes to bypass RLS
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      console.error("Razorpay keys are not configured")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    const adminDb = createAdminClient()

    // 1. Re-fetch prices from DB to prevent client-side price manipulation
    const variantIds: string[] = items.map((item) => item.variant_id)
    const { data: variants, error: variantsError } = await adminDb
      .from("variants")
      .select("id, price")
      .in("id", variantIds)

    if (variantsError || !variants) {
      return NextResponse.json({ error: "Failed to fetch product prices" }, { status: 500 })
    }

    const priceMap = new Map(variants.map((v: { id: string; price: number }) => [v.id, v.price]))

    let subtotal = 0
    for (const item of items) {
      const serverPrice = priceMap.get(item.variant_id)
      if (!serverPrice) {
        return NextResponse.json({ error: `Product variant ${item.variant_id} not found` }, { status: 400 })
      }
      subtotal += serverPrice * item.quantity
    }

    let discountAmount = 0
    if (couponId) {
      const { data: coupon } = await adminDb
        .from("coupons")
        .select("*")
        .eq("id", couponId)
        .eq("is_active", true)
        .single()
      
      if (coupon) {
        if (coupon.discount_type === "flat") {
          discountAmount = coupon.discount_value
        } else if (coupon.discount_type === "percentage") {
          discountAmount = (subtotal * coupon.discount_value) / 100
        }
      }
    }

    const shippingFee = subtotal >= 5000 ? 0 : 299
    const totalAmount = subtotal - discountAmount + shippingFee

    // 2. Create order in Supabase (admin client bypasses RLS)
    const { data: order, error: orderError } = await adminDb
      .from("orders")
      .insert({
        user_id: user.id,
        status: "payment_pending",
        total_amount: totalAmount,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        shipping_address: shippingAddress,
        coupon_id: couponId || null
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Supabase order error:", orderError)
      return NextResponse.json({ error: "Failed to create order record" }, { status: 500 })
    }

    // 3. Create order items using server-side prices
    const orderItems = items.map((item) => {
      const serverPrice = priceMap.get(item.variant_id) as number
      return {
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: serverPrice,
        line_total: serverPrice * item.quantity,
      }
    })

    const { error: itemsError } = await adminDb
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Supabase order items error:", itemsError)
      // Note: We could delete the order here, but keeping it for audit is OK
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // 4. Create Razorpay order
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64")
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // paise
        currency: "INR",
        receipt: order.id.slice(0, 40),
      }),
    })

    if (!razorpayRes.ok) {
      const errorBody = await razorpayRes.json()
      console.error("Razorpay API error:", errorBody)
      return NextResponse.json(
        { error: errorBody?.error?.description || "Failed to create Razorpay order" },
        { status: razorpayRes.status }
      )
    }

    const razorpayOrder = await razorpayRes.json()

    // 5. Create payment record
    const { error: paymentError } = await adminDb
      .from("payments")
      .insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        amount: totalAmount,
        status: "pending"
      })

    if (paymentError) {
      console.error("Supabase payment creation error:", paymentError)
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      dbOrderId: order.id
    })

  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
