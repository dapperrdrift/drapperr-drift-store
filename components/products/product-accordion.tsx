"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductAccordionProps {
  details: string[]
  care: string[]
}

interface AccordionItemProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="label-md text-foreground">{title}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ProductAccordion({ details, care }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("details")

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="border-t border-border">
      <AccordionItem
        title="Product Details"
        isOpen={openSection === "details"}
        onToggle={() => toggleSection("details")}
      >
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="body-md text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1.5">•</span>
              {detail}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Care Instructions"
        isOpen={openSection === "care"}
        onToggle={() => toggleSection("care")}
      >
        <ul className="space-y-2">
          {care.map((item, index) => (
            <li key={index} className="body-md text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Shipping & Returns"
        isOpen={openSection === "shipping"}
        onToggle={() => toggleSection("shipping")}
      >
        <div className="space-y-3 body-md text-muted-foreground">
          <p>
            <span className="text-foreground font-medium">Free Standard Shipping</span> on orders over Rs. 5,000. 
            Delivery within 5-7 business days.
          </p>
          <p>
            <span className="text-foreground font-medium">Express Shipping</span> available for an additional Rs. 500. 
            Delivery within 2-3 business days.
          </p>
          <p>
            <span className="text-foreground font-medium">Returns</span> accepted within 30 days of delivery. 
            Items must be unworn with original tags attached.
          </p>
        </div>
      </AccordionItem>
    </div>
  )
}
