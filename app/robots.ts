import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: 'https://www.dapperrdrift.com/sitemap.xml',
    host: 'https://www.dapperrdrift.com',
  }
}
