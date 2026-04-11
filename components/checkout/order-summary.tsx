import Image from "next/image"
import React from "react"

interface OrderItem {
  id: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  onApplyCoupon?: (code: string) => Promise<void>
  appliedCouponCode?: string
}

export function OrderSummary({ 
  items, 
  subtotal, 
  discount, 
  shipping, 
  total,
  onApplyCoupon,
  appliedCouponCode
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = React.useState("")
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [isConfettiFading, setIsConfettiFading] = React.useState(false)
  const previousCouponRef = React.useRef<string | undefined>(undefined)
  const confettiPieces = React.useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: `${((i * 11) % 100) + 0.5}%`,
        delay: `${(i * 21) % 420}ms`,
        duration: `${1800 + ((i * 67) % 900)}ms`,
        rotate: `${((i * 29) % 180) - 90}deg`,
      })),
    []
  )

  React.useEffect(() => {
    if (!appliedCouponCode) {
      previousCouponRef.current = undefined
      return
    }

    if (appliedCouponCode === previousCouponRef.current) {
      return
    }

    previousCouponRef.current = appliedCouponCode
    setIsConfettiFading(false)
    setShowConfetti(false)
    requestAnimationFrame(() => setShowConfetti(true))
  }, [appliedCouponCode])

  React.useEffect(() => {
    if (!showConfetti) return

    const fadeTimer = window.setTimeout(() => {
      setIsConfettiFading(true)
    }, 2400)

    const hideTimer = window.setTimeout(() => {
      setShowConfetti(false)
      setIsConfettiFading(false)
    }, 3000)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [showConfetti])

  return (
    <>
      {showConfetti && (
        <div
          className={`fixed inset-0 z-[9999] pointer-events-none overflow-hidden transition-opacity duration-600 ${
            isConfettiFading ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="dd-checkout-confetti-piece"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                transform: `rotate(${piece.rotate})`,
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-surface-container-low p-6 lg:p-8">
        <h2 className="headline-md text-foreground">Order Summary</h2>

      {/* Coupon code input */}
      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="coupon" className="label-md text-foreground">Coupon Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 border border-border bg-surface-container-lowest p-2 body-md text-foreground focus:border-primary focus:outline-none"
            placeholder="Enter code"
            disabled={!!appliedCouponCode}
          />
          <button
            onClick={() => onApplyCoupon?.(couponCode.trim().toUpperCase())}
            disabled={!couponCode || !!appliedCouponCode}
            className="bg-primary px-4 py-2 label-md text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {appliedCouponCode ? "Applied" : "Apply"}
          </button>
        </div>
        {appliedCouponCode && (
          <p className="body-md text-primary">Coupon &quot;{appliedCouponCode}&quot; applied!</p>
        )}
      </div>

      {/* Items */}
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-surface-container-lowest">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <span className="body-md text-foreground">{item.name}</span>
              <span className="body-md text-muted-foreground">
                {item.color} / {item.size}
              </span>
              <span className="mt-auto body-md text-foreground">
                Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary lines */}
      <div className="mt-6 space-y-3 border-t border-border pt-6">
        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Subtotal</span>
          <span className="body-md text-foreground">Rs. {subtotal.toLocaleString("en-IN")}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="body-md text-primary">Discount</span>
            <span className="body-md text-primary">-Rs. {discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="body-md text-muted-foreground">Shipping</span>
          <span className="body-md text-foreground">
            {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-6 flex justify-between border-t border-border pt-6">
        <span className="title-lg text-foreground">Total</span>
        <span className="title-lg text-foreground">Rs. {total.toLocaleString("en-IN")}</span>
      </div>

        {/* Security badges */}
        <div className="mt-6 space-y-2 text-center">
          <p className="body-md text-muted-foreground">
            Secure checkout powered by Razorpay
          </p>
          <p className="body-md text-muted-foreground">
            SSL encrypted for your protection
          </p>
        </div>

        <style jsx global>{`
          .dd-checkout-confetti-piece {
            position: absolute;
            top: -24px;
            width: 8px;
            height: 16px;
            opacity: 0;
            border-radius: 2px;
            animation-name: dd-checkout-make-it-rain;
            animation-timing-function: linear;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
            background: #b30000;
          }

          .dd-checkout-confetti-piece:nth-child(odd) {
            background: #f97316;
          }

          .dd-checkout-confetti-piece:nth-child(3n) {
            width: 6px;
            height: 12px;
            background: #22c55e;
          }

          .dd-checkout-confetti-piece:nth-child(4n) {
            width: 5px;
            height: 10px;
            background: #0ea5e9;
          }

          .dd-checkout-confetti-piece:nth-child(5n) {
            width: 9px;
            height: 14px;
            background: #eab308;
          }

          @keyframes dd-checkout-make-it-rain {
            0% {
              opacity: 0;
              transform: translateY(0) rotate(0deg);
            }

            15% {
              opacity: 1;
            }

            80% {
              opacity: 1;
            }

            100% {
              opacity: 0.15;
              transform: translateY(120vh) rotate(720deg);
            }
          }
        `}</style>
      </div>
    </>
  )
}
