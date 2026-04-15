import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide | Drapperr Drift – Clothing Store Kota',
  description:
    'Find your perfect fit with the Drapperr Drift size guide. Measurements for T-shirts, hoodies, denim, and more. Shop confidently online or visit our store in Kota, Rajasthan.',
  keywords: [
    'Drapperr Drift size guide',
    'clothing size chart Kota',
    'T-shirt size guide India',
    'hoodie sizing Drapperr Drift',
    'fashion fit guide Kota',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/size-guide',
  },
}

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
