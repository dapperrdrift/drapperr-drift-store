"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const sizeData = {
  clothing: [
    { size: "XS", chest: "32-34", waist: "26-28", hips: "34-36", us: "0-2", eu: "32-34", uk: "4-6" },
    { size: "S", chest: "34-36", waist: "28-30", hips: "36-38", us: "4-6", eu: "36-38", uk: "8-10" },
    { size: "M", chest: "36-38", waist: "30-32", hips: "38-40", us: "8-10", eu: "40-42", uk: "12-14" },
    { size: "L", chest: "38-40", waist: "32-34", hips: "40-42", us: "12-14", eu: "44-46", uk: "16-18" },
    { size: "XL", chest: "40-42", waist: "34-36", hips: "42-44", us: "16-18", eu: "48-50", uk: "20-22" },
  ],
  howToMeasure: [
    { label: "Chest", description: "Measure around the fullest part of your chest, keeping the tape horizontal." },
    { label: "Waist", description: "Measure around your natural waistline, keeping the tape comfortably loose." },
    { label: "Hips", description: "Measure around the fullest part of your hips, approximately 8\" below your waist." },
  ],
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="headline-md text-foreground">Size Guide</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Size Chart */}
          <div>
            <h3 className="title-lg text-foreground mb-4">Clothing Measurements (in inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">Size</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">Chest</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">Waist</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">Hips</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">US</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">EU</th>
                    <th className="py-3 px-4 text-left label-md text-foreground bg-secondary">UK</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.clothing.map((row, index) => (
                    <tr 
                      key={row.size} 
                      className={`border-b border-border ${index % 2 === 0 ? "bg-card" : "bg-secondary/50"}`}
                    >
                      <td className="py-3 px-4 title-md text-primary font-semibold">{row.size}</td>
                      <td className="py-3 px-4 body-md text-foreground">{row.chest}</td>
                      <td className="py-3 px-4 body-md text-foreground">{row.waist}</td>
                      <td className="py-3 px-4 body-md text-foreground">{row.hips}</td>
                      <td className="py-3 px-4 body-md text-muted-foreground">{row.us}</td>
                      <td className="py-3 px-4 body-md text-muted-foreground">{row.eu}</td>
                      <td className="py-3 px-4 body-md text-muted-foreground">{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure */}
          <div>
            <h3 className="title-lg text-foreground mb-4">How to Measure</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {sizeData.howToMeasure.map((item, index) => (
                <div key={item.label} className="rounded-lg bg-secondary p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground label-md">
                      {index + 1}
                    </span>
                    <h4 className="title-md text-foreground">{item.label}</h4>
                  </div>
                  <p className="body-md text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h4 className="title-md text-primary mb-2">Fit Tips</h4>
            <ul className="space-y-2 body-md text-foreground">
              <li>If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.</li>
              <li>Our cashmere and knitwear may stretch slightly with wear.</li>
              <li>For tailored pieces, consider your preferred fit style (fitted vs. relaxed).</li>
            </ul>
          </div>

          {/* Need Help */}
          <div className="text-center pt-4 border-t border-border">
            <p className="body-md text-muted-foreground">
              Still unsure about your size? Contact our styling team at{" "}
              <a href="mailto:style@dapperr.com" className="text-primary hover:underline">
                style@dapperr.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
