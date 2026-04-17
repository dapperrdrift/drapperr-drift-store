import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function LookbookSection() {
  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-2.jpg"
          alt="Dapperr Drift Lookbook — streetwear editorial shot in Kota, Rajasthan"
          fill
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/30" />
      </div>

      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-20 lg:px-8">
          <div className="max-w-xl">
            <span
              data-aos="fade-up"
              className="inline-block bg-background/10 backdrop-blur-sm px-3 py-1.5 label-md text-background border border-background/20"
            >
              LOOKBOOK · VOL.01
            </span>
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-5 text-3xl md:display-md font-black uppercase leading-[0.9] tracking-[-0.02em] text-background"
            >
              Streets of Kota,
              <br />
              Dressed Different.
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-5 body-lg text-background/80 max-w-md"
            >
              A visual journal of our latest drop. Shot on real streets, worn by real people. This is streetwear without the pretence.
            </p>
            <Link
              href="/products?filter=new"
              data-aos="fade-up"
              data-aos-delay="300"
              className="group mt-8 inline-flex items-center gap-2 border border-background/40 px-6 py-3.5 label-md uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground hover:gap-3"
            >
              Shop the Drop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
