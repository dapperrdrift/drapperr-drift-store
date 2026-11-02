"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size", "28", "30", "32", "34", "36"]

const sortOptions = [
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "name", name: "Name: A to Z" },
]

export interface FilterState {
  category: string
  sort: string
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
    sizes: [],
  })
  const [categorySearch, setCategorySearch] = useState("")

  useEffect(() => {
    const catFromUrl = searchParams.get("category")
    const sizesFromUrl = searchParams.get("sizes")
    const sortFromUrl = searchParams.get("sort")

    setFilters((prev) => ({
      ...prev,
      category: catFromUrl || "all",
      sizes: sizesFromUrl ? sizesFromUrl.split(",") : prev.sizes,
      sort: sortFromUrl || prev.sort,
    }))
  }, [searchParams])

  const pushFilters = useCallback(
    (updated: FilterState) => {
      const params = new URLSearchParams()
      if (updated.category && updated.category !== "all") params.set("category", updated.category)
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

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    updateFilters({ sizes: newSizes })
  }

  const clearFilters = () => {
    updateFilters({ category: "all", sizes: [], sort: "newest" })
    setCategorySearch("")
  }

  const activeFiltersCount =
    filters.sizes.length + (filters.category !== "all" ? 1 : 0)

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories
    const q = categorySearch.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, categorySearch])

  return (
    <aside className="space-y-1">
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
