import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide | Dapperr Drift – Find Your Perfect Fit',
  description:
    'Find your perfect fit with the Dapperr Drift size guide. Accurate measurements for oversized T-shirts, graphic tees, hoodies, and denim. Shop premium streetwear online with confidence.',
  keywords: [
    'Dapperr Drift size guide',
    'oversized t-shirt size chart',
    'streetwear size guide India',
    'hoodie sizing Dapperr Drift',
    'oversized hoodie fit guide',
  ],
  alternates: {
    canonical: 'https://dapperrdrift.com/size-guide',
  },
}

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
