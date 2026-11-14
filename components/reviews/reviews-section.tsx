"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BadgeCheck, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Stars } from "@/components/reviews/star-rating"

interface Review {
  id: string
  user_id: string | null
  customer_name: string
  rating: number
  title: string | null
  comment: string
  status: string
  is_verified_purchase: boolean
  created_at: string
}

interface Stats {
  average_rating: number | null
  total_reviews: number | null
  count_5: number | null
  count_4: number | null
  count_3: number | null
  count_2: number | null
  count_1: number | null
}

const PAGE_SIZE = 5
const REVIEW_COLS = "id, user_id, customer_name, rating, title, comment, status, is_verified_purchase, created_at"

export function ReviewsSection({ productId }: { productId: string }) {
  const supabase = createClient()
  const { user } = useAuth()
  const pathname = usePathname()

  const [stats, setStats] = useState<Stats | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [mine, setMine] = useState<Review | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    const { data } = await supabase
      .from("product_review_stats")
      .select("average_rating, total_reviews, count_5, count_4, count_3, count_2, count_1")
      .eq("product_id", productId)
      .maybeSingle()
    setStats((data as Stats | null) ?? null)
  }, [supabase, productId])

  const loadPage = useCallback(
    async (offset: number) => {
      const { data } = await supabase
        .from("reviews")
        .select(REVIEW_COLS)
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE) // one extra row tells us whether another page exists
      const rows = (data ?? []) as Review[]
      setHasMore(rows.length > PAGE_SIZE)
      return rows.slice(0, PAGE_SIZE)
    },
    [supabase, productId],
  )

  const loadMine = useCallback(async () => {
    if (!user) {
      setMine(null)
      return
    }
    const { data } = await supabase
      .from("reviews")
      .select(REVIEW_COLS)
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle()
    setMine((data as Review | null) ?? null)
  }, [supabase, productId, user])

  const refresh = useCallback(async () => {
    const [, rows] = await Promise.all([loadStats(), loadPage(0)])
    setReviews(rows)
    await loadMine()
    setLoading(false)
  }, [loadStats, loadPage, loadMine])

  useEffect(() => {
    refresh()
  }, [refresh])

  const loadMore = async () => {
    setLoadingMore(true)
    const rows = await loadPage(reviews.length)
    setReviews((prev) => [...prev, ...rows])
    setLoadingMore(false)
  }

  const openForm = () => {
    setError(null)
    setNotice(null)
    setRating(mine?.rating ?? 0)
    setTitle(mine?.title ?? "")
    setComment(mine?.comment ?? "")
    setFormOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (rating < 1) return setError("Please choose a star rating.")
    if (!comment.trim()) return setError("Please write a comment.")
    setSaving(true)
    setError(null)

    const name =
      (user.user_metadata?.full_name as string | undefined)?.trim() ||
      user.email?.split("@")[0] ||
      "Customer"

    const payload = { rating, title: title.trim() || null, comment: comment.trim() }
    const result = mine
      ? await supabase.from("reviews").update(payload).eq("id", mine.id)
      : await supabase.from("reviews").insert({
          ...payload,
          product_id: productId,
          user_id: user.id,
          customer_name: name,
          customer_email: user.email ?? null,
        })
    setSaving(false)

    if (result.error) {
      setError(result.error.code === "23505" ? "You have already reviewed this product." : result.error.message)
      return
    }
    setFormOpen(false)
    setNotice("Thanks! Your review has been saved.")
    refresh()
  }

  const remove = async () => {
    if (!mine || !window.confirm("Delete your review?")) return
    const { error: err } = await supabase.from("reviews").delete().eq("id", mine.id)
    if (err) return setError(err.message)
    setNotice("Your review was deleted.")
    refresh()
  }

  const total = stats?.total_reviews ?? 0
  const average = Number(stats?.average_rating ?? 0)
  const breakdown: [number, number][] = [
    [5, stats?.count_5 ?? 0],
    [4, stats?.count_4 ?? 0],
    [3, stats?.count_3 ?? 0],
    [2, stats?.count_2 ?? 0],
    [1, stats?.count_1 ?? 0],
  ]

  return (
    <section id="reviews" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
        <h2 className="display-sm font-serif tracking-tight text-foreground">Customer Reviews</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* Summary + write */}
          <div className="space-y-6">
            {total > 0 ? (
              <div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold text-foreground">{average.toFixed(1)}</span>
                  <div className="pb-1">
                    <Stars value={average} size="h-5 w-5" />
                    <p className="mt-1 body-md text-muted-foreground">
                      {total} review{total === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {breakdown.map(([star, count]) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-6 text-muted-foreground">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-amber-400" style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loading && <p className="body-md text-muted-foreground">No reviews yet. Be the first to review this product.</p>
            )}

            {user ? (
              mine ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={openForm}>Edit my review</Button>
                  <Button variant="ghost" onClick={remove} className="text-destructive">Delete</Button>
                </div>
              ) : (
                <Button onClick={openForm}>Write a review</Button>
              )
            ) : (
              <Button asChild>
                <Link href={`/login?redirectTo=${encodeURIComponent(pathname)}`}>Log in to write a review</Link>
              </Button>
            )}
            {notice && <p className="body-md text-primary">{notice}</p>}
          </div>

          {/* Form + list */}
          <div className="space-y-6">
            {formOpen && (
              <form onSubmit={submit} className="space-y-4 rounded-lg border border-border p-5">
                <h3 className="title-md font-semibold">{mine ? "Edit your review" : "Write a review"}</h3>
                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                      onMouseEnter={() => setHoverRating(n)}
                      onClick={() => setRating(n)}
                    >
                      <Star className={cn("h-7 w-7", n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
                    </button>
                  ))}
                </div>
                <Input placeholder="Title (optional)" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Share your experience with this product" rows={4} value={comment} maxLength={2000} onChange={(e) => setComment(e.target.value)} />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>{saving ? "Saving…" : mine ? "Update review" : "Submit review"}</Button>
                  <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                </div>
              </form>
            )}

            {mine && mine.status !== "approved" && !formOpen && (
              <p className="rounded-md bg-secondary px-4 py-3 body-md text-muted-foreground">
                Your review is currently {mine.status === "pending" ? "awaiting approval" : "hidden"} and isn&apos;t visible to others.
              </p>
            )}

            <ul className="divide-y divide-border">
              {reviews.map((r) => (
                <li key={r.id} className="py-5 first:pt-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars value={r.rating} />
                    <span className="font-medium text-foreground">{r.customer_name}</span>
                    {r.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {r.title && <p className="mt-2 font-semibold text-foreground">{r.title}</p>}
                  <p className="mt-1 whitespace-pre-wrap body-md text-muted-foreground">{r.comment}</p>
                </li>
              ))}
            </ul>

            {hasMore && (
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Load more"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
