import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="display-md text-foreground mb-4">Terms of Service</h1>
        <p className="body-md text-muted-foreground">
          Last updated: March 1, 2024
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <section>
          <h2 className="headline-sm text-foreground mb-4">1. Acceptance of Terms</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            Welcome to Dapperr. By accessing or using our website (www.dapperr.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services. These terms apply to all visitors, users, and customers of the website.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">2. Eligibility</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            You must be at least 18 years of age to use this website and make purchases. By using this website, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding agreement.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">3. Account Registration</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            To access certain features of our website, you may need to create an account. When creating an account, you agree to:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Provide accurate, current, and complete information</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Maintain and promptly update your account information</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Maintain the security of your password and account</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Accept responsibility for all activities under your account</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Immediately notify us of any unauthorized use of your account</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">4. Products and Pricing</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            We make every effort to display our products accurately. However:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Colors may vary slightly due to screen display settings</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Prices are subject to change without prior notice</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>All prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>We reserve the right to limit quantities or refuse orders</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">5. Orders and Payment</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            When you place an order:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Your order constitutes an offer to purchase products from us</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>We may accept or decline your order at our discretion</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Order acceptance occurs when we send a shipping confirmation</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Payment must be received before order processing</span>
            </li>
          </ul>
          <p className="body-md text-muted-foreground leading-relaxed mt-4">
            We accept various payment methods including credit/debit cards, UPI, net banking, and select digital wallets. All transactions are processed securely through our payment partners.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">6. Shipping and Delivery</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            Shipping times and costs are provided at checkout. While we strive to deliver within estimated timeframes, delays may occur due to circumstances beyond our control. Risk of loss and title for products pass to you upon delivery. For detailed shipping information, please refer to our <Link href="/shipping-returns" className="text-primary hover:underline">Shipping & Returns page</Link>.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">7. Returns and Refunds</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            We offer a 30-day return policy for eligible items. Items must be unworn, unwashed, with all tags attached, and in original packaging. Sale items are final sale and cannot be returned. For complete return instructions and policies, please visit our <Link href="/shipping-returns" className="text-primary hover:underline">Shipping & Returns page</Link>.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">8. Intellectual Property</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            All content on this website, including but not limited to text, graphics, logos, images, product designs, and software, is the property of Dapperr or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">9. Prohibited Conduct</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Use the website for any unlawful purpose</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Interfere with the proper functioning of the website</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Attempt to gain unauthorized access to our systems</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Use automated means to access or scrape the website</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Impersonate any person or entity</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Engage in fraudulent activities</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">10. Limitation of Liability</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, Dapperr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the website or products. Our total liability shall not exceed the amount you paid for the product giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">11. Indemnification</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            You agree to indemnify, defend, and hold harmless Dapperr, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these terms or your use of the website.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">12. Governing Law</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">13. Changes to Terms</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">14. Contact Information</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="rounded-lg border border-border p-6 bg-surface-container-low">
            <p className="body-md text-foreground font-medium mb-2">Dapperr Drift Private Limited</p>
            <p className="body-md text-muted-foreground">
              123 Fashion Street, Mumbai<br />
              Maharashtra, India 400001<br />
              Email: legal@dapperr.com<br />
              Phone: +91 1800-123-4567
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
