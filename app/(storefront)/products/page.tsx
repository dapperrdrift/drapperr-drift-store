import { Metadata } from "next"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse our curated collection of contemporary high-fashion pieces.",
}

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
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="display-md text-foreground">Shop All</h1>
        <p className="mt-2 body-lg text-muted-foreground">
          {allProducts.length} products
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFilters />
      </div>

      {/* Product grid */}
      <ProductGrid products={allProducts} />
    </div>
  )
}
