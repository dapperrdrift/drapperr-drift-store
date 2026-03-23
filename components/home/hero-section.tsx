import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="grid lg:grid-cols-2">
        {/* Content */}
        <div className="flex flex-col justify-center px-4 py-16 lg:px-8 lg:py-24 xl:px-16">
          <span className="label-md text-primary">Spring/Summer 2026</span>
          <h1 className="mt-4 display-lg text-foreground text-balance">
            Where Elegance<br />Meets Edge
          </h1>
          <p className="mt-6 body-lg text-muted-foreground max-w-md text-pretty">
            Discover our latest collection of contemporary pieces designed for those who 
            refuse to blend in. Curated for the discerning individual.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-primary px-8 py-4 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Shop Collection
            </Link>
            <Link
              href="/products?filter=new"
              className="inline-flex items-center justify-center border border-foreground px-8 py-4 label-md text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/5] lg:aspect-auto">
          <Image
            src="/images/hero-main.jpg"
            alt="Fashion model wearing contemporary designer clothing"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
