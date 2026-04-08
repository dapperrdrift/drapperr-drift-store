"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, ShoppingCart, Plus, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/contexts/wishlist-context"
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
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const isFavorite = isInWishlist(product.id)
  const [isQuickViewOpen, setQuickViewOpen] = useState(false)

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Open Quick View Modal to let user select variant before adding to cart
    setQuickViewOpen(true)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }
  return (
    <>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low rounded-md">
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
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110"
              )}
              aria-label="Add to cart"
            >
              <Plus className="h-4 w-4 absolute" />
              <ShoppingCart className="h-5 w-5" />
            </button>
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
