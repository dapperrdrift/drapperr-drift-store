import type { Metadata } from 'next'
import { HeroSection } from "@/components/home/hero-section"
import { CollectionsSection } from "@/components/home/collections-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { BrandStorySection } from "@/components/home/brand-story-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { MarqueeStrip } from "@/components/home/marquee-strip"
import { CategoryCarousels } from "@/components/home/category-carousels"
import { LookbookSection } from "@/components/home/lookbook-section"
import { PressStrip } from "@/components/home/press-strip"
import { HomeFaq } from "@/components/home/home-faq"
import { VisitStoreCta } from "@/components/home/visit-store-cta"

export const metadata: Metadata = {
  title: 'Dapperr Drift | Find Best Streetwear in Kota',
  description:
    'Discover premium streetwear for GenZ at Dapperr Drift. Find the best streetwear in Kota or shop our trendy, high-quality collection online across India.',
  keywords: [
    'clothing store in Kota',
    'fashion store Kota Rajasthan',
    'men clothing Kota',
    'best clothing store Kota',
    'T-shirts Kota',
    'hoodies Kota',
    'streetwear Kota',
    'denim jeans Kota',
    'clothing store near me Kota',
    'Swami Vivekananda Nagar clothing',
    'Shubh Affinity shopping Kota',
    'Vigyan Nagar clothing store',
    'Talwandi fashion store',
    'Mahaveer Nagar clothes',
    'Landmark City Kota shopping',
    'Shreenathpuram fashion Kota',
    'clothing store Rajasthan',
    'online clothing store India',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com',
  },
  openGraph: {
    title: 'Dapperr Drift | Find Best Streetwear in Kota',
    description:
      'Shop trendy, premium GenZ streetwear at Dapperr Drift. Located at Shubh Affinity, Kota. Fast shipping PAN-India.',
    url: 'https://dapperrdrift.com',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedProducts />
      <CategoryCarousels />
      <CollectionsSection />
      <LookbookSection />
      <BrandStorySection />
      <PressStrip />
      <TestimonialsSection />
      <HomeFaq />
      <VisitStoreCta />
      <CTASection />
    </>
  )
}
