import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "Men",
    description: "Bold streetwear for the fearless spirit",
    href: "/products?category=men",
    image: "/images/collection-men.jpg",
  },
  {
    name: "Women",
    description: "Vibrant styles that make statements",
    href: "/products?category=women",
    image: "/images/collection-women.jpg",
  },
]

export function CollectionsSection() {
  return (
    <section className="bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <span className="label-md text-primary">Collections</span>
          <h2 className="mt-2 headline-lg text-foreground">Shop by Category</h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group relative overflow-hidden"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/20 transition-opacity group-hover:bg-foreground/30" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  <h3 className="headline-md text-background">{collection.name}</h3>
                  <p className="mt-2 body-md text-background/80">{collection.description}</p>
                  <span className="mt-4 label-md text-background underline underline-offset-4">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
