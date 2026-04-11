"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, ShoppingCart, Plus, Eye, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { QuickViewModal } from "./quick-view-modal"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string | null
    category?: string
    isNew?: boolean
    variants?: { id: string }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { items, addItem, updateQty } = useCart()
  
  const isFavorite = isInWishlist(product.id)
  const [isQuickViewOpen, setQuickViewOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const hasSingleVariant = (product.variants?.length ?? 0) === 1
  const firstVariantId = product.variants?.[0]?.id
  const singleVariantCartItem = firstVariantId
    ? items.find((item) => item.variant_id === firstVariantId)
    : undefined
  const totalInCart = singleVariantCartItem?.quantity ?? 0

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.category) {
      router.push(`/products?category=${encodeURIComponent(product.category.toLowerCase())}`)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (hasSingleVariant && firstVariantId) {
      try {
        setIsAdding(true)
        await addItem(firstVariantId, 1)
      } finally {
        setIsAdding(false)
      }
    } else {
      // Multiple variants require size/color selection.
      setQuickViewOpen(true)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }
  return (
    <>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-3/4 overflow-hidden bg-surface-container-low rounded-md">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="body-md text-muted-foreground">No image</span>
          </div>
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-primary px-3 py-1 rounded label-md text-primary-foreground">
            New
          </span>
        )}
        
        {/* Action buttons overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-center gap-2">
            {/* Favorite button - Left */}
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-lg transition-all hover:scale-110",
                isFavorite ? "text-primary" : "text-foreground"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </button>
            
            {/* Quick View button - Center */}
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-lg text-foreground body-md transition-all hover:scale-105"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
              <span>Quick View</span>
            </button>

            {/* Add to Cart button - Right */}
            {totalInCart > 0 && hasSingleVariant ? (
              <div 
                className="flex items-center justify-between h-10 w-24 bg-primary text-primary-foreground rounded-full shadow-lg px-1 transition-all"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button
                  onClick={async (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (!singleVariantCartItem) return
                    await updateQty(singleVariantCartItem.id, singleVariantCartItem.quantity - 1)
                  }}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="body-md font-medium w-4 text-center">{totalInCart}</span>
                <button
                  onClick={async (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (!singleVariantCartItem) return
                    await updateQty(singleVariantCartItem.id, singleVariantCartItem.quantity + 1)
                  }}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110",
                  isAdding && "opacity-75 cursor-not-allowed"
                )}
                aria-label="Add to cart"
              >
                {isAdding ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 absolute" />
                    <ShoppingCart className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        {product.category && (
          <button
            onClick={handleCategoryClick}
            className="label-md text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {product.category}
          </button>
        )}
        <h3 className="mt-1 title-md text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 title-md text-primary font-semibold">
          Rs. {product.price.toLocaleString("en-IN")}
        </p>
      </div>
      </Link>
      <QuickViewModal 
        isOpen={isQuickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        productSlug={product.slug}
        productBase={{
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }}
      />
    </>
  )
}
