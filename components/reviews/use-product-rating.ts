"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface ProductRating {
  average: number | null
  count: number
}

const cache = new Map<string, ProductRating>()
const waiters = new Map<string, Array<(r: ProductRating) => void>>()
let queue: string[] = []
let scheduled = false

// Batch all ids requested in the same tick into a single query so a grid of
// cards costs one request instead of one per card.
function flush() {
  scheduled = false
  const ids = queue
  queue = []
  if (ids.length === 0) return
  createClient()
    .from("product_review_stats")
    .select("product_id, average_rating, total_reviews")
    .in("product_id", ids)
    .then(({ data }) => {
      const found = new Map<string, ProductRating>()
      for (const row of data ?? []) {
        if (row.product_id) {
          found.set(row.product_id, { average: row.average_rating, count: row.total_reviews ?? 0 })
        }
      }
      for (const id of ids) {
        const rating = found.get(id) ?? { average: null, count: 0 }
        cache.set(id, rating)
        waiters.get(id)?.forEach((cb) => cb(rating))
        waiters.delete(id)
      }
    })
}

export function useProductRating(productId: string): ProductRating | null {
  const [rating, setRating] = useState<ProductRating | null>(cache.get(productId) ?? null)

  useEffect(() => {
    const cached = cache.get(productId)
    if (cached) {
      setRating(cached)
      return
    }
    const list = waiters.get(productId) ?? []
    list.push(setRating)
    waiters.set(productId, list)
    queue.push(productId)
    if (!scheduled) {
      scheduled = true
      setTimeout(flush, 0)
    }
  }, [productId])

  return rating
}
