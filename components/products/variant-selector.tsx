"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Variant {
  size: string
  color: string
  colorHex: string
  stock: number
  sku: string
}

interface VariantSelectorProps {
  variants: Variant[]
  onVariantChange?: (variant: Variant | null) => void
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Get unique colors and sizes
  const colors = Array.from(new Map(variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values())
  const sizes = Array.from(new Set(variants.map((v) => v.size)))

  // Get available sizes for selected color
  const availableSizes = selectedColor
    ? variants.filter((v) => v.color === selectedColor && v.stock > 0).map((v) => v.size)
    : sizes

  // Get available colors for selected size
  const availableColors = selectedSize
    ? variants.filter((v) => v.size === selectedSize && v.stock > 0).map((v) => v.color)
    : colors.map((c) => c.name)

  // Get selected variant
  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    // Reset size if not available in new color
    if (selectedSize && !variants.find((v) => v.color === color && v.size === selectedSize && v.stock > 0)) {
      setSelectedSize(null)
      onVariantChange?.(null)
    } else if (selectedSize) {
      const variant = variants.find((v) => v.color === color && v.size === selectedSize)
      onVariantChange?.(variant || null)
    }
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    if (selectedColor) {
      const variant = variants.find((v) => v.color === selectedColor && v.size === size)
      onVariantChange?.(variant || null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Color selector */}
      <div>
        <div className="flex items-center justify-between">
          <span className="label-md text-foreground">Color</span>
          {selectedColor && <span className="body-md text-muted-foreground">{selectedColor}</span>}
        </div>
        <div className="mt-3 flex gap-2">
          {colors.map((color) => {
            const isAvailable = availableColors.includes(color.name)
            return (
              <button
                key={color.name}
                onClick={() => isAvailable && handleColorChange(color.name)}
                disabled={!isAvailable}
                className={cn(
                  "relative h-10 w-10 border-2 transition-all",
                  selectedColor === color.name
                    ? "border-foreground scale-110"
                    : "border-transparent hover:border-muted-foreground",
                  !isAvailable && "opacity-30 cursor-not-allowed"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                title={color.name}
              >
                {!isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-[1px] w-full rotate-45 bg-foreground/50" />
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
          <button className="body-md text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Size Guide
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isAvailable = availableSizes.includes(size)
            return (
              <button
                key={size}
                onClick={() => isAvailable && handleSizeChange(size)}
                disabled={!isAvailable}
                className={cn(
                  "min-w-[48px] px-4 py-3 border label-md transition-colors",
                  selectedSize === size
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground",
                  !isAvailable && "opacity-30 cursor-not-allowed line-through"
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stock indicator */}
      {selectedVariant && (
        <div className="flex items-center gap-2">
          {selectedVariant.stock <= 5 && selectedVariant.stock > 0 ? (
            <span className="body-md text-destructive">Only {selectedVariant.stock} left in stock</span>
          ) : selectedVariant.stock > 0 ? (
            <span className="body-md text-muted-foreground">In stock</span>
          ) : (
            <span className="body-md text-destructive">Out of stock</span>
          )}
        </div>
      )}
    </div>
  )
}
