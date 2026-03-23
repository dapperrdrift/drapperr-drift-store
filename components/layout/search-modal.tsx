"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock products for search
const allProducts = [
  { id: "1", name: "Cashmere Knit Sweater", slug: "cashmere-knit-sweater", price: 12500, image: "/images/product-1.jpg", category: "Knitwear" },
  { id: "2", name: "Tailored Wool Blazer", slug: "tailored-wool-blazer", price: 24500, image: "/images/product-2.jpg", category: "Outerwear" },
  { id: "3", name: "Silk Wide-Leg Trousers", slug: "silk-wide-leg-trousers", price: 8900, image: "/images/product-3.jpg", category: "Bottoms" },
  { id: "4", name: "Leather Belt with Gold Buckle", slug: "leather-belt-gold-buckle", price: 4500, image: "/images/product-4.jpg", category: "Accessories" },
  { id: "5", name: "Premium Cotton Shirt", slug: "premium-cotton-shirt", price: 6800, image: "/images/product-5.jpg", category: "Tops" },
  { id: "6", name: "Camel Wool Overcoat", slug: "camel-wool-overcoat", price: 35000, image: "/images/product-6.jpg", category: "Outerwear" },
  { id: "7", name: "Designer Denim Jeans", slug: "designer-denim-jeans", price: 9800, image: "/images/product-7.jpg", category: "Bottoms" },
  { id: "8", name: "Silk Patterned Scarf", slug: "silk-patterned-scarf", price: 3200, image: "/images/product-8.jpg", category: "Accessories" },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof allProducts>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Search logic
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
      setIsSearching(false)
    }, 300)
  }

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
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
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
