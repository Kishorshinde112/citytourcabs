import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/booking-confirmed',
          '/inquiry-confirmed',
          '/enquiry-confirmed',
        ],
      },
    ],
    sitemap: 'https://citytourcabs.in/sitemap.xml',
  };
}
