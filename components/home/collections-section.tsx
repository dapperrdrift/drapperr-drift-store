import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
}

// Reusable category card component
function CategoryCard({ category }: { category: Category }) {
  const fallbackImage = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80`
  const imgSrc = category.image_url || fallbackImage

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-none md:rounded-sm"
    >
      <div className="aspect-square md:aspect-3/4 relative bg-surface-container">
        <Image
          src={imgSrc}
          alt={category.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-foreground/10 to-transparent transition-opacity group-hover:from-foreground/70" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center md:justify-end p-4 md:p-8 text-center">
          <h3 className="text-xl md:headline-md font-black uppercase tracking-widest text-background drop-shadow-sm">{category.name}</h3>
          <span className="hidden md:inline-flex mt-3 items-center gap-1 label-md text-background/90 underline underline-offset-4 transition-all group-hover:gap-2 drop-shadow-sm">
            Shop Now
          </span>
        </div>
      </div>
    </Link>
  )
}

// Loading skeleton
function CategorySkeleton() {
  return (
    <div className="aspect-square md:aspect-3/4 w-full animate-pulse rounded-none md:rounded-sm bg-muted" />
  )
}

export async function CollectionsSection() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .order('name', { ascending: true })

  // Fallback UI if Supabase fails
  if (error) {
    console.error(`[CollectionsSection] Failed to fetch categories from Supabase: ${error.message}`, error)
    const staticCategories: Category[] = [
      { id: '1', name: 'Men', slug: 'men', image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80' },
      { id: '2', name: 'Women', slug: 'women', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
    ]
    return <CollectionsSectionUI categories={staticCategories} fallback />
  }

  const validCategories = (categories ?? []).filter((c): c is Category => !!c.name && !!c.slug)

  if (validCategories.length === 0) {
    return null
  }

  return <CollectionsSectionUI categories={validCategories} />
}

function CollectionsSectionUI({
  categories,
  fallback = false,
}: {
  categories: Category[]
  fallback?: boolean
}) {
  // Responsive grid for any number of categories
  const gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <section className="bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-16 lg:px-8 lg:py-24">
        <div className="text-left md:text-center border-l-4 border-primary md:border-0 pl-3 md:pl-0" data-aos="fade-up">
          <span className="hidden md:inline-block label-md text-primary">Collections</span>
          <h2 className="mt-0 md:mt-2 text-[2rem] md:headline-lg font-bold uppercase tracking-wide text-foreground">Shop by Category</h2>
          {fallback && (
            <p className="mt-2 body-md text-muted-foreground">Showing default categories</p>
          )}
        </div>

        <div className={`mt-12 grid gap-2 md:gap-6 ${gridCols}`}>
          {categories.map((category, index) => (
            <div key={category.id} data-aos="fade-up" data-aos-delay={String(index * 80)}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
