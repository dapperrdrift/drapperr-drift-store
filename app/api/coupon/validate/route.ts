import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json()
    const normalizedCode = String(code ?? "").trim().toUpperCase()
    const orderAmount = Number(amount ?? 0)

    if (!normalizedCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", normalizedCode)
      .eq("is_active", true)
      .maybeSingle()

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 })
    }

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.usage_limit > 0 && coupon.times_used >= coupon.usage_limit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
    }


    // Check min order value
    if (orderAmount < (coupon.min_order_value || 0)) {
      return NextResponse.json({ 
        error: `Minimum order value of Rs. ${coupon.min_order_value} required` 
      }, { status: 400 })
    }

    let discountAmount = 0
    if (coupon.discount_type === "flat") {
      discountAmount = coupon.discount_value
    } else if (coupon.discount_type === "percentage") {
      discountAmount = (orderAmount * coupon.discount_value) / 100
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      discountAmount: Math.min(discountAmount, orderAmount),
      code: coupon.code
    })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
