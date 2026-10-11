import React from 'react';
import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';

export const viewport: Viewport = {
  themeColor: '#1A96EB',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://citytourcabs.in'),
  title: {
    template: '%s | City Tour Cabs Mumbai',
    default: 'City Tour Cabs - Professional Cabs & Guided Sightseeing Tours Mumbai',
  },
  description:
    'Book affordable, sanitized cabs with friendly driver-guides across Mumbai Darshan, Lonavala, Alibaug, Shirdi, Mahabaleshwar, Ashtavinayak and outstation routes.',
  keywords: [
    'mumbai darshan cab',
    'cab booking mumbai',
    'lonavala cab from mumbai',
    'shirdi cab booking',
    'mahabaleshwar sightseeing cab',
    'ashtavinayak tour by cab',
    'mumbai tour guide driver',
    'car rental mumbai',
    'outstation cabs mumbai',
  ],
  openGraph: {
    type: 'website',
    url: 'https://citytourcabs.in',
    title: 'City Tour Cabs - Premium Cab & Sightseeing Tour Booking',
    description:
      'Book affordable, sanitized cabs with friendly driver-guides across Mumbai, Lonavala, Alibaug, Shirdi, and outstation.',
    siteName: 'City Tour Cabs',
    images: [
      {
        url: '/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
        width: 1200,
        height: 630,
        alt: 'City Tour Cabs Mumbai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Tour Cabs - Premium Cab & Sightseeing Tour Booking',
    description:
      'Book affordable, sanitized cabs with friendly driver-guides across Mumbai, Lonavala, Alibaug, and Shirdi.',
    images: ['/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png'],
  },
  icons: {
    icon: '/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
    apple: '/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Poppins:wght@400;500;600;700&family=Reddit+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        {/* LocalBusiness JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TaxiService',
              name: 'City Tour Cabs',
              image: 'https://citytourcabs.in/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
              '@id': 'https://citytourcabs.in',
              url: 'https://citytourcabs.in',
              telephone: '+917021001921',
              priceRange: '₹₹',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Dadar / Mumbai Central',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                postalCode: '400014',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 19.076,
                longitude: 72.8777,
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '1250',
                bestRating: '5',
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
            }),
          }}
        />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased selection:bg-[#1A96EB] selection:text-white">
        {children}
      </body>
    </html>
  );
}
