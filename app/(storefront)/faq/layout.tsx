import type { Metadata } from 'next'
import { faqCategories, buildFAQSchema } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'FAQ | Dapperr Drift – Clothing Store Kota, Rajasthan',
  description:
    'Frequently asked questions about Dapperr Drift — Kota\'s best clothing store. Get answers about orders, shipping across India, returns, sizing, and visiting our store in Swami Vivekananda Nagar, Kota.',
  keywords: [
    'Dapperr Drift FAQ',
    'clothing store Kota FAQ',
    'fashion store returns policy Kota',
    'shipping Rajasthan clothing',
    'Dapperr Drift help',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/faq',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const allFaqs = faqCategories.flatMap((c) => c.faqs)
  const faqSchema = buildFAQSchema(allFaqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
