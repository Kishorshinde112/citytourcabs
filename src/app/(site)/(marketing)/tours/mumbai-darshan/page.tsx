import React from 'react';
import type { Metadata } from 'next';
import MumbaiDarshanClient from './MumbaiDarshanClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Mumbai Darshan Tour Packages',
  description:
    'Book private Mumbai Darshan cab tour with City Tour Cabs. Visit Gateway of India, Marine Drive, Siddhivinayak, Bandra-Worli Sea Link & 20+ iconic spots with expert driver-cum-guides. Fixed tariffs from ₹2,300/-.',
  keywords: [
    'mumbai darshan cab service',
    'mumbai darshan tour packages',
    'mumbai sightseeing taxi fare',
    'full day mumbai sightseeing cab',
    'mumbai private cab tour',
    'mumbai darshan car rental',
    'city tour cabs mumbai'
  ],
  alternates: {
    canonical: 'https://citytourcabs.in/tours/mumbai-darshan',
  },
  openGraph: {
    title: 'Mumbai Darshan Tour Packages | Full Day Sightseeing Cab - City Tour Cabs',
    description:
      'Explore Mumbai’s 23 iconic landmarks in a sanitized private AC cab. Fixed rates, doorstep pickup & drop, and local driver-cum-guides.',
    url: 'https://citytourcabs.in/tours/mumbai-darshan',
    siteName: 'City Tour Cabs',
    images: [
      {
        url: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792352358/citytourcabs/assets/tours/mumbai-darshan.jpg',
        width: 1200,
        height: 630,
        alt: 'Mumbai Darshan Sightseeing Cab Tour',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mumbai Darshan Tour Packages | City Tour Cabs',
    description:
      'Book private Mumbai Darshan cab tour. Fixed tariffs from ₹2,300/- with expert local guide drivers.',
    images: ['https://res.cloudinary.com/o0mbamog/image/upload/v1792352358/citytourcabs/assets/tours/mumbai-darshan.jpg'],
  },
};

export default function MumbaiDarshanDedicatedPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: 'Mumbai Darshan Full Day Sightseeing Tour',
    description:
      'Private guided sightseeing cab tour covering South Mumbai colonial monuments, North Mumbai temples, and Arabian sea beaches.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'City Tour Cabs',
      telephone: '+91-7021001921',
      priceRange: '₹2,300 - ₹9,500',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: 23,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Gateway of India' },
        { '@type': 'ListItem', position: 2, name: 'Taj Mahal Palace Hotel' },
        { '@type': 'ListItem', position: 3, name: 'Marine Drive' },
        { '@type': 'ListItem', position: 4, name: 'CSMT Victoria Terminus' },
        { '@type': 'ListItem', position: 5, name: 'Shree Siddhivinayak Temple' },
        { '@type': 'ListItem', position: 6, name: 'Haji Ali Dargah' },
        { '@type': 'ListItem', position: 7, name: 'Bandra-Worli Sea Link' },
        { '@type': 'ListItem', position: 8, name: 'Juhu Beach' },
      ],
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '2300',
      highPrice: '9500',
      offerCount: '7',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://citytourcabs.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tours',
        item: 'https://citytourcabs.in/tours',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Mumbai Darshan',
        item: 'https://citytourcabs.in/tours/mumbai-darshan',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the starting cab fare for Mumbai Darshan tour packages?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Private Mumbai Darshan sightseeing cab service starts from ₹2,300 for a WagonR (8 Hours / 80 Kms). Sedans start at ₹2,500, Ertiga MUV at ₹3,200, and Innova Crysta at ₹3,800.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are toll and parking charges included in the Mumbai Darshan taxi fare?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, toll, parking fees, and attraction entry tickets are not included in the base car rental fare and are payable as incurred.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do drivers act as guides during the sightseeing tour?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, City Tour Cabs provides experienced local chauffeurs who act as friendly driver-guides, familiar with Mumbai landmarks, history, and optimal sightseeing routes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is doorstep pickup and customizable timing provided?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer doorstep pickup and drop from your hotel, residence, or airport across Mumbai with flexible departure timing.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many sightseeing spots can be visited in a day?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Depending on traffic and duration, 8–10 spots are covered in the 8-hour package, 10–12 spots in the 10-hour package, and 14+ iconic spots in the 12-hour package.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MumbaiDarshanClient />
    </>
  );
}
