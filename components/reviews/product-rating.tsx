"use client"

import { RatingSummary } from "@/components/reviews/star-rating"
import { useProductRating } from "@/components/reviews/use-product-rating"

export function ProductRating({ productId, className }: { productId: string; className?: string }) {
  const rating = useProductRating(productId)
  if (!rating) return null
  return <RatingSummary average={rating.average} count={rating.count} className={className} />
}
