import type { Metadata } from 'next'
import { createClient } from "@/lib/supabase/server"
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
  title: 'Dapperr Drift | Premium Streetwear, Shipped Pan-India',
  description:
    'Discover premium streetwear for GenZ at Dapperr Drift. Shop our trendy, high-quality collection of T-shirts, hoodies, and denim online, with fast shipping across India.',
  keywords: [
    'streetwear brand India',
    'online clothing store India',
    "men's oversized T-shirts India",
    'premium hoodies India',
    'Indian streetwear brand',
    'buy streetwear online India',
    'denim jeans online India',
    'GenZ fashion India',
    'casual wear men India',
    'trendy clothing online India',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com',
  },
  openGraph: {
    title: 'Dapperr Drift | Premium Streetwear, Shipped Pan-India',
    description:
      'Shop trendy, premium GenZ streetwear at Dapperr Drift. Fast shipping PAN-India.',
    url: 'https://dapperrdrift.com',
    type: 'website',
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: heroSlides } = await supabase
    .from("hero_slides")
    .select("id, image_url, video_url, media_type, overlay_text, link_url")
    .eq("is_active", true)
    .order("display_order")

  return (
    <>
      <HeroSection slides={heroSlides ?? []} />
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
