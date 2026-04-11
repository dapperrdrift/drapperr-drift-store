"use client"

import { useState } from "react"
import { VariantSelector } from "@/components/products/variant-selector"
import { AddToCartButton } from "@/components/products/add-to-cart-button"

export interface ProductVariant {
  id: string
  size: string
  color: string
  stock_quantity: number
  sku: string
}

interface ProductInfoProps {
  productName: string
  variants: ProductVariant[]
}

export function ProductInfo({ productName, variants }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  return (
    <>
      {/* Variant selector */}
      <div className="pt-2">
        <VariantSelector
          variants={variants}
          onVariantChange={setSelectedVariant}
        />
      </div>

      {/* Add to cart */}
      <div className="pt-4">
        <AddToCartButton
          productName={productName}
          variants={variants}
          selectedVariantId={selectedVariant?.id}
          disabled={!selectedVariant}
        />
      </div>
    </>
  )
}
