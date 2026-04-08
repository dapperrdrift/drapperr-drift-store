"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Color options — exact match with admin's ProductManagement modal   */
/* ------------------------------------------------------------------ */
const COLOR_OPTIONS = [
  { id: "black",      name: "Black",      hex: "#1C1B1B" },
  { id: "white",      name: "White",      hex: "#FFFFFF" },
  { id: "navy",       name: "Navy",       hex: "#1B2838" },
  { id: "blue",       name: "Blue",       hex: "#2563EB" },
  { id: "indigo",     name: "Indigo",     hex: "#4338CA" },
  { id: "grey",       name: "Grey",       hex: "#6B7280" },
  { id: "brown",      name: "Brown",      hex: "#78350F" },
  { id: "beige",      name: "Beige",      hex: "#D4C5A9" },
  { id: "olive",      name: "Olive",      hex: "#556B2F" },
  { id: "green",      name: "Green",      hex: "#16A34A" },
  { id: "red",        name: "Red",        hex: "#DC2626" },
  { id: "maroon",     name: "Maroon",     hex: "#7F1D1D" },
  { id: "pink",       name: "Pink",       hex: "#EC4899" },
  { id: "purple",     name: "Purple",     hex: "#9333EA" },
  { id: "orange",     name: "Orange",     hex: "#EA580C" },
  { id: "yellow",     name: "Yellow",     hex: "#EAB308" },
  { id: "gold",       name: "Gold",       hex: "#B8860B" },
  { id: "silver",     name: "Silver",     hex: "#C0C0C0" },
  { id: "multicolor", name: "Multicolor", hex: "conic-gradient(red,orange,yellow,green,blue,violet,red)" },
]

/* ------------------------------------------------------------------ */
/*  Size options — exact match with admin's ProductManagement modal     */
/* ------------------------------------------------------------------ */
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size", "28", "30", "32", "34", "36"]

const sortOptions = [
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "name", name: "Name: A to Z" },
]

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface FilterState {
  category: string
  sort: string
  colors: string[]
  sizes: string[]
}

interface CategoryItem {
  slug: string
  name: string
  count: number
}

interface ProductFiltersProps {
  onFilterChange?: (filters: FilterState) => void
  initialCategory?: string
  categories: CategoryItem[]
}

/* ------------------------------------------------------------------ */
/*  Collapsible sidebar section                                        */
/* ------------------------------------------------------------------ */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2"
      >
        <span className="label-md text-foreground uppercase tracking-wider">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Sidebar                                                       */
/* ------------------------------------------------------------------ */
export function ProductFilters({
  onFilterChange,
  initialCategory = "all",
  categories,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    sort: "newest",
    colors: [],
    sizes: [],
  })
  const [categorySearch, setCategorySearch] = useState("")

  // Sync URL → state
  useEffect(() => {
    const catFromUrl = searchParams.get("category")
    const colorsFromUrl = searchParams.get("colors")
    const sizesFromUrl = searchParams.get("sizes")
    const sortFromUrl = searchParams.get("sort")

    setFilters((prev) => ({
      ...prev,
      category: catFromUrl || "all",
      colors: colorsFromUrl ? colorsFromUrl.split(",") : prev.colors,
      sizes: sizesFromUrl ? sizesFromUrl.split(",") : prev.sizes,
      sort: sortFromUrl || prev.sort,
    }))
  }, [searchParams])

  /* ---- helpers ---- */
  const pushFilters = useCallback(
    (updated: FilterState) => {
      const params = new URLSearchParams()
      if (updated.category && updated.category !== "all") params.set("category", updated.category)
      if (updated.colors.length > 0) params.set("colors", updated.colors.join(","))
      if (updated.sizes.length > 0) params.set("sizes", updated.sizes.join(","))
      if (updated.sort && updated.sort !== "newest") params.set("sort", updated.sort)
      const qs = params.toString()
      router.push(`/products${qs ? `?${qs}` : ""}`)
    },
    [router]
  )

  const updateFilters = useCallback(
    (partial: Partial<FilterState>) => {
      const updated = { ...filters, ...partial }
      setFilters(updated)
      onFilterChange?.(updated)
      pushFilters(updated)
    },
    [filters, onFilterChange, pushFilters]
  )

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
    updateFilters({ category: "all", colors: [], sizes: [], sort: "newest" })
    setCategorySearch("")
  }

  const activeFiltersCount =
    filters.colors.length + filters.sizes.length + (filters.category !== "all" ? 1 : 0)

  /* ---- filtered categories list ---- */
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories
    const q = categorySearch.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, categorySearch])

  return (
    <aside className="space-y-1">
      {/* ── Active filter pills ── */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border mb-4">
          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full body-md">
              {categories.find((c) => c.slug === filters.category)?.name || filters.category}
              <button onClick={() => updateFilters({ category: "all" })} aria-label="Remove category filter">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.colors.map((colorId) => (
            <span key={colorId} className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full body-md">
              <span
                className="inline-block w-3 h-3 rounded-full border border-border"
                style={{
                  background: COLOR_OPTIONS.find((c) => c.id === colorId)?.hex || "#ccc",
                }}
              />
              {COLOR_OPTIONS.find((c) => c.id === colorId)?.name}
              <button onClick={() => toggleColor(colorId)} aria-label={`Remove ${colorId} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.sizes.map((size) => (
            <span key={size} className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full body-md">
              {size}
              <button onClick={() => toggleSize(size)} aria-label={`Remove size ${size} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button onClick={clearFilters} className="label-md text-primary hover:underline ml-1">
            Clear all
          </button>
        </div>
      )}

      {/* ── CATEGORIES ── */}
      <FilterSection title="Categories" defaultOpen>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Search for Categories"
            className="w-full border border-border rounded bg-transparent pl-8 pr-3 py-2 body-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <ul className="space-y-0.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredCategories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category === cat.slug}
                  onChange={() =>
                    updateFilters({ category: filters.category === cat.slug ? "all" : cat.slug })
                  }
                  className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
                />
                <span className="flex-1 body-md text-foreground group-hover:text-primary transition-colors truncate">
                  {cat.name}
                </span>
                <span className="body-sm text-muted-foreground tabular-nums">{cat.count}</span>
              </label>
            </li>
          ))}
          {filteredCategories.length === 0 && (
            <li className="py-2 body-sm text-muted-foreground">No categories match</li>
          )}
        </ul>
      </FilterSection>

      {/* ── COLORS ── */}
      <FilterSection title="Colors" defaultOpen>
        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          {COLOR_OPTIONS.map((color) => (
            <label key={color.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.colors.includes(color.id)}
                onChange={() => toggleColor(color.id)}
                className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
              />
              <span
                className="inline-block w-4 h-4 rounded-full border border-border/60 flex-shrink-0"
                style={{
                  background: color.hex,
                }}
              />
              <span className="flex-1 body-md text-foreground group-hover:text-primary transition-colors">
                {color.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── SIZES ── */}
      <FilterSection title="Sizes" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "min-w-[42px] px-3 py-2 border rounded body-md transition-all duration-200",
                filters.sizes.includes(size)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── SORT ── */}
      <FilterSection title="Sort By" defaultOpen={false}>
        <ul className="space-y-0.5">
          {sortOptions.map((option) => (
            <li key={option.id}>
              <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === option.id}
                  onChange={() => updateFilters({ sort: option.id })}
                  className="h-4 w-4 border-border text-primary accent-primary cursor-pointer"
                />
                <span
                  className={cn(
                    "body-md transition-colors",
                    filters.sort === option.id
                      ? "text-primary font-medium"
                      : "text-foreground group-hover:text-primary"
                  )}
                >
                  {option.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>
    </aside>
  )
}
