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

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s) => s && s !== "Default")))

  const isSizeAvailable = (size: string): boolean =>
    variants.some((v) => v.size === size && v.stock_quantity > 0)

  const resolveVariant = (size: string | null): Variant | null => {
    if (!size) return null
    return (
      variants.find((v) => v.size === size && v.stock_quantity > 0) ??
      variants.find((v) => v.size === size) ??
      null
    )
  }

  const selectedVariant = resolveVariant(selectedSize)

  const handleSizeChange = (size: string) => {
    const next = selectedSize === size ? null : size
    setSelectedSize(next)
    onVariantChange?.(resolveVariant(next))
  }

  return (
    <>
      <div className="space-y-5 sm:space-y-6">
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

        {!selectedSize && sizes.length > 0 && (
          <p className="body-sm text-muted-foreground">
            Please select a size to continue.
          </p>
        )}
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
