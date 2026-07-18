import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import './globals.css'

const GA_MEASUREMENT_ID = 'G-B83PC2MCE2'

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
    default: 'Dapperr Drift | Premium Streetwear Clothing India',
    template: '%s | Dapperr Drift – Premium Streetwear',
  },
  description:
    'Discover premium streetwear for GenZ at Dapperr Drift. Shop the latest trendy, high-quality men\'s oversized T-shirts, graphic tees, hoodies, and denim online with fast shipping across India.',
  keywords: [
    // Streetwear Fashion keywords
    'premium streetwear India',
    'oversized t-shirts India',
    'oversized graphic tees online',
    'streetwear clothing brand India',
    'buy streetwear online India',
    'GenZ streetwear fashion',
    'men\'s streetwear India',
    'trendy clothes online India',
    'oversized hoodies online',
    'streetwear denim jeans',
    'baggy jeans India',
    'casual wear for men',
    'printed t-shirts online',
    'aesthetic streetwear India',
    'urban fashion brand',
    'Dapperr Drift clothing',
    'Dapperr Drift online store',
  ],
  authors: [{ name: 'Dapperr Drift', url: SITE_URL }],
  creator: 'Dapperr Drift',
  publisher: 'Dapperr Drift',
  generator: 'Next.js',
  applicationName: 'Dapperr Drift',
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
    siteName: 'Dapperr Drift',
    title: 'Dapperr Drift | Premium Streetwear Clothing India',
    description:
      'Shop India\'s trendiest premium streetwear at Dapperr Drift. Graphic tees, oversized fits, hoodies & denim. Fast shipping PAN India.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dapperr Drift – Premium Streetwear Clothing India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dapperr Drift | Premium Streetwear Clothing India',
    description:
      'Discover premium GenZ streetwear at Dapperr Drift. Shop the latest oversized tees, hoodies, denim & more online across PAN India.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'fashion',
  icons: {
    icon: '/favicon.png?v=3',
    apple: '/favicon.png',
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
  name: 'Dapperr Drift',
  alternateName: ['Dapperr Drift'],
  description:
    'Dapperr Drift is a premium streetwear brand offering trendy oversized T-shirts, hoodies, denim, and casual wear for men. High-quality designs with PAN-India delivery and a retail store in Rajasthan.',
  url: SITE_URL,
  telephone: '',
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
  hasMap: 'https://maps.google.com/?q=Dapperr+Drift+Kota+Rajasthan',
  areaServed: [
    { '@type': 'Country', name: 'India' },
  ],
  knowsAbout: ['Men\'s Fashion', 'Streetwear', 'Casual Wear', 'T-Shirts', 'Hoodies', 'Denim'],
}

// Organization schema for brand authority
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dapperr Drift',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-black.svg`,
  foundingDate: '2021',
  sameAs: [
    'https://www.instagram.com/dapperr.drift',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@dapperr.com',
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
        <WhatsAppButton />
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
