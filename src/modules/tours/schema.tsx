import React from 'react';
import { TourPackage } from './types';
import { SEO_CONSTANTS } from '@/modules/seo/constants';

export function TourSchema({ tour }: { tour: TourPackage }) {
  if (!tour) return null;

  const lowPrice = tour.startingPrice ? String(tour.startingPrice).replace(/\D/g, '') || '2300' : '2300';
  const url = `${SEO_CONSTANTS.siteUrl}/tours/${tour.slug || tour.id}`;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.shortDescription || tour.tagline || `${tour.title} with City Tour Cabs Mumbai`,
    url,
    image: tour.heroImage || tour.banner || SEO_CONSTANTS.defaultOgImage,
    provider: {
      '@type': ['LocalBusiness', 'TaxiService'],
      name: SEO_CONSTANTS.siteName,
      telephone: SEO_CONSTANTS.phone,
      url: SEO_CONSTANTS.siteUrl,
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
    },
    ...(tour.rating && tour.reviewsCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(tour.rating),
            reviewCount: String(tour.reviewsCount),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice,
      offerCount: '5',
    },
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
