import type { Metadata } from 'next'
import { Truck, RotateCcw, Clock, MapPin, Package, CreditCard } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Shipping & Returns | Drapperr Drift – Kota, Rajasthan',
  description:
    'Drapperr Drift ships pan-India from our store in Kota, Rajasthan. Free shipping on eligible orders. Easy 30-day returns. Learn about our shipping policy and hassle-free returns.',
  keywords: [
    'Drapperr Drift shipping policy',
    'clothing store Kota shipping',
    'fashion store returns Rajasthan',
    'free shipping India clothing',
    'Drapperr Drift returns policy',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/shipping-returns',
  },
}

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Shipping & Returns</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about getting your order and our hassle-free return process.
        </p>
      </div>

      {/* Shipping Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <h2 className="headline-md text-foreground">Shipping Information</h2>
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-left label-md text-foreground">Shipping Method</th>
                <th className="px-6 py-4 text-left label-md text-foreground">Delivery Time</th>
                <th className="px-6 py-4 text-left label-md text-foreground">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4 body-md text-foreground">Standard Shipping</td>
                <td className="px-6 py-4 body-md text-muted-foreground">5-7 Business Days</td>
                <td className="px-6 py-4 body-md text-muted-foreground">Rs. 99 (Free over Rs. 5,000)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 body-md text-foreground">Express Shipping</td>
                <td className="px-6 py-4 body-md text-muted-foreground">2-3 Business Days</td>
                <td className="px-6 py-4 body-md text-muted-foreground">Rs. 249</td>
              </tr>
              <tr>
                <td className="px-6 py-4 body-md text-foreground">Same-Day Delivery</td>
                <td className="px-6 py-4 body-md text-muted-foreground">Same Day (Order by 12 PM)</td>
                <td className="px-6 py-4 body-md text-muted-foreground">Rs. 499 (Select Cities Only)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="title-md text-foreground">Delivery Coverage</h3>
            </div>
            <p className="body-md text-muted-foreground">
              We currently deliver across India to all serviceable pin codes. Enter your pin code at checkout to confirm delivery availability and estimated delivery date.
            </p>
          </div>
          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="title-md text-foreground">Order Processing</h3>
            </div>
            <p className="body-md text-muted-foreground">
              Orders placed before 2 PM IST on business days are processed the same day. Orders placed after 2 PM or on weekends/holidays are processed the next business day.
            </p>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h2 className="headline-md text-foreground">Returns & Exchanges</h2>
        </div>

        <div className="rounded-lg bg-surface-container-low p-6 mb-8">
          <p className="title-lg text-foreground mb-2">30-Day Easy Returns</p>
          <p className="body-md text-muted-foreground">
            Not completely satisfied? We offer a 30-day return policy on all eligible items. Simply initiate a return through your account and we&apos;ll take care of the rest.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="title-md text-foreground mb-3">Return Eligibility</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                Items must be unworn, unwashed, and in original condition with all tags attached
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                Returns must be initiated within 30 days of delivery
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                Items must be returned in original packaging
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                Sale items and intimate apparel are final sale and cannot be returned
              </li>
            </ul>
          </div>

          <div>
            <h3 className="title-md text-foreground mb-3">How to Return</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 rounded-lg border border-border">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                  <span className="title-md">1</span>
                </div>
                <p className="body-md text-foreground font-medium mb-1">Initiate Return</p>
                <p className="body-sm text-muted-foreground">Log in and select the item to return from your orders</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                  <span className="title-md">2</span>
                </div>
                <p className="body-md text-foreground font-medium mb-1">Pack & Ship</p>
                <p className="body-sm text-muted-foreground">Use the prepaid label we send to ship your return</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                  <span className="title-md">3</span>
                </div>
                <p className="body-md text-foreground font-medium mb-1">Get Refund</p>
                <p className="body-sm text-muted-foreground">Refund processed within 7-10 days of receipt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refunds Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <h2 className="headline-md text-foreground">Refunds</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <Package className="h-5 w-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="title-md text-foreground mb-1">Refund Processing</p>
              <p className="body-md text-muted-foreground">
                Once your return is received and inspected (3-5 business days), your refund will be processed. The refund will be credited to your original payment method within 7-10 business days.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <CreditCard className="h-5 w-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="title-md text-foreground mb-1">Refund Methods</p>
              <p className="body-md text-muted-foreground">
                Refunds are issued to the original payment method. For COD orders, refunds are processed to your bank account or as store credit, based on your preference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <div className="rounded-lg bg-surface-container-low p-8 text-center">
        <h3 className="headline-sm text-foreground mb-2">Need Help?</h3>
        <p className="body-md text-muted-foreground mb-6">
          Our customer support team is available to assist you with any shipping or return queries.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Contact Support
        </Link>
      </div>
    </div>
  )
}
