"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  category: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Search logic — debounced live query against Supabase
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (searchQuery.trim().length < 2) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    debounceRef.current = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current
      const supabase = createClient()
      const term = searchQuery.trim()

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          base_price,
          images,
          categories(name),
          variants(price_override, stock_quantity)
        `)
        .eq("is_active", true)
        .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
        .limit(20)

      // Ignore stale responses from superseded requests
      if (currentRequestId !== requestIdRef.current) return

      if (error) {
        console.error("Product search failed:", error)
        setResults([])
        setIsSearching(false)
        return
      }

      const mapped: SearchResult[] = (data ?? [])
        .filter((p: any) => (p.variants ?? []).some((v: any) => v.stock_quantity > 0))
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug || p.id,
          price: p.variants?.[0]?.price_override ?? p.base_price,
          image: p.images?.[0] ?? null,
          category: p.categories?.name ?? "Uncategorized",
        }))

      setResults(mapped)
      setIsSearching(false)
    }, 300)
  }

  // Clean up any pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleResultClick = () => {
    setQuery("")
    setResults([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative mx-auto mt-20 max-w-2xl px-4">
        <div className="rounded-lg bg-card shadow-2xl">
          {/* Search input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent px-4 py-4 body-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {isSearching && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim().length >= 2 && !isSearching && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="body-lg text-muted-foreground">No products found for &quot;{query}&quot;</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-4">
                <p className="mb-4 label-md text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                <div className="space-y-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 rounded-md p-3 transition-colors hover:bg-secondary"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-surface-container-low">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="body-sm text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="title-md text-foreground truncate">{product.name}</p>
                        <p className="body-md text-muted-foreground">{product.category}</p>
                      </div>
                      <p className="title-md text-primary">
                        Rs. {product.price.toLocaleString("en-IN")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {query.trim().length < 2 && (
              <div className="p-6">
                <p className="label-md text-muted-foreground mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Cashmere", "Blazer", "Silk", "Overcoat", "Accessories"].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="rounded-full border border-border px-4 py-2 body-md text-foreground transition-colors hover:bg-secondary hover:border-primary"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
