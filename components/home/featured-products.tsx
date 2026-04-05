import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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
    .limit(4)

  const featuredProducts = (products ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id, // using id as fallback if slug is missing
    price: p.variants?.[0]?.price_override ?? p.base_price,
    image: p.images?.[0] ?? null,
    category: p.categories?.name ?? 'Uncategorized',
    isNew: true,
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
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-md bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="body-md text-muted-foreground">No image</span>
                  </div>
                )}
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-primary px-2 py-1 label-sm text-primary-foreground rounded">
                    NEW
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="label-sm text-muted-foreground">{product.category}</p>
                <h3 className="mt-1 title-md text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 title-md text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
