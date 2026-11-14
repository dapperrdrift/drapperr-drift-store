"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function Stars({ value, size = "h-4 w-4", className }: { value: number; size?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(size, n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  )
}

/** Compact average rating + count, used on cards and quick view. Renders nothing when there are no reviews. */
export function RatingSummary({ average, count, className }: { average: number | null; count: number; className?: string }) {
  if (!count || !average) return null
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <Stars value={average} size="h-3.5 w-3.5" />
      <span className="font-medium text-foreground">{Number(average).toFixed(1)}</span>
      <span>({count})</span>
    </span>
  )
}
