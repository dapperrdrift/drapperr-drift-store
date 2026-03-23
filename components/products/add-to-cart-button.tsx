"use client"

import { useState } from "react"
import { ShoppingBag, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  disabled?: boolean
  productName: string
}

export function AddToCartButton({ disabled, productName }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    if (disabled) return
    
    setIsAdding(true)
    
    // Simulate adding to cart - will be replaced with actual logic
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setIsAdding(false)
    setIsAdded(true)
    
    // Reset after showing success
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="label-md text-foreground">Quantity</span>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 transition-colors hover:bg-surface-container-low disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center body-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 transition-colors hover:bg-surface-container-low"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={cn(
          "w-full py-6 label-md transition-all",
          isAdded
            ? "bg-green-600 hover:bg-green-600 text-white"
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
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {disabled ? "Select Options" : `Add to Cart - ${quantity} ${quantity === 1 ? "item" : "items"}`}
          </span>
        )}
      </Button>

      {/* Additional info */}
      <div className="space-y-2 pt-4 border-t border-border">
        <p className="body-md text-muted-foreground">
          Free shipping on orders over Rs. 5,000
        </p>
        <p className="body-md text-muted-foreground">
          Easy 30-day returns
        </p>
      </div>
    </div>
  )
}
