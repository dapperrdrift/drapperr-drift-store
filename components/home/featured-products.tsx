import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { ArrowRight } from "lucide-react"

// Mock data - will be replaced with database queries
const featuredProducts = [
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
]

export function FeaturedProducts() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="label-md text-primary">Curated Selection</span>
            <h2 className="mt-2 headline-lg text-foreground">Featured Pieces</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 label-md text-foreground transition-colors hover:text-primary"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
