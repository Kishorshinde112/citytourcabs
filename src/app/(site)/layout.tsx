import React from 'react';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import '@/app/globals.css';

const GTM_CONTAINER_ID = 'GTM-PS2XBSRK';
const PRODUCTION_ANALYTICS_HOSTS = new Set(['citytourcabs.in', 'www.citytourcabs.in']);

const GTM_BOOTSTRAP = `
  (function (w, d, s, l, i) {
    var host = w.location.hostname.toLowerCase().replace(/\\.$/, '');
    if (${JSON.stringify(Array.from(PRODUCTION_ANALYTICS_HOSTS))}.indexOf(host) === -1) return;
    if (d.getElementById('gtm-script')) return;

    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.id = 'gtm-script';
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', '${GTM_CONTAINER_ID}');
`;

function normalizeHostname(host: string | null | undefined) {
  return (host || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
}

function isProductionAnalyticsHost(host: string | null | undefined) {
  return PRODUCTION_ANALYTICS_HOSTS.has(normalizeHostname(host));
}

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
        url: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
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
    images: ['https://res.cloudinary.com/o0mbamog/image/upload/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png'],
  },
  icons: {
    icon: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
    apple: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
  },
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const showGtmNoscript = isProductionAnalyticsHost(requestHost);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_BOOTSTRAP }} />
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
              image: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
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
        {/* Google Tag Manager (noscript) */}
        {showGtmNoscript && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        {/* Google Tag (gtag.js) for GA4 (G-E6E794WM68) & Google Ads (AW-18526387794).
            Load only on the production hostnames so localhost and staging do not
            send analytics traffic. */}
        <Script id="google-tags-init" strategy="afterInteractive">
          {`
            (function () {
              var host = window.location.hostname.toLowerCase();
              if (host.endsWith('.')) host = host.slice(0, -1);
              if (host !== 'citytourcabs.in' && host !== 'www.citytourcabs.in') return;

              var dataLayer = (window.dataLayer = window.dataLayer || []);
              window.gtag = function () { dataLayer.push(arguments); };
              window.gtag('js', new Date());

              window.gtag('config', 'G-E6E794WM68', {
                page_path: window.location.pathname,
              });
              window.gtag('config', 'AW-18526387794', {
                page_path: window.location.pathname,
              });

              if (document.getElementById('gtag-js')) return;
              var script = document.createElement('script');
              script.id = 'gtag-js';
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-E6E794WM68';
              document.head.appendChild(script);
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
