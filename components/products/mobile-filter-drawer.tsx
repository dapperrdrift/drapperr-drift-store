"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { ProductFilters } from "@/components/products/product-filters"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileFilterDrawerProps {
  initialCategory: string
  categories: { slug: string; name: string; count: number }[]
}

export function MobileFilterDrawer({
  initialCategory,
  categories,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden fixed bottom-22 left-1/2 z-40 -translate-x-1/2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-background shadow-2xl label-md"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[82vh] rounded-t-2xl p-0">
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle className="label-md text-foreground">Filter Products</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto px-4 pb-10 pt-4">
            <ProductFilters
              initialCategory={initialCategory}
              categories={categories}
              onFilterChange={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
