import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Drapperr Drift – Clothing Store Kota, Rajasthan',
  description:
    'Frequently asked questions about Drapperr Drift — Kota\'s best clothing store. Get answers about orders, shipping across India, returns, sizing, and visiting our store in Swami Vivekananda Nagar, Kota.',
  keywords: [
    'Drapperr Drift FAQ',
    'clothing store Kota FAQ',
    'fashion store returns policy Kota',
    'shipping Rajasthan clothing',
    'Drapperr Drift help',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/faq',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
