import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, ChevronDown, Truck, RotateCcw, Shield } from "lucide-react"
import { ProductGallery } from "@/components/products/product-gallery"
import { VariantSelector } from "@/components/products/variant-selector"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductAccordion } from "@/components/products/product-accordion"

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
  care: string[]
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
      "Made in Italy",
    ],
    care: [
      "Dry clean recommended",
      "Store folded to maintain shape",
      "Avoid direct sunlight",
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
      <nav className="mx-auto max-w-7xl px-4 pt-6 pb-4 lg:px-8">
        <ol className="flex items-center gap-2 body-md text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/products" className="hover:text-primary transition-colors">
              Shop
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href={`/products?category=${displayProduct.category.toLowerCase()}`} className="hover:text-primary transition-colors">
              {displayProduct.category}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{displayProduct.name}</li>
        </ol>
      </nav>

      {/* Product details */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Gallery - Fixed height container to prevent resize */}
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
            <ProductGallery images={displayProduct.images} productName={displayProduct.name} />
          </div>

          {/* Product info - Scrollable */}
          <div className="space-y-6">
            <div>
              <Link 
                href={`/products?category=${displayProduct.category.toLowerCase()}`}
                className="label-md text-primary hover:underline"
              >
                {displayProduct.category}
              </Link>
              <h1 className="mt-2 display-md text-foreground">{displayProduct.name}</h1>
              <p className="mt-4 headline-md text-foreground">
                Rs. {displayProduct.price.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 body-md text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <p className="body-lg text-muted-foreground">{displayProduct.description}</p>

            {/* Variant selector */}
            <div className="pt-2">
              <VariantSelector variants={displayProduct.variants} />
            </div>

            {/* Add to cart */}
            <div className="pt-4">
              <AddToCartButton productName={displayProduct.name} />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="body-md text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="body-md text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="body-md text-muted-foreground">Secure Payment</span>
              </div>
            </div>

            {/* Product details accordion - Contained within product info section */}
            <ProductAccordion 
              details={displayProduct.details}
              care={displayProduct.care}
            />
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
