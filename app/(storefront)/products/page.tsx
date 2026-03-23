"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"

// Mock data - will be replaced with database queries
const allProducts = [
  {
    id: "1",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    price: 12500,
    image: "/images/product-1.jpg",
    category: "Knitwear",
    isNew: true,
  },
  {
    id: "2",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    price: 24500,
    image: "/images/product-2.jpg",
    category: "Outerwear",
    isNew: true,
  },
  {
    id: "3",
    name: "Silk Wide-Leg Trousers",
    slug: "silk-wide-leg-trousers",
    price: 8900,
    image: "/images/product-3.jpg",
    category: "Bottoms",
    isNew: false,
  },
  {
    id: "4",
    name: "Artisan Leather Belt",
    slug: "artisan-leather-belt",
    price: 4500,
    image: "/images/product-4.jpg",
    category: "Accessories",
    isNew: false,
  },
  {
    id: "5",
    name: "Premium Cotton Shirt",
    slug: "premium-cotton-shirt",
    price: 6800,
    image: "/images/product-5.jpg",
    category: "Tops",
    isNew: true,
  },
  {
    id: "6",
    name: "Camel Wool Overcoat",
    slug: "camel-wool-overcoat",
    price: 35000,
    image: "/images/product-6.jpg",
    category: "Outerwear",
    isNew: false,
  },
  {
    id: "7",
    name: "Designer Indigo Denim",
    slug: "designer-indigo-denim",
    price: 9500,
    image: "/images/product-7.jpg",
    category: "Bottoms",
    isNew: true,
  },
  {
    id: "8",
    name: "Silk Signature Scarf",
    slug: "silk-signature-scarf",
    price: 3200,
    image: "/images/product-8.jpg",
    category: "Accessories",
    isNew: false,
  },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  // Filter products based on URL params
  const filteredProducts = useMemo(() => {
    if (!categoryParam || categoryParam === "all") {
      return allProducts
    }
    return allProducts.filter(
      (product) => product.category.toLowerCase() === categoryParam.toLowerCase()
    )
  }, [categoryParam])

  // Get page title based on category
  const pageTitle = useMemo(() => {
    if (!categoryParam || categoryParam === "all") {
      return "Shop All"
    }
    return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
  }, [categoryParam])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="display-md text-foreground">{pageTitle}</h1>
        <p className="mt-2 body-lg text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFilters initialCategory={categoryParam || "all"} />
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-16 bg-secondary rounded-lg">
          <p className="title-lg text-foreground mb-2">No products found</p>
          <p className="body-md text-muted-foreground">
            Try adjusting your filters or browse all products.
          </p>
        </div>
      )}
    </div>
  )
}
