"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    category?: string
    isNew?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.category) {
      router.push(`/products?category=${encodeURIComponent(product.category.toLowerCase())}`)
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low rounded-md">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-primary px-3 py-1 rounded label-md text-primary-foreground">
            New
          </span>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100 pb-4">
          <span className="bg-card px-4 py-2 rounded body-md text-foreground shadow-lg">
            Quick View
          </span>
        </div>
      </div>
      <div className="mt-4">
        {product.category && (
          <button
            onClick={handleCategoryClick}
            className="label-md text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {product.category}
          </button>
        )}
        <h3 className="mt-1 title-md text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 title-md text-primary font-semibold">
          Rs. {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  )
}
