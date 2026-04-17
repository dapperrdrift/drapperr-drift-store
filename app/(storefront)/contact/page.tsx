import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: 'Contact Us | Dapperr Drift – Clothing Store in Kota',
  description:
    'Visit Dapperr Drift at Shop No. F6, Shubh Affinity, Swami Vivekananda Nagar, Kota, Rajasthan 324010 (next to DMART). Call us or send a message. Open Mon–Sat, 9am–6pm.',
  keywords: [
    'Dapperr Drift contact',
    'clothing store Kota address',
    'fashion store Swami Vivekananda Nagar Kota',
    'Shubh Affinity Kota clothing',
    'clothing store near DMART Kota',
    'Dapperr Drift phone number',
    'Dapperr Drift location Kota',
    'fashion store Kota Rajasthan contact',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/contact',
  },
  openGraph: {
    title: 'Contact Dapperr Drift | Kota\'s Best Clothing Store',
    description:
      'Find us at Shop F6, Shubh Affinity, Swami Vivekananda Nagar, Kota, Rajasthan. Mon–Sat 9am–6pm. Call, email, or drop by.',
    url: 'https://dapperrdrift.com/contact',
    type: 'website',
  },
}

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "support@dapperr.com",
    subtext: "We'll respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 1800-123-4567",
    subtext: "Toll-free, Mon-Sat 9am-6pm",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Shop No. F6, First Floor, Shubh Affinity",
    subtext: "Next to DMART, Swami Vivekananda Nagar, Kota, Rajasthan 324010",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Sat: 9:00 AM - 6:00 PM",
    subtext: "Sunday: Closed",
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Contact Us</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Visit us at our store in Kota, or reach out online. We&apos;re here to help with orders, sizing, or anything else.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {contactInfo.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="rounded-lg border border-border p-6 text-center hover:border-primary transition-colors"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="title-md text-foreground mb-2">{item.title}</h3>
              <p className="body-md text-foreground font-medium">{item.details}</p>
              <p className="body-sm text-muted-foreground mt-1">{item.subtext}</p>
            </div>
          )
        })}
      </div>

      {/* Contact Form + Map */}
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="headline-md text-foreground mb-4">Send Us a Message</h2>
          <p className="body-lg text-muted-foreground mb-8">
            Fill out the form below and our team will get back to you within 24 hours. For urgent inquiries, please call our customer service line.
          </p>
          <ContactForm />
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-lg overflow-hidden h-100 lg:h-auto min-h-112.5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.335134024094!2d75.82009657537948!3d25.124358177757987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f8511763b4585%3A0x5ae48c4c3a39ae2d!2sDapperr%20Drift!5e0!3m2!1sen!2sin!4v1774543438218!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "450px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dapperr Drift Store Location – Shubh Affinity, Swami Vivekananda Nagar, Kota, Rajasthan"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Local area directions note */}
      <div className="mt-12 rounded-lg bg-surface-container-low border border-border p-6">
        <h2 className="title-lg text-foreground mb-3">How to Find Us</h2>
        <p className="body-md text-muted-foreground">
          Dapperr Drift is located on the <strong>First Floor of Shubh Affinity Mall, next to DMART</strong> in Swami Vivekananda Nagar, Kota, Rajasthan.
          We are easily accessible from Vigyan Nagar, Talwandi, Mahaveer Nagar, DCM, Landmark City, Shreenathpuram, Gumanpura, and Kota City Centre.
          Ample parking is available in the Shubh Affinity complex.
        </p>
      </div>
    </div>
  )
}
