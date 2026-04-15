"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const faqCategories = [
  {
    name: "Orders & Shipping",
    faqs: [
      {
        question: "How do I track my order?",
        answer:
          "Once your order is shipped, you'll receive an email with a tracking number and link. You can also track your order by logging into your account and visiting the 'Orders' section, or use our Track Order page.",
      },
      {
        question: "What are the shipping options available?",
        answer:
          "We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Same-Day Delivery in select cities. Shipping is complimentary on orders over Rs. 5,000.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship within India only. We're working on expanding our shipping to international destinations. Please check back soon or subscribe to our newsletter for updates.",
      },
      {
        question: "Can I change my shipping address after placing an order?",
        answer:
          "Address changes can be made within 2 hours of placing your order. Please contact our customer support immediately at support@dapperr.com or call our helpline.",
      },
    ],
  },
  {
    name: "Returns & Exchanges",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for all unworn items with tags attached. Items must be in their original condition and packaging. Sale items are final sale and cannot be returned.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Log into your account, go to 'Orders', select the item you wish to return, and click 'Request Return'. You'll receive a prepaid shipping label via email within 24 hours.",
      },
      {
        question: "How long does it take to process a refund?",
        answer:
          "Once we receive your return, it takes 3-5 business days to inspect and process. Refunds are credited to your original payment method within 7-10 business days after processing.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes! You can request an exchange for a different size within 30 days. If the requested size is unavailable, we'll process a full refund instead.",
      },
    ],
  },
  {
    name: "Payment & Billing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit/debit cards (Visa, Mastercard, American Express), UPI, Net Banking, and popular wallets like Paytm and PhonePe. We also offer Cash on Delivery in select locations.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL encryption and partner with Razorpay for secure payment processing. Your card details are never stored on our servers.",
      },
      {
        question: "Can I use multiple payment methods for one order?",
        answer:
          "Currently, we only support one payment method per order. However, you can combine payment with store credit or gift cards.",
      },
      {
        question: "Do you offer EMI options?",
        answer:
          "Yes, we offer no-cost EMI on orders above Rs. 10,000 through select bank credit cards. EMI options are displayed at checkout if your order qualifies.",
      },
    ],
  },
  {
    name: "Products & Sizing",
    faqs: [
      {
        question: "How do I find my size?",
        answer:
          "Visit our Size Guide page for detailed measurements and fitting tips. Each product page also includes specific sizing information. When in doubt, we recommend sizing up.",
      },
      {
        question: "Are your products true to size?",
        answer:
          "Our garments are designed to fit true to size based on standard Indian measurements. Product-specific fit information (slim, regular, relaxed) is mentioned on each product page.",
      },
      {
        question: "How do I care for my garments?",
        answer:
          "Care instructions are provided on the product label and product page. Generally, we recommend cold water wash, mild detergent, and air drying for best results.",
      },
      {
        question: "Are the product colors accurate online?",
        answer:
          "We strive to display colors as accurately as possible. However, slight variations may occur due to screen settings. If you're unsure, contact us for additional product images.",
      },
    ],
  },
  {
    name: "Account & Privacy",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign In' at the top of the page, then select 'Create Account'. You'll need to provide your email, create a password, and fill in basic details. You can also sign up during checkout.",
      },
      {
        question: "How can I reset my password?",
        answer:
          "Click 'Sign In', then 'Forgot Password'. Enter your email address and we'll send you a password reset link valid for 24 hours.",
      },
      {
        question: "How do you protect my personal information?",
        answer:
          "We take privacy seriously. Your data is encrypted, never sold to third parties, and used only for order processing and improving your shopping experience. See our Privacy Policy for details.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can request account deletion from your Account Settings or by contacting support. Please note this action is irreversible and your order history will be permanently removed.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about orders, shipping, returns, and more. Can&apos;t find what you&apos;re looking for? Contact our support team.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-input rounded-lg pl-12 pr-4 py-4 body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        />
      </div>

      {/* FAQ Categories */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h2 className="headline-sm text-foreground mb-4 pb-2 border-b border-border">
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq, index) => {
                  const itemId = `${category.name}-${index}`
                  const isOpen = openItems.includes(itemId)
                  return (
                    <div
                      key={itemId}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/50 transition-colors"
                      >
                        <span className="title-md text-foreground pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all",
                          isOpen ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <p className="px-6 pb-4 body-md text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-lg bg-secondary">
          <p className="title-md text-foreground mb-2">No results found</p>
          <p className="body-md text-muted-foreground">
            Try a different search term or browse the categories above.
          </p>
        </div>
      )}

      {/* Still need help */}
      <div className="mt-16 rounded-lg bg-surface-container-low p-8 text-center">
        <h3 className="headline-sm text-foreground mb-2">Still Have Questions?</h3>
        <p className="body-md text-muted-foreground mb-6">
          Our customer support team is here to help you with any queries.
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
