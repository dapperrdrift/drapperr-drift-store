"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface ProductAccordionProps {
  description: string | null
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

export function ProductAccordion({ description, care }: ProductAccordionProps) {
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
        {description ? (
          <div className="body-md text-muted-foreground [&_p]:my-2 [&_strong]:text-foreground [&_strong]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:title-md [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-primary [&_a]:underline">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : (
          <p className="body-md text-muted-foreground">No additional details available.</p>
        )}
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
            <span className="text-foreground font-medium">Standard Shipping</span> starts from Rs. 99 (Free on orders over Rs. 5,000). 
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
