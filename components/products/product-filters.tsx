"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "All" },
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
  { id: "outerwear", name: "Outerwear" },
  { id: "knitwear", name: "Knitwear" },
  { id: "bottoms", name: "Bottoms" },
  { id: "accessories", name: "Accessories" },
]

const sortOptions = [
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "name", name: "Name: A to Z" },
]

const colors = [
  { id: "black", name: "Black", hex: "#1C1B1B" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "cream", name: "Cream", hex: "#F5F0E6" },
  { id: "camel", name: "Camel", hex: "#C9A84C" },
  { id: "gray", name: "Gray", hex: "#7E7665" },
  { id: "navy", name: "Navy", hex: "#1B2838" },
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

interface ProductFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  category: string
  sort: string
  colors: string[]
  sizes: string[]
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    sort: "newest",
    colors: [],
    sizes: [],
  })
  const [openSection, setOpenSection] = useState<string | null>(null)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const toggleColor = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter((c) => c !== colorId)
      : [...filters.colors, colorId]
    updateFilters({ colors: newColors })
  }

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    updateFilters({ sizes: newSizes })
  }

  const clearFilters = () => {
    updateFilters({ category: "all", colors: [], sizes: [] })
  }

  const activeFiltersCount = filters.colors.length + filters.sizes.length + (filters.category !== "all" ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-md text-muted-foreground">Active filters:</span>
          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 bg-surface-container-low px-3 py-1 body-md">
              {categories.find((c) => c.id === filters.category)?.name}
              <button onClick={() => updateFilters({ category: "all" })} aria-label="Remove category filter">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.colors.map((colorId) => (
            <span key={colorId} className="inline-flex items-center gap-1 bg-surface-container-low px-3 py-1 body-md">
              {colors.find((c) => c.id === colorId)?.name}
              <button onClick={() => toggleColor(colorId)} aria-label={`Remove ${colorId} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.sizes.map((size) => (
            <span key={size} className="inline-flex items-center gap-1 bg-surface-container-low px-3 py-1 body-md">
              Size {size}
              <button onClick={() => toggleSize(size)} aria-label={`Remove size ${size} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="label-md">
            Clear all
          </Button>
        </div>
      )}

      {/* Filter sections */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category filter */}
        <div className="relative">
          <button
            onClick={() => setOpenSection(openSection === "category" ? null : "category")}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 label-md text-foreground transition-colors hover:border-foreground"
          >
            Category
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSection === "category" && "rotate-180")} />
          </button>
          {openSection === "category" && (
            <div className="absolute left-0 top-full z-10 mt-2 min-w-[160px] bg-card border border-border p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    updateFilters({ category: category.id })
                    setOpenSection(null)
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left body-md transition-colors hover:bg-surface-container-low",
                    filters.category === category.id && "text-primary font-medium"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color filter */}
        <div className="relative">
          <button
            onClick={() => setOpenSection(openSection === "color" ? null : "color")}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 label-md text-foreground transition-colors hover:border-foreground"
          >
            Color
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSection === "color" && "rotate-180")} />
          </button>
          {openSection === "color" && (
            <div className="absolute left-0 top-full z-10 mt-2 min-w-[160px] bg-card border border-border p-3">
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={cn(
                      "h-8 w-8 border-2 transition-all",
                      filters.colors.includes(color.id) ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size filter */}
        <div className="relative">
          <button
            onClick={() => setOpenSection(openSection === "size" ? null : "size")}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 label-md text-foreground transition-colors hover:border-foreground"
          >
            Size
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSection === "size" && "rotate-180")} />
          </button>
          {openSection === "size" && (
            <div className="absolute left-0 top-full z-10 mt-2 min-w-[200px] bg-card border border-border p-3">
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "min-w-[40px] px-3 py-2 border label-md transition-colors",
                      filters.sizes.includes(size)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <button
            onClick={() => setOpenSection(openSection === "sort" ? null : "sort")}
            className="inline-flex items-center gap-2 px-4 py-2 label-md text-muted-foreground transition-colors hover:text-foreground"
          >
            Sort: {sortOptions.find((s) => s.id === filters.sort)?.name}
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSection === "sort" && "rotate-180")} />
          </button>
          {openSection === "sort" && (
            <div className="absolute right-0 top-full z-10 mt-2 min-w-[180px] bg-card border border-border p-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    updateFilters({ sort: option.id })
                    setOpenSection(null)
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left body-md transition-colors hover:bg-surface-container-low",
                    filters.sort === option.id && "text-primary font-medium"
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
