const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external"

// Module-level token cache — avoids re-authenticating on every request
// within the same Node process lifetime
let cachedToken: string | null = null
let tokenExpiresAt = 0

function requiredPickupLocation(): string {
  const pickup = process.env.SHIPROCKET_PICKUP_LOCATION?.trim()
  if (!pickup) {
    throw new Error("SHIPROCKET_PICKUP_LOCATION is not configured")
  }
  return pickup
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Shiprocket auth failed: ${res.status} — ${body}`)
  }

  const data = await res.json()
  cachedToken = data.token as string
  // Shiprocket tokens are valid for 24 hours; cache for 23 to be safe
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000
  return cachedToken
}

export interface ShiprocketOrderPayload {
  order_id: string
  order_date: string // "YYYY-MM-DD HH:MM"
  pickup_location: string
  billing_customer_name: string
  billing_last_name: string
  billing_address: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: true
  order_items: Array<{
    name: string
    sku: string
    units: number
    selling_price: number
  }>
  payment_method: "Prepaid"
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
}

export interface ShiprocketOrderResult {
  order_id: number
  shipment_id: number
  status: string
  status_code: number
  awb_code?: string
  courier_name?: string
}

function parseNumericId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "undefined" || trimmed === "null") return null
    if (/^\d+$/.test(trimmed)) return Number(trimmed)
  }
  return null
}

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<ShiprocketOrderResult> {
  const token = await getToken()
  const body = {
    ...payload,
    pickup_location: payload.pickup_location || requiredPickupLocation(),
  }

  const res = await fetch(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  const shipmentId = parseNumericId(data?.shipment_id)
  const orderId = parseNumericId(data?.order_id)

  if (!res.ok || shipmentId == null || orderId == null) {
    throw new Error(
      `Shiprocket order creation failed: ${res.status} — ${JSON.stringify(data)}`
    )
  }

  return {
    ...data,
    order_id: orderId,
    shipment_id: shipmentId,
  }
}
