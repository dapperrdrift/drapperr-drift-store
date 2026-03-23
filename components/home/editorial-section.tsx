import Image from "next/image"
import Link from "next/link"

export function EditorialSection() {
  return (
    <section className="bg-surface-container-low">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2">
          {/* Image - Editorial float effect */}
          <div className="relative aspect-square lg:aspect-auto lg:min-h-[600px] order-2 lg:order-1">
            <Image
              src="/images/collection-women.jpg"
              alt="Editorial fashion photography"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-4 py-16 lg:px-16 lg:py-24 order-1 lg:order-2">
            <span className="label-md text-primary">The Edit</span>
            <h2 className="mt-4 display-md text-foreground text-balance">
              Crafted for<br />Those Who Lead
            </h2>
            <p className="mt-6 body-lg text-muted-foreground max-w-md text-pretty">
              Every piece in our collection is thoughtfully designed and meticulously crafted. 
              We believe in quality over quantity, timeless design over fleeting trends.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <span className="label-md text-primary w-16">01</span>
                <div>
                  <h3 className="title-md text-foreground">Sustainable Sourcing</h3>
                  <p className="mt-1 body-md text-muted-foreground">
                    Premium materials from responsible suppliers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="label-md text-primary w-16">02</span>
                <div>
                  <h3 className="title-md text-foreground">Artisan Craftsmanship</h3>
                  <p className="mt-1 body-md text-muted-foreground">
                    Handcrafted details that tell a story
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="label-md text-primary w-16">03</span>
                <div>
                  <h3 className="title-md text-foreground">Timeless Design</h3>
                  <p className="mt-1 body-md text-muted-foreground">
                    Pieces that transcend seasonal trends
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center justify-center border border-foreground px-8 py-4 label-md text-foreground transition-colors hover:bg-foreground hover:text-background self-start"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
