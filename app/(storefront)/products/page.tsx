import { Suspense } from "react"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
}

async function ProductsContent({ searchParams }: PageProps) {
  const { category, sort } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      base_price,
      images,
      created_at,
      categories!inner(name, slug),
      variants(id, price_override, stock_quantity)
    `)
    .eq('is_active', true)

  if (category && category !== 'all') {
    query = query.eq('categories.slug', category)
  }

  if (sort === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  const mappedProducts = (products ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    price: p.variants?.[0]?.price_override ?? p.base_price,
    image: p.images?.[0] ?? null,
    category: p.categories?.name ?? 'Uncategorized',
    isNew: false,
  }))

  const pageTitle = category && category !== 'all'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Shop All'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="display-md text-foreground">{pageTitle}</h1>
        <p className="mt-2 body-lg text-muted-foreground">
          {mappedProducts.length} product{mappedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8">
        <ProductFilters initialCategory={category || 'all'} />
      </div>

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
  )
}

export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="text-center py-16 bg-secondary rounded-lg">
          <p className="title-lg text-foreground mb-2">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}
