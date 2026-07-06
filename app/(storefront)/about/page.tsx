import type { Metadata } from 'next'
import Image from "next/image"
import Link from "next/link"
import { Heart, Leaf, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: 'About Us | Dapperr Drift – Premium Streetwear Brand India',
  description:
    'Learn the story of Dapperr Drift. We make original, premium GenZ streetwear, oversized T-shirts, hoodies, and denim, designed for the bold and delivered across India.',
  keywords: [
    'about Dapperr Drift',
    'premium streetwear brand India',
    'Dapperr Drift story',
    'original streetwear designs',
    'streetwear movement India',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/about',
  },
  openGraph: {
    title: 'About Dapperr Drift | Premium Streetwear Brand India',
    description:
      'Learn about Dapperr Drift. We bring bold, premium streetwear and modern fashion to GenZ all over India.',
    url: 'https://dapperrdrift.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Craftsmanship",
      description:
        "Every piece is crafted with meticulous attention to detail, using quality techniques that ensure your clothes look great and last long.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "We're committed to responsible sourcing and sustainable practices, working with partners who share our vision for a better fashion industry.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "We source only premium fabrics and materials — ensuring every garment meets our high standards of comfort, fit, and durability.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We believe in building lasting relationships with our community of fashion lovers across India, united by a love for bold, timeless style.",
    },
  ]

  const milestones = [
    { year: "2022", event: "Dapperr Drift founded with a vision to bring premium, high-quality streetwear to India's youth" },
    { year: "2023", event: "Launched online store and opened our flagship retail store at Shubh Affinity, Swami Vivekananda Nagar, Kota" },
    { year: "2024", event: "Expanded product range with a wider catalog of T-shirts, hoodies, denim, and premium streetwear" },
    { year: "2024", event: "Crossed 5,000+ happy customers nationwide, delivering style across every state" },
    { year: "2025", event: "Continued growth with new seasonal drops and reliable pan-India delivery" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-surface-container-low py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="display-lg text-foreground mb-6">
                Premium Streetwear Designed For The Bold
              </h1>
              <p className="body-lg text-muted-foreground mb-8 leading-relaxed">
                Dapperr Drift is a premium streetwear brand built for the bold, the stylish, and the young at heart.
                We make high-quality graphic tees, oversized hoodies, denim, and street-first essentials delivered straight to your door across India.
                Visit our flagship retail experience in Kota, Rajasthan, or explore our collection online from anywhere in the country.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Explore Our Collection
              </Link>
            </div>
            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-secondary">
              <Image
                src="/images/about-hero.jpg"
                alt="Dapperr Drift store interior in Kota, Rajasthan"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="display-sm text-foreground mb-8">Our Story</h2>
          <div className="space-y-6 body-lg text-muted-foreground leading-relaxed">
            <p>
              Dapperr Drift started with a simple idea: to make premium streetwear accessible without compromising on design or quality.
              We wanted to create clothing that speaks before you do, bridging the gap between high-fashion aesthetics and everyday wear.
            </p>
            <p>
              From our flagship retail store at Shubh Affinity in Kota, Rajasthan to our online presence, we have grown to serve a diverse, passionate community of style enthusiasts. Today, we ship pan-India, bringing our unique, curated fits to every corner of the country.
            </p>
            <p>
              We curate every piece with care — from graphic tees to premium hoodies, from relaxed denim to streetwear essentials —
              because great style should be accessible, not exclusive. That's the Dapperr Drift promise.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-surface-container-low py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="display-sm text-foreground mb-4">Our Values</h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we create
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="title-lg text-foreground mb-3">{value.title}</h3>
                  <p className="body-md text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="display-sm text-foreground mb-4">Our Journey</h2>
            <p className="body-lg text-muted-foreground">
              Key milestones in the Dapperr Drift story
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border sm:-translate-x-px" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={`${milestone.year}-${index}`}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Year bubble */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 flex h-8 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground z-10">
                    <span className="label-md">{milestone.year}</span>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"
                    }`}
                  >
                    <div className="rounded-lg border border-border bg-background p-4">
                      <p className="body-md text-foreground">{milestone.event}</p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="display-sm mb-4">Join the Dapperr Drift Family</h2>
          <p className="body-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Discover clothing that speaks before you do. Bold pieces, premium fabrics, fast delivery across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary-foreground text-primary px-8 py-3 label-md transition-colors hover:bg-primary-foreground/90"
            >
              Shop Collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 bg-transparent px-8 py-3 label-md transition-colors hover:bg-primary-foreground/10"
            >
              Visit Our Flagship Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
