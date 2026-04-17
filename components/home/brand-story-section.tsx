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
    <section className="relative">
      {/* Background Bridge: Seamlessly connect the sections above and below */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-surface-container-low pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-surface pointer-events-none" />

      {/* Floating Dark Card Container */}
      <div className="relative z-10 px-0 lg:px-8 py-0 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-none lg:rounded-[3rem] bg-[#0e0b0b] text-white overflow-hidden shadow-none lg:shadow-2xl ring-0 lg:ring-1 ring-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-150">

            {/* Image side */}
            <div className="hidden lg:block relative min-h-100 lg:min-h-full" data-aos="fade-right">
              <Image
                src="/images/brand-story.jpg"
                alt="Dapperr behind the scenes"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Diagonal overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0e0b0b] hidden lg:block" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e0b0b] via-transparent to-transparent lg:hidden" />

              {/* Floating tag */}
              <div className="absolute bottom-8 left-8 bg-primary px-5 py-3 rounded-md shadow-lg">
                <p className="label-md text-white uppercase tracking-widest">Est. 2021</p>
                <p className="body-sm text-white/70 mt-0.5">Mumbai, India</p>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-col justify-center px-6 py-20 lg:px-16 lg:py-16 text-center lg:text-left">

              <span data-aos="fade-left" className="hidden lg:inline-block label-md text-primary uppercase tracking-widest mb-4">
                Our Story
              </span>

              <h2 data-aos="fade-left" data-aos-delay="80" className="text-[2.1rem] lg:headline-lg font-black uppercase lg:normal-case text-white text-balance leading-tight">
                Dapperr wasn&apos;t designed in a boardroom...
              </h2>

              <p data-aos="fade-left" data-aos-delay="120" className="mt-6 body-lg text-white/80 lg:text-white/60 text-pretty leading-relaxed max-w-2xl mx-auto lg:mx-0">
                It was born in the streets. A rebellion against the safe, the expected, and the mass-produced. We craft armor for the modern urban landscape.
              </p>

              <p data-aos="fade-left" data-aos-delay="220" className="hidden lg:block mt-4 body-lg text-white/60 text-pretty leading-relaxed">
                Every piece is designed in-house, tested on real bodies, and obsessed over
                until it&apos;s right. No middlemen. No compromises. Just clothes that mean something.
              </p>

              {/* Pillars */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-2 gap-8 border-t border-white/10 pt-10 text-center lg:text-left">
                {pillars.map((p, index) => (
                  <div key={p.label} data-aos="fade-up" data-aos-delay={String(300 + index * 80)}>
                    <p className="text-4xl lg:display-md text-primary font-black">{p.stat}</p>
                    <p className="text-[0.6875rem] lg:title-md uppercase tracking-[0.1em] lg:normal-case text-white mt-1">{p.label}</p>
                    <p className="hidden lg:block body-sm text-white/40 mt-0.5">{p.detail}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/products"
                data-aos="fade-up"
                data-aos-delay="400"
                className="hidden lg:inline-flex group mt-10 items-center gap-2 label-md text-primary hover:gap-3 transition-all w-fit"
              >
                Shop the brand
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
