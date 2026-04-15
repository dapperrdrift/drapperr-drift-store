import Link from "next/link"

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="display-md text-foreground mb-4">Cookie Policy</h1>
        <p className="body-md text-muted-foreground">
          Last updated: March 1, 2024
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <section>
          <h2 className="headline-sm text-foreground mb-4">What Are Cookies?</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">How We Use Cookies</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            Drapperr uses cookies and similar technologies for several purposes:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To enable essential website functionality</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To remember your preferences and settings</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To keep you signed in to your account</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To analyze how our website is used</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To personalize content and recommendations</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>To deliver relevant advertising</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">Types of Cookies We Use</h2>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h3 className="title-lg text-foreground mb-3">Essential Cookies</h3>
              <p className="body-md text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 label-md text-foreground">Cookie</th>
                      <th className="py-2 pr-4 label-md text-foreground">Purpose</th>
                      <th className="py-2 label-md text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">session_id</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Maintains user session</td>
                      <td className="py-2 body-sm text-muted-foreground">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">csrf_token</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Security protection</td>
                      <td className="py-2 body-sm text-muted-foreground">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">cart_id</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Shopping cart functionality</td>
                      <td className="py-2 body-sm text-muted-foreground">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-border p-6">
              <h3 className="title-lg text-foreground mb-3">Functional Cookies</h3>
              <p className="body-md text-muted-foreground mb-4">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and choices.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 label-md text-foreground">Cookie</th>
                      <th className="py-2 pr-4 label-md text-foreground">Purpose</th>
                      <th className="py-2 label-md text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">user_preferences</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Stores display preferences</td>
                      <td className="py-2 body-sm text-muted-foreground">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">recently_viewed</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Recently viewed products</td>
                      <td className="py-2 body-sm text-muted-foreground">30 days</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">wishlist</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Wishlist items (logged out)</td>
                      <td className="py-2 body-sm text-muted-foreground">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-border p-6">
              <h3 className="title-lg text-foreground mb-3">Analytics Cookies</h3>
              <p className="body-md text-muted-foreground mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 label-md text-foreground">Cookie</th>
                      <th className="py-2 pr-4 label-md text-foreground">Purpose</th>
                      <th className="py-2 label-md text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">_ga</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Google Analytics - user distinction</td>
                      <td className="py-2 body-sm text-muted-foreground">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">_gid</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Google Analytics - user distinction</td>
                      <td className="py-2 body-sm text-muted-foreground">24 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">_gat</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Google Analytics - throttle rate</td>
                      <td className="py-2 body-sm text-muted-foreground">1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-border p-6">
              <h3 className="title-lg text-foreground mb-3">Marketing Cookies</h3>
              <p className="body-md text-muted-foreground mb-4">
                These cookies are used to track visitors across websites to display relevant advertisements.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 label-md text-foreground">Cookie</th>
                      <th className="py-2 pr-4 label-md text-foreground">Purpose</th>
                      <th className="py-2 label-md text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">_fbp</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Facebook Pixel tracking</td>
                      <td className="py-2 body-sm text-muted-foreground">3 months</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">_gcl_au</td>
                      <td className="py-2 pr-4 body-sm text-muted-foreground">Google Ads conversion tracking</td>
                      <td className="py-2 body-sm text-muted-foreground">3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">Managing Cookies</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            You can control and manage cookies in several ways:
          </p>
          <ul className="space-y-2 ml-4 mb-4">
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">Cookie Preferences:</strong> Use our cookie consent banner to customize your preferences</span>
            </li>
            <li className="flex items-start gap-3 body-md text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">Opt-Out Tools:</strong> Use tools like the Digital Advertising Alliance&apos;s opt-out page</span>
            </li>
          </ul>
          <p className="body-md text-muted-foreground leading-relaxed">
            Please note that blocking some cookies may impact your experience on our website and limit the functionality available to you.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">Third-Party Cookies</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            Some cookies on our website are set by third-party services that appear on our pages. We do not control these cookies and they are subject to the respective third party&apos;s privacy policy. These include services like Google Analytics, Facebook, and our payment processors.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">Updates to This Policy</h2>
          <p className="body-md text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The date at the top of this page indicates when the policy was last updated.
          </p>
        </section>

        <section>
          <h2 className="headline-sm text-foreground mb-4">Contact Us</h2>
          <p className="body-md text-muted-foreground leading-relaxed mb-4">
            If you have questions about our use of cookies, please contact us:
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

        <section className="pt-4">
          <p className="body-md text-muted-foreground">
            For more information about how we handle your personal data, please read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
