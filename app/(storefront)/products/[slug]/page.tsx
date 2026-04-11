import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Truck, RotateCcw, Shield } from "lucide-react"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductAccordion } from "@/components/products/product-accordion"
import { ProductInfo } from "@/components/products/product-info"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{ slug: string }>
}

interface ProductVariantDB {
  id: string
  size: string
  color: string
  sku: string
  price_override: number | null
  stock_quantity: number
}

interface ProductCategoryDB {
  name: string
  slug: string
}

interface ProductFromDB {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  images: string[] | null
  category_id: string | null
  categories: ProductCategoryDB | null
  variants: ProductVariantDB[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select('name, description')
    .filter('slug', 'eq', slug)
    .eq('is_active', true)
    .single()

  const product = rawProduct as { name: string; description: string | null } | null

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      base_price,
      images,
      category_id,
      categories(name, slug),
      variants(id, size, color, sku, price_override, stock_quantity)
    `)
    .filter('slug', 'eq', slug)
    .eq('is_active', true)
    .single()

  const product = rawProduct as unknown as ProductFromDB | null;

  if (!product) {
    notFound()
  }

  // Fetch related products from the same category
  const { data: relatedRaw } = await supabase
    .from('products')
    .select('id, name, slug, base_price, images, categories(name, slug), variants(price_override)')
    .eq('is_active', true)
    .eq('category_id', product.category_id || '')
    .neq('id', product.id)
    .limit(4)

  const relatedProducts = (relatedRaw ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: p.variants?.[0]?.price_override ?? p.base_price,
    image: p.images?.[0] ?? null,
    category: p.categories?.name ?? '',
  }))

  const price = product.variants?.[0]?.price_override ?? product.base_price
  const images: string[] = product.images ?? []
  const category = product.categories?.name ?? 'Apparel'
  const categorySlug = product.categories?.slug ?? 'apparel'

  // Map variants for VariantSelector
  const variants = product.variants.map((v) => ({
    id: v.id,
    size: v.size,
    color: v.color,
    stock_quantity: v.stock_quantity,
    sku: v.sku,
  }))

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 pt-6 pb-4 lg:px-8">
        <ol className="flex items-center gap-2 body-md text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href={`/products?category=${categorySlug}`} className="hover:text-primary transition-colors">
              {category}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Product details */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32">
            <ProductGallery
              images={images.length > 0 ? images : ['/images/product-placeholder.jpg']}
              productName={product.name}
            />
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <Link href={`/products?category=${categorySlug}`} className="label-md text-primary hover:underline">
                {category}
              </Link>
              <h1 className="mt-2 display-md text-foreground">{product.name}</h1>
              <p className="mt-4 headline-md text-foreground">
                ₹{price.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 body-md text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {product.description && (
              <p className="body-lg text-muted-foreground">{product.description}</p>
            )}

            <ProductInfo productName={product.name} variants={variants} />

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

            <ProductAccordion
              details={['See product description above']}
              care={['Handle with care', 'Follow label instructions']}
            />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-surface-container-highest border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="display-sm text-foreground font-serif tracking-tight">Our Personal Recommendation</h2>
              <p className="body-lg text-muted-foreground max-w-2xl">
                Specially curated pieces from our {category} collection that pair perfectly with this item.
              </p>
            </div>
            
            <div className="relative bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent blur-2xl -z-10 rounded-[3rem]" />
              <ProductGrid products={relatedProducts} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
