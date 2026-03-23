import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductGallery } from "@/components/products/product-gallery"
import { VariantSelector } from "@/components/products/variant-selector"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductGrid } from "@/components/products/product-grid"

// Mock product data - will be replaced with database queries
const mockProducts: Record<string, {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string
  details: string[]
  variants: Array<{
    size: string
    color: string
    colorHex: string
    stock: number
    sku: string
  }>
}> = {
  "cashmere-knit-sweater": {
    id: "1",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    description: "Luxuriously soft cashmere sweater crafted from the finest Mongolian cashmere. Features a relaxed fit with ribbed cuffs and hem for a timeless silhouette that transitions effortlessly from casual to refined.",
    price: 12500,
    images: ["/images/product-1.jpg", "/images/product-1.jpg", "/images/product-1.jpg"],
    category: "Knitwear",
    details: [
      "100% Grade-A Mongolian Cashmere",
      "Relaxed fit",
      "Ribbed cuffs and hem",
      "Dry clean only",
      "Made in Italy",
    ],
    variants: [
      { size: "XS", color: "Cream", colorHex: "#F5F0E6", stock: 5, sku: "CKS-CR-XS" },
      { size: "S", color: "Cream", colorHex: "#F5F0E6", stock: 8, sku: "CKS-CR-S" },
      { size: "M", color: "Cream", colorHex: "#F5F0E6", stock: 12, sku: "CKS-CR-M" },
      { size: "L", color: "Cream", colorHex: "#F5F0E6", stock: 6, sku: "CKS-CR-L" },
      { size: "XL", color: "Cream", colorHex: "#F5F0E6", stock: 3, sku: "CKS-CR-XL" },
      { size: "XS", color: "Black", colorHex: "#1C1B1B", stock: 0, sku: "CKS-BL-XS" },
      { size: "S", color: "Black", colorHex: "#1C1B1B", stock: 4, sku: "CKS-BL-S" },
      { size: "M", color: "Black", colorHex: "#1C1B1B", stock: 7, sku: "CKS-BL-M" },
      { size: "L", color: "Black", colorHex: "#1C1B1B", stock: 2, sku: "CKS-BL-L" },
      { size: "XL", color: "Black", colorHex: "#1C1B1B", stock: 0, sku: "CKS-BL-XL" },
    ],
  },
}

// Related products mock data
const relatedProducts = [
  {
    id: "2",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    price: 24500,
    image: "/images/product-2.jpg",
    category: "Outerwear",
  },
  {
    id: "3",
    name: "Silk Wide-Leg Trousers",
    slug: "silk-wide-leg-trousers",
    price: 8900,
    image: "/images/product-3.jpg",
    category: "Bottoms",
  },
  {
    id: "5",
    name: "Premium Cotton Shirt",
    slug: "premium-cotton-shirt",
    price: 6800,
    image: "/images/product-5.jpg",
    category: "Tops",
  },
  {
    id: "6",
    name: "Camel Wool Overcoat",
    slug: "camel-wool-overcoat",
    price: 35000,
    image: "/images/product-6.jpg",
    category: "Outerwear",
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = mockProducts[slug]
  
  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = mockProducts[slug]

  // For demo, show the cashmere sweater for any slug
  const displayProduct = product || mockProducts["cashmere-knit-sweater"]

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <ol className="flex items-center gap-2 body-md text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Shop
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href={`/products?category=${displayProduct.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
              {displayProduct.category}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground">{displayProduct.name}</li>
        </ol>
      </nav>

      {/* Product details */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={displayProduct.images} productName={displayProduct.name} />

          {/* Product info */}
          <div className="lg:py-8">
            <span className="label-md text-primary">{displayProduct.category}</span>
            <h1 className="mt-2 display-md text-foreground">{displayProduct.name}</h1>
            <p className="mt-4 headline-md text-foreground">
              Rs. {displayProduct.price.toLocaleString("en-IN")}
            </p>
            <p className="mt-6 body-lg text-muted-foreground">{displayProduct.description}</p>

            {/* Variant selector */}
            <div className="mt-8">
              <VariantSelector variants={displayProduct.variants} />
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              <AddToCartButton productName={displayProduct.name} />
            </div>

            {/* Product details accordion */}
            <div className="mt-8 border-t border-border pt-8">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between py-4 label-md text-foreground">
                  Product Details
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <ul className="pb-4 space-y-2">
                  {displayProduct.details.map((detail, index) => (
                    <li key={index} className="body-md text-muted-foreground">
                      {detail}
                    </li>
                  ))}
                </ul>
              </details>
              <details className="group border-t border-border">
                <summary className="flex cursor-pointer items-center justify-between py-4 label-md text-foreground">
                  Shipping & Returns
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="pb-4 space-y-2 body-md text-muted-foreground">
                  <p>Free standard shipping on orders over Rs. 5,000.</p>
                  <p>Express shipping available for an additional charge.</p>
                  <p>Returns accepted within 30 days of delivery.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <section className="bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <h2 className="headline-lg text-foreground">You May Also Like</h2>
          <div className="mt-8">
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      </section>
    </div>
  )
}
