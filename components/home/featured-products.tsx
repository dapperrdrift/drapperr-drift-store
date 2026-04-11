import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/products/product-card"

export async function FeaturedProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      base_price,
      images,
      categories(name, slug),
      variants(id, price_override, stock_quantity)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)

  const featuredProducts = (products ?? [])
    .filter((p: any) => (p.variants ?? []).some((v: any) => v.stock_quantity > 0))
    .slice(0, 4)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug || p.id,
      price: p.variants?.[0]?.price_override ?? p.base_price,
      image: p.images?.[0] ?? '',
      category: p.categories?.name ?? 'Uncategorized',
      isNew: true,
      variants: p.variants?.map((v: any) => ({ id: v.id })),
    }))

  if (featuredProducts.length === 0) {
    return null
  }

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
