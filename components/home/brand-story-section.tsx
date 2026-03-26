import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const pillars = [
  {
    stat: "2021",
    label: "Founded",
    detail: "Born on the streets of Mumbai",
  },
  {
    stat: "10K+",
    label: "Customers",
    detail: "Across India and growing",
  },
  {
    stat: "100%",
    label: "Original Designs",
    detail: "No fast-fashion templates",
  },
  {
    stat: "48hr",
    label: "Dispatch",
    detail: "From studio to your door",
  },
]

export function BrandStorySection() {
  return (
    <section className="bg-[#0e0b0b] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Image side */}
        <div className="relative min-h-[400px] lg:min-h-full">
          <Image
            src="/images/brand-story.jpg"
            alt="Drapperr behind the scenes"
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Diagonal overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e0b0b] hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b0b] via-transparent to-transparent lg:hidden" />

          {/* Floating tag */}
          <div className="absolute bottom-8 left-8 bg-primary px-5 py-3 rounded-md">
            <p className="label-md text-white uppercase tracking-widest">Est. 2021</p>
            <p className="body-sm text-white/70 mt-0.5">Mumbai, India</p>
          </div>
        </div>

        {/* Content side */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16">

          <span className="label-md text-primary uppercase tracking-widest mb-4">
            Our Story
          </span>

          <h2 className="headline-lg text-white text-balance leading-tight">
            Drapperr wasn&apos;t designed in a boardroom. It was sketched on a napkin at 2am.
          </h2>

          <p className="mt-6 body-lg text-white/60 text-pretty leading-relaxed">
            We started because we were tired of choosing between clothes that looked good
            and clothes that felt like us. So we built the third option — fashion that has
            a point of view, a pulse, and a price tag that doesn&apos;t make you sweat.
          </p>

          <p className="mt-4 body-lg text-white/60 text-pretty leading-relaxed">
            Every piece is designed in-house, tested on real bodies, and obsessed over
            until it&apos;s right. No middlemen. No compromises. Just clothes that mean something.
          </p>

          {/* Pillars */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-10">
            {pillars.map((p) => (
              <div key={p.label}>
                <p className="display-md text-primary font-black">{p.stat}</p>
                <p className="title-md text-white mt-1">{p.label}</p>
                <p className="body-sm text-white/40 mt-0.5">{p.detail}</p>
              </div>
            ))}
          </div>

          <Link
            href="/products"
            className="group mt-10 inline-flex items-center gap-2 label-md text-primary hover:gap-3 transition-all w-fit"
          >
            Shop the brand
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}
