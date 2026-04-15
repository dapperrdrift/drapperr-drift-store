import type { Metadata } from 'next'
import Image from "next/image"
import Link from "next/link"
import { Heart, Leaf, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: 'About Us | Drapperr Drift – Clothing Store in Kota',
  description:
    'Drapperr Drift was born in Kota, Rajasthan. We bring trendy T-shirts, hoodies, denim, and streetwear to the youth of Kota and across India. Visit our store at Shubh Affinity, Swami Vivekananda Nagar.',
  keywords: [
    'about Drapperr Drift Kota',
    'clothing brand Kota Rajasthan',
    'fashion store Kota story',
    'men fashion brand Kota',
    'Drapperr Drift about',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/about',
  },
  openGraph: {
    title: 'About Drapperr Drift | Kota\'s Favourite Clothing Store',
    description:
      'Learn about Drapperr Drift, Kota\'s go-to clothing destination. We bring bold, affordable streetwear and fashion to the youth of Rajasthan and beyond.',
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
        "Rooted in Kota, Rajasthan, we believe in building lasting relationships with our customers and partners — united by a love for bold, timeless style.",
    },
  ]

  const milestones = [
    { year: "2022", event: "Drapperr Drift founded in Kota, Rajasthan with a vision to bring big-city fashion to local youth" },
    { year: "2023", event: "Opened our flagship store at Shubh Affinity, Swami Vivekananda Nagar, Kota" },
    { year: "2023", event: "Launched online store, delivering fashion to customers across Rajasthan and India" },
    { year: "2024", event: "Expanded product range — T-shirts, hoodies, denim, and premium streetwear" },
    { year: "2024", event: "Crossed 5,000+ happy customers in Kota, Vigyan Nagar, Talwandi, and beyond" },
    { year: "2025", event: "Continued growth with new arrivals every season and pan-India shipping" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-surface-container-low py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="display-lg text-foreground mb-6">
                Kota's Go-To Clothing Store, Since Day One
              </h1>
              <p className="body-lg text-muted-foreground mb-8 leading-relaxed">
                Drapperr Drift was born in Kota, Rajasthan — built for the bold, the stylish, and the young at heart.
                We bring premium streetwear, trendy T-shirts, hoodies, and denim to the youth of Kota and ship across India.
                Walk into our store at Shubh Affinity, Swami Vivekananda Nagar, or shop from anywhere in the country.
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
                alt="Drapperr Drift store interior in Kota, Rajasthan"
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
              Drapperr Drift started with a simple idea: why should the youth of Kota, Rajasthan have to travel to metro cities
              just to find fashion that actually speaks to them? We set up shop in Kota's Swami Vivekananda Nagar to bring
              bold, contemporary clothing right to the doorstep of Rajasthan's most dynamic city.
            </p>
            <p>
              From our flagship store at Shubh Affinity — right next to DMART, Kota — we've served customers from Vigyan Nagar,
              Talwandi, Mahaveer Nagar, Landmark City, Shreenathpuram, Gumanpura, and every corner of Kota.
              Today, we also ship pan-India so everyone can dress like Kota's finest.
            </p>
            <p>
              We curate every piece with care — from graphic tees to premium hoodies, from relaxed denim to streetwear essentials —
              because great style should be accessible, not exclusive. That's the Drapperr Drift promise.
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
              Key milestones in the Drapperr Drift story
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
          <h2 className="display-sm mb-4">Join the Drapperr Drift Family</h2>
          <p className="body-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Whether you're in Kota, Rajasthan or anywhere across India — discover clothing that speaks
            before you do. Bold pieces, fair prices, fast delivery.
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
              Visit Our Store in Kota
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
