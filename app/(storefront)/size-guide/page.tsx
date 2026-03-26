"use client"

import { useState } from "react"
import { Ruler, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const sizeCategories = [
  { id: "mens-tops", label: "Men's Tops" },
  { id: "mens-bottoms", label: "Men's Bottoms" },
  { id: "womens-tops", label: "Women's Tops" },
  { id: "womens-bottoms", label: "Women's Bottoms" },
]

const sizeTables: Record<string, { headers: string[]; rows: string[][] }> = {
  "mens-tops": {
    headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      ["XS", "34-36", "16", "26", "24"],
      ["S", "36-38", "17", "27", "25"],
      ["M", "38-40", "18", "28", "26"],
      ["L", "40-42", "19", "29", "27"],
      ["XL", "42-44", "20", "30", "28"],
      ["XXL", "44-46", "21", "31", "29"],
    ],
  },
  "mens-bottoms": {
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Thigh (in)"],
    rows: [
      ["28", "28", "36", "30", "21"],
      ["30", "30", "38", "30", "22"],
      ["32", "32", "40", "31", "23"],
      ["34", "34", "42", "31", "24"],
      ["36", "36", "44", "32", "25"],
      ["38", "38", "46", "32", "26"],
    ],
  },
  "womens-tops": {
    headers: ["Size", "Bust (in)", "Shoulder (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      ["XS", "32-34", "14", "24", "22"],
      ["S", "34-36", "15", "25", "23"],
      ["M", "36-38", "16", "26", "24"],
      ["L", "38-40", "17", "27", "25"],
      ["XL", "40-42", "18", "28", "26"],
      ["XXL", "42-44", "19", "29", "27"],
    ],
  },
  "womens-bottoms": {
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Rise (in)"],
    rows: [
      ["XS / 26", "26", "34", "29", "9"],
      ["S / 28", "28", "36", "29", "9.5"],
      ["M / 30", "30", "38", "30", "10"],
      ["L / 32", "32", "40", "30", "10.5"],
      ["XL / 34", "34", "42", "31", "11"],
      ["XXL / 36", "36", "44", "31", "11.5"],
    ],
  },
}

const measurementGuide = [
  {
    title: "Chest/Bust",
    description: "Measure around the fullest part of your chest/bust, keeping the tape horizontal.",
  },
  {
    title: "Waist",
    description: "Measure around your natural waistline, keeping the tape comfortably loose.",
  },
  {
    title: "Hip",
    description: "Measure around the fullest part of your hips, approximately 8 inches below your waist.",
  },
  {
    title: "Shoulder",
    description: "Measure from the edge of one shoulder to the other, across the back.",
  },
  {
    title: "Inseam",
    description: "Measure from the crotch seam to the bottom of the leg along the inner seam.",
  },
  {
    title: "Sleeve",
    description: "Measure from the shoulder seam to the wrist with arm slightly bent.",
  },
]

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState("mens-tops")

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="display-md text-foreground mb-4">Size Guide</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Find your perfect fit with our comprehensive size charts. All measurements are in inches. When in doubt, we recommend sizing up for a more comfortable fit.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {sizeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-6 py-3 rounded-md label-md transition-colors",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Size Table */}
      <div className="rounded-lg border border-border overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-surface-container-low">
              <tr>
                {sizeTables[activeCategory].headers.map((header) => (
                  <th key={header} className="px-6 py-4 text-left label-md text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sizeTables[activeCategory].rows.map((row, index) => (
                <tr key={index} className="hover:bg-secondary/50 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        "px-6 py-4 body-md",
                        cellIndex === 0 ? "text-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fit Tips */}
      <div className="rounded-lg bg-surface-container-low p-6 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="title-lg text-foreground">Fit Tips</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 body-md text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            If you&apos;re between sizes, we recommend sizing up for a relaxed fit or sizing down for a slim fit.
          </li>
          <li className="flex items-start gap-3 body-md text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Our blazers and structured pieces may fit slightly different - check product-specific sizing notes.
          </li>
          <li className="flex items-start gap-3 body-md text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Knitwear may have slight stretch - consider your preferred fit when selecting size.
          </li>
          <li className="flex items-start gap-3 body-md text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Each product page includes specific fit information (slim, regular, relaxed).
          </li>
        </ul>
      </div>

      {/* How to Measure */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Ruler className="h-5 w-5" />
          </div>
          <h2 className="headline-md text-foreground">How to Measure</h2>
        </div>

        <p className="body-md text-muted-foreground mb-6">
          For accurate measurements, use a soft measuring tape and wear lightweight clothing. Stand naturally and keep the tape snug but not tight.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {measurementGuide.map((item) => (
            <div key={item.title} className="p-4 rounded-lg border border-border">
              <h3 className="title-md text-foreground mb-2">{item.title}</h3>
              <p className="body-md text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help */}
      <div className="mt-12 rounded-lg bg-primary/5 border border-primary/20 p-6 text-center">
        <h3 className="title-lg text-foreground mb-2">Still Unsure About Your Size?</h3>
        <p className="body-md text-muted-foreground mb-4">
          Our styling team is happy to help you find your perfect fit. Send us your measurements and we&apos;ll recommend the best size for you.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Get Sizing Help
        </a>
      </div>
    </div>
  )
}
