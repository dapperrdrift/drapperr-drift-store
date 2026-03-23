import Image from "next/image"
import Link from "next/link"

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
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 label-md text-primary-foreground">
            New
          </span>
        )}
      </div>
      <div className="mt-4">
        {product.category && (
          <span className="label-md text-muted-foreground">{product.category}</span>
        )}
        <h3 className="mt-1 title-md text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 body-md text-foreground">
          Rs. {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  )
}
