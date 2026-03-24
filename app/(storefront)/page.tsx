import { HeroSection } from "@/components/home/hero-section"
import { CollectionsSection } from "@/components/home/collections-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CollectionsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
