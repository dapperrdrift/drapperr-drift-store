import { Instagram } from "lucide-react"

const mentions = [
  { label: "@dapperr.drift", sub: "Instagram" },
  { label: "FEATURED IN KOTA YOUTH", sub: "Local Press" },
  { label: "10,000+ CUSTOMERS", sub: "Pan India" },
  { label: "4.8★ GOOGLE", sub: "Customer Rating" },
  { label: "RAJASTHAN STREETWEAR", sub: "Origin" },
]

export function PressStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
        <p
          data-aos="fade-up"
          className="text-center label-md text-muted-foreground tracking-[0.25em]"
        >
          AS SEEN ON · LOVED BY INDIA
        </p>
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8"
        >
          {mentions.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 border-l border-border/60 px-4 first:border-l-0 md:first:border-l"
            >
              <div className="flex items-center gap-1.5 text-sm md:text-base font-black uppercase tracking-wide text-foreground">
                {i === 0 && <Instagram className="h-4 w-4 text-primary" />}
                {m.label}
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
