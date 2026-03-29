"use client"

import { useState } from "react"
import { ShoppingBag, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"

interface Variant {
  id: string
  size: string
  color: string
  stock_quantity: number
  sku: string
}

interface AddToCartButtonProps {
  disabled?: boolean
  productName: string
  productId?: string
  variants?: Variant[]
  selectedVariantId?: string
}

export function AddToCartButton({ disabled, productName, variants = [], selectedVariantId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  // Determine current variant and stock
  const currentVariant = variants.find(v => v.id === selectedVariantId) ?? variants[0]
  const maxStock = currentVariant?.stock_quantity ?? 0
  const isOutOfStock = maxStock === 0

  const handleAddToCart = async () => {
    if (disabled || isOutOfStock || !currentVariant) return

    setIsAdding(true)
    try {
      await addItem(currentVariant.id, quantity)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (err) {
      console.error('Add to cart failed:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const isDisabled = disabled || isOutOfStock || !currentVariant || isAdding

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="label-md text-foreground">Quantity</span>
        <div className="flex items-center border border-border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 transition-colors hover:bg-secondary disabled:opacity-50 rounded-l-md"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center body-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxStock || 10, quantity + 1))}
            className="p-3 transition-colors hover:bg-secondary rounded-r-md disabled:opacity-50"
            disabled={quantity >= (maxStock || 10)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {maxStock > 0 && maxStock <= 5 && (
          <span className="body-sm text-orange-600">Only {maxStock} left!</span>
        )}
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={cn(
          "w-full py-6 label-md transition-all",
          isAdded
            ? "bg-green-600 hover:bg-green-600 text-white"
            : isOutOfStock
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary hover:bg-primary-hover text-primary-foreground"
        )}
      >
        {isAdding ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Adding...
          </span>
        ) : isAdded ? (
          <span className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Added to Cart
          </span>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {disabled ? "Select Options" : `Add to Cart — ${quantity} ${quantity === 1 ? "item" : "items"}`}
          </span>
        )}
      </Button>
    </div>
  )
}
