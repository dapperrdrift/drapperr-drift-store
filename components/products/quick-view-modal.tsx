"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VariantSelector } from "./variant-selector"
import { AddToCartButton } from "./add-to-cart-button"

interface Variant {
  id: string
  size: string
  color: string
  stock_quantity: number
  sku: string
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  productSlug: string
  productBase: {
    name: string
    price: number
    image: string | null
    category?: string
  }
}

export function QuickViewModal({ isOpen, onClose, productSlug, productBase }: QuickViewModalProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen) return

    async function fetchProduct() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            description,
            base_price,
            images,
            categories(name, slug),
            variants(id, size, color, sku, price_override, stock_quantity)
          `)
          .eq('slug' as any, productSlug)
          .eq('is_active', true)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (err) {
        console.error("Failed to load quick view data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [isOpen, productSlug])

  // Map variants for VariantSelector if product is loaded
  const variants: Variant[] = product?.variants?.map((v: any) => ({
    id: v.id,
    size: v.size,
    color: v.color,
    stock_quantity: v.stock_quantity,
    sku: v.sku,
  })) || []

  // Ensure accessible title for screen readers
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl sm:rounded-2xl border-none w-[95vw] sm:w-auto">
        <DialogTitle className="sr-only">Quick view for {productBase.name}</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 rounded-full p-1.5 bg-white/80 hover:bg-white text-foreground shadow-sm backdrop-blur-sm transition-all focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[88dvh] overflow-y-auto custom-scrollbar">
          {/* Left: Image */}
          <div className="relative h-52 sm:h-64 md:h-auto md:aspect-auto w-full md:min-h-75 bg-surface-container-low shrink-0">
            {product?.images?.[0] || productBase.image ? (
              <Image
                src={product?.images?.[0] || productBase.image}
                alt={productBase.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-6 md:p-8 flex flex-col h-full bg-background">
            {loading ? (
              <div className="flex items-center justify-center flex-1">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : product ? (
              <div className="flex flex-col flex-1 space-y-6">
                <div>
                  <Link 
                    href={`/products?category=${product.categories?.slug || 'all'}`} 
                    className="label-md text-primary hover:underline"
                    onClick={onClose}
                  >
                    {product.categories?.name || productBase.category}
                  </Link>
                  <Link href={`/products/${productSlug}`} onClick={onClose} className="hover:text-primary transition-colors">
                    <h2 className="mt-2 display-sm text-foreground">{product.name}</h2>
                  </Link>
                  <p className="mt-2 text-xl font-medium text-foreground">
                    ₹{(product.variants?.[0]?.price_override ?? product.base_price).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex-1">
                  {variants.length > 0 ? (
                    <VariantSelector variants={variants} onVariantChange={setSelectedVariant} />
                  ) : (
                    <p className="body-md text-muted-foreground">No variant options available.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <AddToCartButton
                    productName={product.name}
                    variants={variants}
                    selectedVariantId={selectedVariant?.id}
                  />
                  <Link 
                    href={`/products/${productSlug}`}
                    onClick={onClose}
                    className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                <p className="text-muted-foreground">Could not load product details.</p>
                <button onClick={onClose} className="text-primary hover:underline">
                  Go back
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
