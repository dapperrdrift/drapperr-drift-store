"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SizeGuideModal } from "@/components/products/size-guide-modal"

interface Variant {
  id: string
  size: string
  color: string
  stock_quantity: number
  sku: string
}

interface VariantSelectorProps {
  variants: Variant[]
  onVariantChange?: (variant: Variant | null) => void
}

// Map known color names to actual CSS hex values
const COLOR_MAP: Record<string, string> = {
  navy: "#001f5b",
  "sky blue": "#87ceeb",
  "sky-blue": "#87ceeb",
  skyblue: "#87ceeb",
  white: "#ffffff",
  black: "#000000",
  maroon: "#800000",
  olive: "#808000",
  wine: "#722f37",
  emerald: "#50c878",
  rose: "#ff007f",
  ivory: "#fffff0",
  champagne: "#f7e7ce",
  beige: "#f5f5dc",
  camel: "#c19a6b",
  grey: "#808080",
  gray: "#808080",
  charcoal: "#36454f",
  red: "#dc2626",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#eab308",
  orange: "#ea580c",
  purple: "#9333ea",
  pink: "#ec4899",
  brown: "#92400e",
  cream: "#fffdd0",
  mint: "#98ff98",
  lavender: "#e6e6fa",
  coral: "#ff6b6b",
  teal: "#008080",
  mustard: "#e1ad01",
  rust: "#b7410e",
  sage: "#b2ac88",
  blush: "#de5d83",
  indigo: "#4b0082",
  tan: "#d2b48c",
  khaki: "#c3b091",
  slate: "#708090",
  peach: "#ffcba4",
  cobalt: "#0047ab",
}

function getColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim()
  return COLOR_MAP[key] ?? "#888888"
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // Unique colors & sizes across ALL variants
  const colors = Array.from(
    new Map(variants.map((v) => [v.color, { name: v.color, hex: getColorHex(v.color) }])).values()
  )
  const sizes = Array.from(new Set(variants.map((v) => v.size)))

  // A color is available if:
  //   • No size is selected: it has AT LEAST ONE variant with stock > 0
  //   • A size IS selected: there exists a variant with that size AND this color that has stock > 0
  const isColorAvailable = (colorName: string): boolean => {
    if (selectedSize) {
      return variants.some(
        (v) => v.color === colorName && v.size === selectedSize && v.stock_quantity > 0
      )
    }
    return variants.some((v) => v.color === colorName && v.stock_quantity > 0)
  }

  // A size is available if:
  //   • No color is selected: it has AT LEAST ONE variant with stock > 0
  //   • A color IS selected: there exists a variant with that color AND this size with stock > 0
  const isSizeAvailable = (size: string): boolean => {
    if (selectedColor) {
      return variants.some(
        (v) => v.size === size && v.color === selectedColor && v.stock_quantity > 0
      )
    }
    return variants.some((v) => v.size === size && v.stock_quantity > 0)
  }

  // Get the currently selected variant (only when both are chosen)
  const selectedVariant = selectedColor && selectedSize
    ? variants.find((v) => v.color === selectedColor && v.size === selectedSize) ?? null
    : null

  const handleColorChange = (color: string) => {
    const next = selectedColor === color ? null : color
    setSelectedColor(next)

    // If currently selected size is no longer valid with new color, reset it
    if (next && selectedSize) {
      const stillValid = variants.some(
        (v) => v.color === next && v.size === selectedSize && v.stock_quantity > 0
      )
      if (!stillValid) {
        setSelectedSize(null)
        onVariantChange?.(null)
        return
      }
    }

    // Resolve variant
    const variant = next && selectedSize
      ? variants.find((v) => v.color === next && v.size === selectedSize) ?? null
      : null
    onVariantChange?.(variant)
  }

  const handleSizeChange = (size: string) => {
    const next = selectedSize === size ? null : size
    setSelectedSize(next)

    // If currently selected color is no longer valid with new size, reset it
    if (next && selectedColor) {
      const stillValid = variants.some(
        (v) => v.size === next && v.color === selectedColor && v.stock_quantity > 0
      )
      if (!stillValid) {
        setSelectedColor(null)
        onVariantChange?.(null)
        return
      }
    }

    const variant = selectedColor && next
      ? variants.find((v) => v.color === selectedColor && v.size === next) ?? null
      : null
    onVariantChange?.(variant)
  }

  return (
    <>
      <div className="space-y-5 sm:space-y-6">
        {/* Color selector */}
        <div>
          <div className="flex items-center justify-between">
            <span className="label-md text-foreground">Color</span>
            {selectedColor && (
              <span className="body-md text-muted-foreground capitalize">{selectedColor}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            {colors.map((color) => {
              const available = isColorAvailable(color.name)
              const isSelected = selectedColor === color.name
              return (
                <button
                  key={color.name}
                  onClick={() => available && handleColorChange(color.name)}
                  disabled={!available}
                  className={cn(
                    "relative h-9 w-9 rounded-full border-2 transition-all sm:h-10 sm:w-10",
                    isSelected
                      ? "border-primary ring-2 ring-primary ring-offset-2 scale-110"
                      : available
                      ? "border-border hover:border-muted-foreground hover:scale-105"
                      : "opacity-30 cursor-not-allowed"
                  )}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                  title={!available ? `${color.name} — out of stock` : color.name}
                >
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                      <span className="h-px w-full rotate-45 bg-foreground/50" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Size selector */}
        <div>
          <div className="flex items-center justify-between">
            <span className="label-md text-foreground">Size</span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="body-md text-primary underline underline-offset-4 hover:text-primary-hover transition-colors"
            >
              Size Guide
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = isSizeAvailable(size)
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => available && handleSizeChange(size)}
                  disabled={!available}
                  className={cn(
                    "min-w-11 sm:min-w-13 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-md label-md transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : available
                      ? "border-border text-foreground hover:border-primary hover:text-primary"
                      : "opacity-30 cursor-not-allowed line-through text-muted-foreground"
                  )}
                  title={!available ? `${size} — out of stock` : size}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stock indicator — only shown after both are selected */}
        {selectedVariant && (
          <div className="flex items-center gap-2">
            {selectedVariant.stock_quantity <= 0 ? (
              <span className="body-md text-destructive font-medium">Out of stock</span>
            ) : selectedVariant.stock_quantity <= 5 ? (
              <span className="body-md text-orange-600 font-medium">
                Only {selectedVariant.stock_quantity} left in stock — hurry!
              </span>
            ) : (
              <span className="body-md text-green-600 font-medium">In stock</span>
            )}
          </div>
        )}

        {/* Prompt if neither selected */}
        {!selectedColor && !selectedSize && variants.length > 0 && (
          <p className="body-sm text-muted-foreground">
            Please select a color and size to continue.
          </p>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
