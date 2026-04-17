import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide | Dapperr Drift – Clothing Store Kota',
  description:
    'Find your perfect fit with the Dapperr Drift size guide. Measurements for T-shirts, hoodies, denim, and more. Shop confidently online or visit our store in Kota, Rajasthan.',
  keywords: [
    'Dapperr Drift size guide',
    'clothing size chart Kota',
    'T-shirt size guide India',
    'hoodie sizing Dapperr Drift',
    'fashion fit guide Kota',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/size-guide',
  },
}

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
