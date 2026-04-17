"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { faqCategories } from "@/lib/faq-data"

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
                            "h-5 w-5 text-muted-foreground shrink-0 transition-transform",
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
