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
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-linear-to-t from-foreground/40 to-transparent opacity-100 transition-opacity duration-300 md:pointer-events-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:pointer-events-auto">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {/* Favorite button - Left */}
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-lg transition-all hover:scale-110 sm:h-10 sm:w-10",
                isFavorite ? "text-primary" : "text-foreground"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isFavorite && "fill-current")} />
            </button>
            
            {/* Quick View button - Center */}
            <button
              onClick={handleQuickView}
              className="flex items-center gap-1 px-2.5 py-2 sm:gap-2 sm:px-4 bg-card rounded-full shadow-lg text-foreground body-md transition-all hover:scale-105"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Quick View</span>
            </button>

            {/* Add to Cart button - Right */}
            {totalInCart > 0 && hasSingleVariant ? (
              <div 
                className="flex h-9 w-21 items-center justify-between rounded-full bg-primary px-1 text-primary-foreground shadow-lg transition-all sm:h-10 sm:w-24"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button
                  onClick={async (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (!singleVariantCartItem) return
                    await updateQty(singleVariantCartItem.id, singleVariantCartItem.quantity - 1)
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/20 sm:h-8 sm:w-8"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-4 text-center body-md font-medium">{totalInCart}</span>
                <button
                  onClick={async (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (!singleVariantCartItem) return
                    await updateQty(singleVariantCartItem.id, singleVariantCartItem.quantity + 1)
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/20 sm:h-8 sm:w-8"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 sm:h-10 sm:w-10",
                  isAdding && "opacity-75 cursor-not-allowed"
                )}
                aria-label="Add to cart"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                ) : (
                  <>
                    <Plus className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4">
        {product.category && (
          <button
            onClick={handleCategoryClick}
            className="label-md text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {product.category}
          </button>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:title-md">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-primary sm:mt-2 sm:title-md">
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
