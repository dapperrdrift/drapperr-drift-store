import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

const SITE_URL = 'https://dapperrdrift.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Drapperr Drift | Best Clothing Store in Kota, Rajasthan',
    template: '%s | Drapperr Drift – Clothing Store in Kota',
  },
  description:
    'Drapperr Drift is Kota\'s top clothing store, located at Shubh Affinity, Swami Vivekananda Nagar. Shop trendy men\'s T-shirts, hoodies, denim & streetwear. Serving Kota, Rajasthan & shipping across India.',
  keywords: [
    // Hyper-local Kota keywords
    'clothing store in Kota',
    'clothing store in Kota Rajasthan',
    'clothing shop in Kota',
    'fashion store in Kota',
    'best clothing store Kota',
    'branded clothes in Kota',
    'men\'s clothing store Kota',
    'streetwear Kota',
    'trendy clothes Kota',
    'T-shirts in Kota',
    'hoodies in Kota',
    'denim jeans Kota',
    'casual wear Kota',
    // Local area targeting
    'clothing store Swami Vivekananda Nagar Kota',
    'fashion store near DMART Kota',
    'Shubh Affinity clothing store',
    'clothing store Vigyan Nagar Kota',
    'clothing store Talwandi Kota',
    'fashion store Mahaveer Nagar Kota',
    'clothing store DCM Kota',
    'clothing store Gumanpura Kota',
    'fashion store Landmark City Kota',
    'clothing store Shreenathpuram Kota',
    'clothing store Kota City Centre',
    'clothing store Rajiv Gandhi Nagar Kota',
    'clothing store Nayapura Kota',
    'clothes shop Kota Junction',
    // Rajasthan broader
    'clothing store in Rajasthan',
    'fashion store Rajasthan',
    'online clothing store Rajasthan',
    'trendy clothes Rajasthan',
    // Metro + national
    'online fashion store India',
    'men\'s streetwear India',
    'casual wear India',
    'affordable fashion India',
    // Brand
    'Drapperr Drift',
    'Dapperr Drift Kota',
    'Drapperr Drift Kota',
  ],
  authors: [{ name: 'Drapperr Drift', url: SITE_URL }],
  creator: 'Drapperr Drift',
  publisher: 'Drapperr Drift',
  generator: 'Next.js',
  applicationName: 'Drapperr Drift',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Drapperr Drift',
    title: 'Drapperr Drift | Best Clothing Store in Kota, Rajasthan',
    description:
      'Shop Kota\'s trendiest clothing at Drapperr Drift — T-shirts, hoodies, denim & streetwear. Located at Shubh Affinity, Swami Vivekananda Nagar, Kota. Fast shipping across India.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Drapperr Drift – Clothing Store in Kota, Rajasthan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drapperr Drift | Best Clothing Store in Kota, Rajasthan',
    description:
      'Kota\'s trendiest clothing store. T-shirts, hoodies, denim & more. Shop online or visit us at Shubh Affinity, Swami Vivekananda Nagar, Kota.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'fashion',
  icons: {
    icon: '/favicon.png?v=2',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FCF9F8',
  width: 'device-width',
  initialScale: 1,
}

// LocalBusiness JSON-LD structured data — critical for Google Maps & local pack ranking
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Drapperr Drift',
  alternateName: ['Dapperr Drift', 'Drapper Drift'],
  description:
    'Drapperr Drift is a premium clothing store in Kota, Rajasthan, offering trendy T-shirts, hoodies, denim, and streetwear for men. Located at Shubh Affinity, Swami Vivekananda Nagar.',
  url: SITE_URL,
  telephone: '+91-1800-123-4567',
  email: 'support@dapperr.com',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. F6, First Floor, Shubh Affinity, Next to DMART, Swami Vivekananda Nagar',
    addressLocality: 'Kota',
    addressRegion: 'Rajasthan',
    postalCode: '324010',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.124358,
    longitude: 75.822585,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  image: [`${SITE_URL}/images/og-image.jpg`],
  logo: `${SITE_URL}/images/logo-black.svg`,
  sameAs: [
    'https://www.instagram.com/dapperr.drift',
    // 'https://www.facebook.com/drapperrdrift',
  ],
  hasMap: 'https://maps.google.com/?q=Drapperr+Drift+Kota+Rajasthan',
  areaServed: [
    { '@type': 'City', name: 'Kota', containedInPlace: { '@type': 'State', name: 'Rajasthan' } },
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'Country', name: 'India' },
  ],
  servesCuisine: undefined,
  knowsAbout: ['Men\'s Fashion', 'Streetwear', 'Casual Wear', 'T-Shirts', 'Hoodies', 'Denim'],
}

// Organization schema for brand authority
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Drapperr Drift',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-black.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-1800-123-4567',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. F6, First Floor, Shubh Affinity, Next to DMART, Swami Vivekananda Nagar',
    addressLocality: 'Kota',
    addressRegion: 'Rajasthan',
    postalCode: '324010',
    addressCountry: 'IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
