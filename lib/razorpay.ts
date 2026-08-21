const RAZORPAY_API = "https://api.razorpay.com/v1"

export type RazorpayMode = "live" | "test" | "unknown"

export type RazorpayPayment = {
  id: string
  status: string
  amount: number
  currency: string
  order_id?: string
}

function authHeader(): string {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error("Payment gateway not configured")
  }
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`
}

export function getRazorpayMode(): RazorpayMode {
  const keyId = process.env.RAZORPAY_KEY_ID ?? ""
  if (keyId.startsWith("rzp_live_")) return "live"
  if (keyId.startsWith("rzp_test_")) return "test"
  return "unknown"
}

export async function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPayment> {
  const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to fetch Razorpay payment: ${res.status} — ${body}`)
  }
  return res.json() as Promise<RazorpayPayment>
}

export async function captureRazorpayPayment(
  paymentId: string,
  amountPaise: number
): Promise<RazorpayPayment> {
  const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}/capture`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to capture Razorpay payment: ${res.status} — ${body}`)
  }
  return res.json() as Promise<RazorpayPayment>
}

/** Fetch the payment and capture it if still authorized. Throws unless status is captured. */
export async function ensureRazorpayCaptured(
  paymentId: string,
  amountRupees: number
): Promise<RazorpayPayment> {
  const amountPaise = Math.round(amountRupees * 100)
  let payment = await fetchRazorpayPayment(paymentId)

  if (payment.status === "authorized") {
    payment = await captureRazorpayPayment(paymentId, amountPaise)
  }

  if (payment.status !== "captured") {
    throw new Error(
      `Razorpay payment is ${payment.status}, expected captured. Money will not settle until capture succeeds.`
    )
  }

  return payment
}
