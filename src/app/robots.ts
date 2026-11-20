import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/booking-confirmed', '/enquiry-confirmed'],
      },
    ],
    sitemap: 'https://citytourcabs.in/sitemap.xml',
  };
}