"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@drapperr.com",
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
      details: "123 Fashion Street, Mumbai",
      subtext: "Maharashtra, India 400001",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Sat: 9:00 AM - 6:00 PM",
      subtext: "Sunday: Closed",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Contact Us</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question or need assistance? We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
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

      {/* Contact Form Section */}
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="headline-md text-foreground mb-4">Send Us a Message</h2>
          <p className="body-lg text-muted-foreground mb-8">
            Fill out the form below and our team will get back to you within 24 hours. For urgent inquiries, please call our customer service line.
          </p>

          {submitted ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="title-lg text-green-800 mb-2">Message Sent!</h3>
              <p className="body-md text-green-700">
                Thank you for reaching out. We&apos;ll get back to you shortly.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ name: "", email: "", subject: "", message: "" })
                }}
                className="mt-6 bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label-md text-foreground block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label-md text-foreground block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="label-md text-foreground block mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="label-md text-foreground block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-input rounded-md px-4 py-3 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-3"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>

        {/* Map/Image placeholder */}
        <div className="rounded-lg bg-surface-container-low overflow-hidden h-[400px] lg:h-auto flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="title-md text-foreground mb-2">Our Store Location</p>
            <p className="body-md text-muted-foreground">
              123 Fashion Street, Mumbai<br />
              Maharashtra, India 400001
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
