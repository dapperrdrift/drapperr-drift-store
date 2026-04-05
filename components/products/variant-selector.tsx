"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SizeGuideModal } from "@/components/products/size-guide-modal"

interface Variant {
  id: string
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
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // Get unique colors and sizes
  const colors = Array.from(new Map(variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values())
  const sizes = Array.from(new Set(variants.map((v) => v.size)))

  // Get available sizes for selected color
  const availableSizes = selectedColor
    ? variants.filter((v) => v.color === selectedColor && (v.stock > 0 || v.stock === null)).map((v) => v.size)
    : Array.from(new Set(variants.filter((v) => v.stock > 0 || v.stock === null).map((v) => v.size)))

  // Get available colors for selected size
  const availableColors = selectedSize
    ? variants.filter((v) => v.size === selectedSize && (v.stock > 0 || v.stock === null)).map((v) => v.color)
    : Array.from(new Set(variants.filter((v) => v.stock > 0 || v.stock === null).map((v) => v.color)))

  // Get selected variant
  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    // Reset size if not available in new color
    if (selectedSize && !variants.find((v) => v.color === color && v.size === selectedSize && (v.stock > 0 || v.stock === null))) {
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
    <>
      <div className="space-y-6">
        {/* Color selector */}
        <div>
          <div className="flex items-center justify-between">
            <span className="label-md text-foreground">Color</span>
            {selectedColor && <span className="body-md text-muted-foreground">{selectedColor}</span>}
          </div>
          <div className="mt-3 flex gap-3">
            {colors.map((color) => {
              const isAvailable = availableColors.includes(color.name)
              const isSelected = selectedColor === color.name
              return (
                <button
                  key={color.name}
                  onClick={() => isAvailable && handleColorChange(color.name)}
                  disabled={!isAvailable}
                  className={cn(
                    "relative h-10 w-10 rounded-full border-2 transition-all",
                    isSelected
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border hover:border-muted-foreground",
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
            <button 
              onClick={() => setSizeGuideOpen(true)}
              className="body-md text-primary underline underline-offset-4 hover:text-primary-hover transition-colors"
            >
              Size Guide
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = availableSizes.includes(size)
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeChange(size)}
                  disabled={!isAvailable}
                  className={cn(
                    "min-w-[52px] px-4 py-3 border rounded-md label-md transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary hover:text-primary",
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
              <span className="body-md text-primary font-medium">Only {selectedVariant.stock} left in stock</span>
            ) : selectedVariant.stock > 0 ? (
              <span className="body-md text-muted-foreground">In stock</span>
            ) : (
              <span className="body-md text-destructive">Out of stock</span>
            )}
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
