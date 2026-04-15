"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactForm() {
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
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
    )
  }

  return (
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
  )
}
