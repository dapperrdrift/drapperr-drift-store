import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Truck, RotateCcw, Shield } from "lucide-react"
import { ProductGallery } from "@/components/products/product-gallery"
import { VariantSelector } from "@/components/products/variant-selector"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductAccordion } from "@/components/products/product-accordion"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

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

  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      base_price,
      images,
      categories(name, slug),
      variants(id, size, color, sku, price_override, stock_quantity)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch related products from the same category
  const { data: relatedRaw } = await supabase
    .from('products')
    .select('id, name, slug, base_price, images, categories(name, slug), variants(price_override)')
    .eq('is_active', true)
    .eq('category_id', (product as any).category_id)
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

  const price = (product as any).variants?.[0]?.price_override ?? product.base_price
  const images: string[] = (product as any).images ?? []
  const category = (product as any).categories?.name ?? 'Apparel'
  const categorySlug = (product as any).categories?.slug ?? 'apparel'

  // Map variants for VariantSelector
  const variants = ((product as any).variants ?? []).map((v: any) => ({
    id: v.id,
    size: v.size,
    color: v.color,
    colorHex: v.color?.toLowerCase().replace(/\s+/g, '') || '#888888',
    stock: v.stock_quantity,
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

            {/* Variant selector */}
            <div className="pt-2">
              <VariantSelector variants={variants} />
            </div>

            {/* Add to cart */}
            <div className="pt-4">
              <AddToCartButton productName={product.name} variants={variants} />
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

            <ProductAccordion
              details={['See product description above']}
              care={['Handle with care', 'Follow label instructions']}
            />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-surface-container-low">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <h2 className="headline-lg text-foreground">You May Also Like</h2>
            <div className="mt-8">
              <ProductGrid products={relatedProducts} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
