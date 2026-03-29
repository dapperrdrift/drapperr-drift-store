import Image from "next/image"
import Link from "next/link"
import { Heart, Leaf, Award, Users } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Craftsmanship",
      description:
        "Every piece is crafted with meticulous attention to detail, using time-honored techniques passed down through generations of master artisans.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "We're committed to ethical sourcing and sustainable practices, working with partners who share our vision for a more responsible fashion industry.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "We source only the finest materials—from Italian wool to Mongolian cashmere—ensuring every garment meets our exacting standards.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We believe in building lasting relationships with our customers, artisans, and partners, creating a community united by a love for timeless style.",
    },
  ]

  const milestones = [
    { year: "2018", event: "Drapperr founded in Mumbai with a vision to redefine Indian luxury fashion" },
    { year: "2019", event: "Launched our first collection featuring 50 handcrafted pieces" },
    { year: "2020", event: "Expanded to online retail, reaching customers across India" },
    { year: "2021", event: "Introduced our sustainable fashion initiative" },
    { year: "2022", event: "Opened flagship store in Delhi and expanded to 10,000+ happy customers" },
    { year: "2023", event: "Launched premium cashmere and wool collection" },
    { year: "2024", event: "Celebrating 6 years of timeless Indian craftsmanship" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-surface-container-low py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="display-lg text-foreground mb-6">
                Crafting Timeless Elegance Since 2018
              </h1>
              <p className="body-lg text-muted-foreground mb-8 leading-relaxed">
                Drapperr was born from a simple belief: that exceptional clothing should be both beautifully crafted and thoughtfully made. We blend traditional Indian craftsmanship with contemporary design to create pieces that transcend seasons and trends.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 label-md text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Explore Our Collection
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
              <Image
                src="/images/about-hero.jpg"
                alt="Drapperr atelier with artisans at work"
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
              Founded in Mumbai in 2018, Drapperr emerged from founder Vikram Mehta&apos;s passion for preserving India&apos;s rich textile heritage while creating contemporary wardrobe essentials. After years working with luxury fashion houses across Europe and Asia, Vikram returned home with a vision: to create a brand that honors traditional craftsmanship while embracing modern sensibilities.
            </p>
            <p>
              What started as a small atelier with five skilled artisans has grown into a beloved brand serving thousands of customers who appreciate the art of slow fashion. Each piece in our collection is designed in-house, crafted with care, and made to be treasured for years to come.
            </p>
            <p>
              Today, we work with over 50 master craftspeople across India, from weavers in Varanasi to tailors in Mumbai, ensuring that each garment carries the soul of Indian artisanship while meeting the highest international standards of quality.
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
              Key milestones in the Drapperr story
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border sm:-translate-x-px" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
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
          <h2 className="display-sm mb-4">Join the Drapperr Family</h2>
          <p className="body-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of tradition and modernity. Discover pieces crafted with passion, designed to last, and made for those who appreciate true quality.
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
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
