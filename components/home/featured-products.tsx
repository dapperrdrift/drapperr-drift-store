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
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div data-aos="fade-up">
            <span className="hidden md:inline-block label-md text-primary">Curated Selection</span>
            <h2 className="mt-0 md:mt-2 text-2xl md:headline-lg font-bold uppercase tracking-wide text-foreground">Featured Pieces</h2>
          </div>
          <Link
            href="/products"
            data-aos="fade-up"
            data-aos-delay="100"
            className="inline-flex items-center gap-2 text-xs md:label-md uppercase tracking-widest text-foreground transition-colors hover:text-primary"
          >
            Shop All
            <ArrowRight className="hidden md:block h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-2 gap-3 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={String(index * 80)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
