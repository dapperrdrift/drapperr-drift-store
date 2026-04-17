import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  category?: string
  isNew?: boolean
  variants?: { id: string }[]
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="headline-md text-foreground">No products found</p>
        <p className="mt-2 body-lg text-muted-foreground">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <div key={product.id} data-aos="fade-up" data-aos-delay={String(Math.min(index, 7) * 60)}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
