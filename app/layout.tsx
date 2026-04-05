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

export const metadata: Metadata = {
  title: {
    default: 'Drapperr Drift | High Fashion Redefined',
    template: '%s | Drapperr Drift',
  },
  description: 'Discover curated high-fashion pieces that define contemporary elegance. Shop the latest collections at Drapperr Drift.',
  keywords: ['fashion', 'luxury', 'clothing', 'designer', 'contemporary', 'high fashion'],
  generator: 'v0.app',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
