import React from 'react';
import { SEO_CONSTANTS } from './constants';

export function TaxiServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TaxiService'],
    name: SEO_CONSTANTS.siteName,
    image: SEO_CONSTANTS.defaultOgImage,
    '@id': `${SEO_CONSTANTS.siteUrl}/#business`,
    url: SEO_CONSTANTS.siteUrl,
    telephone: SEO_CONSTANTS.phone,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office No 1102 P2 Kanjurmarg East',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400042',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SEO_CONSTANTS.geo.latitude,
      longitude: SEO_CONSTANTS.geo.longitude,
    },
    areaServed: [
      'Mumbai',
      'Pune',
      'Lonavala',
      'Alibaug',
      'Matheran',
      'Shirdi',
      'Mahabaleshwar',
      'Igatpuri',
      'Ashtavinayak',
      'Konkan',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function FAQPageSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const absoluteUrl = item.url.startsWith('http')
        ? item.url
        : `${SEO_CONSTANTS.siteUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl,
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}
