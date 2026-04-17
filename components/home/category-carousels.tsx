import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/products/product-card"

interface RawProduct {
  id: string
  name: string
  slug: string | null
  base_price: number
  images: string[] | null
  categories: { name: string; slug: string } | null
  variants: { id: string; price_override: number | null; stock_quantity: number }[]
}

interface CategoryGroup {
  name: string
  slug: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    category: string
    variants?: { id: string }[]
  }[]
}

export async function CategoryCarousels() {
  const supabase = await createClient()

  const { data: rawProducts } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      base_price,
      images,
      categories(name, slug),
      variants(id, price_override, stock_quantity)
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(80)

  const products = (rawProducts ?? []) as unknown as RawProduct[]

  const groupMap = new Map<string, CategoryGroup>()
  for (const p of products) {
    if (!p.categories) continue
    const hasStock = (p.variants ?? []).some((v) => v.stock_quantity > 0)
    if (!hasStock) continue

    const key = p.categories.slug
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        name: p.categories.name,
        slug: p.categories.slug,
        products: [],
      })
    }
    const group = groupMap.get(key)!
    if (group.products.length >= 8) continue

    group.products.push({
      id: p.id,
      name: p.name,
      slug: p.slug || p.id,
      price: p.variants?.[0]?.price_override ?? p.base_price,
      image: p.images?.[0] ?? "",
      category: p.categories.name,
      variants: p.variants?.map((v) => ({ id: v.id })),
    })
  }

  const groups = Array.from(groupMap.values()).filter((g) => g.products.length >= 3)

  if (groups.length === 0) return null

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16 space-y-12 lg:space-y-16">
        {groups.map((group) => (
          <div key={group.slug}>
            <div className="flex items-end justify-between gap-4">
              <div data-aos="fade-up">
                <span className="hidden md:inline-block label-md text-primary">
                  Shop {group.name}
                </span>
                <h2 className="mt-0 md:mt-2 text-2xl md:headline-lg font-bold uppercase tracking-wide text-foreground">
                  {group.name} — Dapperr Drift
                </h2>
              </div>
              <Link
                href={`/products?category=${group.slug}`}
                data-aos="fade-up"
                data-aos-delay="80"
                className="inline-flex items-center gap-2 text-xs md:label-md uppercase tracking-widest text-foreground transition-colors hover:text-primary"
              >
                View All
                <ArrowRight className="hidden md:block h-4 w-4" />
              </Link>
            </div>

            <div className="no-scrollbar mt-6 md:mt-8 -mx-4 lg:-mx-8 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              <div className="flex gap-3 md:gap-5 px-4 lg:px-8 pb-2">
                {group.products.map((product, pi) => (
                  <div
                    key={product.id}
                    data-aos="fade-up"
                    data-aos-delay={String(pi * 60)}
                    className="snap-start shrink-0 w-[48%] sm:w-[32%] md:w-[28%] lg:w-[23%]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
