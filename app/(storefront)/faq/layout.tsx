import type { Metadata } from 'next'
import { faqCategories, buildFAQSchema } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'FAQ | Dapperr Drift India',
  description:
    'Frequently asked questions about Dapperr Drift. Get answers about orders, shipping across India, returns, sizing, and our retail store.',
  keywords: [
    'Dapperr Drift FAQ',
    'clothing store FAQ India',
    'fashion store returns policy India',
    'shipping India clothing',
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
