import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/booking-confirmed',
          '/enquiry-confirmed',
          '/inquiry-confirmed',
        ],
      },
    ],
    sitemap: 'https://citytourcabs.in/sitemap.xml',
    host: 'https://citytourcabs.in',
  };
}
