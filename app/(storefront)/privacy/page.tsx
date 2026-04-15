import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="display-md text-foreground mb-4">Privacy Policy</h1>
        <p className="body-md text-muted-foreground">
          Last updated: March 1, 2024
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <div className="space-y-8">
          <section>
            <h2 className="headline-sm text-foreground mb-4">Introduction</h2>
            <p className="body-md text-muted-foreground leading-relaxed">
              Drapperr Drift Private Limited (&quot;Drapperr,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Information We Collect</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, shipping and billing addresses when you create an account or place an order.</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Payment Information:</strong> Credit/debit card details, UPI IDs, or other payment information processed securely through our payment partners.</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Order Information:</strong> Products purchased, order history, and transaction details.</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Communications:</strong> Information you provide when contacting customer support or subscribing to our newsletter.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Automatically Collected Information</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              When you visit our website, we automatically collect certain information:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Device information (browser type, operating system, device type)</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>IP address and approximate location</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Pages viewed, time spent on pages, and navigation patterns</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Referring website or source</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">How We Use Your Information</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Process and fulfill your orders, including shipping and delivery</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Communicate with you about orders, products, and services</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Send promotional communications (with your consent)</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Improve our website, products, and customer experience</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Prevent fraud and maintain security</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Information Sharing</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Service Providers:</strong> Payment processors, shipping partners, and other vendors who help us operate our business</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Analytics Partners:</strong> To help us understand website usage and improve our services</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Data Security</h2>
            <p className="body-md text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology, and we partner with PCI-DSS compliant payment processors.
            </p>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Your Rights</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Access the personal data we hold about you</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Request correction of inaccurate data</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Request deletion of your data (subject to legal requirements)</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Opt out of marketing communications</span>
              </li>
              <li className="flex items-start gap-3 body-md text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Withdraw consent where processing is based on consent</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Data Retention</h2>
            <p className="body-md text-muted-foreground leading-relaxed">
              We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Order information is typically retained for 7 years for tax and legal compliance.
            </p>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Cookies</h2>
            <p className="body-md text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience. For detailed information about our use of cookies, please see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Changes to This Policy</h2>
            <p className="body-md text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="headline-sm text-foreground mb-4">Contact Us</h2>
            <p className="body-md text-muted-foreground leading-relaxed mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="rounded-lg border border-border p-6 bg-surface-container-low">
              <p className="body-md text-foreground font-medium mb-2">Drapperr Drift Private Limited</p>
              <p className="body-md text-muted-foreground">
                123 Fashion Street, Mumbai<br />
                Maharashtra, India 400001<br />
                Email: privacy@dapperr.com<br />
                Phone: +91 1800-123-4567
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
