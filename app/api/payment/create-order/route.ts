import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

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
      .select("id, price_override, products(base_price)")
      .in("id", variantIds)

    if (variantsError || !variants) {
      return NextResponse.json({ error: "Failed to fetch product prices" }, { status: 500 })
    }

    const priceMap = new Map(
      variants.map((v: any) => [v.id, v.price_override ?? v.products?.base_price ?? 0])
    )

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

    let shippingFee = 99
    if (subtotal >= 5000) {
      shippingFee = 0
    } else if (subtotal <= 800) {
      shippingFee = 169
    } else if (subtotal <= 1300) {
      shippingFee = 129
    }
    const totalAmount = subtotal - discountAmount + shippingFee

    // 2. Create Razorpay order first (no DB order yet — only created once payment is verified)
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
        receipt: `checkout_${Date.now()}`.slice(0, 40),
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

    // 3. Stash everything needed to build the real order once payment succeeds.
    // Order/order_items are intentionally NOT created here — if the user abandons
    // or fails payment, nothing is left behind in the orders table.
    const checkoutPayload = {
      user_id: user.id,
      items: items.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: priceMap.get(item.variant_id) as number,
      })),
      shipping_address: shippingAddress,
      coupon_id: couponId || null,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
    }

    const { error: paymentError } = await adminDb
      .from("payments")
      .insert({
        order_id: null,
        razorpay_order_id: razorpayOrder.id,
        amount: totalAmount,
        status: "pending",
        checkout_payload: checkoutPayload,
      })

    if (paymentError) {
      console.error("Supabase payment creation error:", paymentError)
      return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    })

  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
