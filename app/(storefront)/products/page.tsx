import type { Metadata } from 'next'
import { Suspense } from "react"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: 'Shop All Clothing | Drapperr Drift – Kota, Rajasthan',
  description:
    'Browse Drapperr Drift\'s full collection of T-shirts, hoodies, denim, and streetwear. Kota\'s best fashion store — shop in-store at Swami Vivekananda Nagar or order online across India.',
  keywords: [
    'buy clothes online Kota',
    'men T-shirts Kota',
    'hoodies Kota',
    'denim jeans Kota Rajasthan',
    'streetwear Kota',
    'fashion online Rajasthan',
    'affordable clothing India',
    'shop clothing Kota',
    'Drapperr Drift collection',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/products',
  },
  openGraph: {
    title: 'Shop All Clothing | Drapperr Drift – Kota, Rajasthan',
    description:
      'T-shirts, hoodies, denim & streetwear from Kota\'s trendiest clothing store. Shop online or visit us in Swami Vivekananda Nagar, Kota.',
    url: 'https://dapperrdrift.com/products',
    type: 'website',
  },
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    colors?: string
    sizes?: string
  }>
}

async function ProductsContent({ searchParams }: PageProps) {
  const { category, sort, colors, sizes } = await searchParams
  const supabase = await createClient()

  /* ─── Fetch categories with product counts ─── */
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  // Build category→count map (count active products per category)
  const { data: countData } = await supabase
    .from('products')
    .select('category_id', { count: 'exact' })
    .eq('is_active', true)

  const categoryCountMap: Record<string, number> = {}
  for (const p of (countData ?? [])) {
    if (p.category_id) {
      categoryCountMap[p.category_id] = (categoryCountMap[p.category_id] || 0) + 1
    }
  }

  const categoriesWithCount = (allCategories ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    count: categoryCountMap[c.id] || 0,
  }))

  /* ─── Build products query ─── */
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      base_price,
      images,
      created_at,
      categories!inner(name, slug),
      variants(id, color, size, price_override, stock_quantity)
    `)
    .eq('is_active', true)

  // Category filter
  if (category && category !== 'all') {
    query = query.eq('categories.slug', category)
  }

  // Sort
  if (sort === 'price-low') {
    query = query.order('base_price', { ascending: true })
  } else if (sort === 'price-high') {
    query = query.order('base_price', { ascending: false })
  } else if (sort === 'name') {
    query = query.order('name', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query
  if (error) console.error('SUPABASE DB ERROR:', error)

  /* ─── Map + client-side filter by color / size (variant-level) ─── */
  const activeColors = colors ? colors.split(',') : []
  const activeSizes = sizes ? sizes.split(',') : []

  let mappedProducts = (products ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: p.variants?.[0]?.price_override ?? p.base_price,
    image: p.images?.[0] ?? null,
    category: p.categories?.name ?? 'Uncategorized',
    isNew: false,
    variants: p.variants?.map((v: any) => ({ id: v.id })),
    // keep variant info for filtering and in-stock checks
    _variants: (p.variants ?? []) as { id: string; color: string; size: string; stock_quantity: number }[],
  }))

  // Hide products with no variants or no in-stock variants
  mappedProducts = mappedProducts.filter((p) => p._variants.some((v) => v.stock_quantity > 0))

  // Filter by color (match against variant colors, case-insensitive)
  if (activeColors.length > 0) {
    const lowerColors = activeColors.map((c) => c.toLowerCase())
    mappedProducts = mappedProducts.filter((p) =>
      p._variants.some((v) => lowerColors.includes(v.color?.toLowerCase()))
    )
  }

  // Filter by size
  if (activeSizes.length > 0) {
    const lowerSizes = activeSizes.map((s) => s.toLowerCase())
    mappedProducts = mappedProducts.filter((p) =>
      p._variants.some((v) => lowerSizes.includes(v.size?.toLowerCase()))
    )
  }

  const pageTitle =
    category && category !== 'all'
      ? categoriesWithCount.find((c) => c.slug === category)?.name ||
      category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
      : 'Shop All'

  return (
    <div className="mx-auto max-w-full px-4 py-8 lg:px-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 data-aos="fade-down" className="display-md text-foreground">{pageTitle}</h1>
        <p data-aos="fade-down" data-aos-delay="80" className="mt-2 body-lg text-muted-foreground">
          {mappedProducts.length} product{mappedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sidebar + Grid layout */}
      <div className="flex gap-8 lg:gap-12">
        {/* Sidebar filters */}
        <div className="hidden md:block md:w-65 lg:w-70 shrink-0">
          <ProductFilters
            initialCategory={category || 'all'}
            categories={categoriesWithCount}
          />
        </div>

        {/* Mobile filter toggle */}
        <MobileFilterDrawer
          initialCategory={category || 'all'}
          categories={categoriesWithCount}
        />

        {/* Product grid — takes remaining space */}
        <div className="flex-1 min-w-0">
          {mappedProducts.length > 0 ? (
            <ProductGrid products={mappedProducts} />
          ) : (
            <div className="text-center py-16 bg-secondary rounded-lg">
              <p className="title-lg text-foreground mb-2">No products found</p>
              <p className="body-md text-muted-foreground">
                Try adjusting your filters or browse all products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Mobile filter drawer (visible only on small screens)              */
/* ─────────────────────────────────────────────────────────────────── */
function MobileFilterDrawer({
  initialCategory,
  categories,
}: {
  initialCategory: string
  categories: { slug: string; name: string; count: number }[]
}) {
  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <a
        href="#mobile-filters"
        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full shadow-2xl label-md"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </a>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Page export                                                        */
/* ─────────────────────────────────────────────────────────────────── */
export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="flex gap-8 lg:gap-12">
            {/* Sidebar skeleton */}
            <div className="hidden md:block w-65 lg:w-70 shrink-0 space-y-6">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="h-9 w-full bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-5 w-16 bg-muted rounded animate-pulse mt-6" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                ))}
              </div>
            </div>
            {/* Grid skeleton */}
            <div className="flex-1">
              <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-3/4 bg-muted rounded-md animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}
