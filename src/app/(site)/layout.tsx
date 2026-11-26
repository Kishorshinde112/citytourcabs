import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Poppins, Reddit_Sans, Caveat } from 'next/font/google';
import '@/app/(site)/globals.css';
import ContactClickTracking from '@/shared/layout/ContactClickTracking';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const redditSans = Reddit_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-reddit',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-caveat',
  display: 'swap',
});

const GTM_CONTAINER_ID = 'GTM-PS2XBSRK';

const DATALAYER_STUB = `
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  try {
    var gclid = new URLSearchParams(window.location.search).get('gclid');
    if (gclid) {
      gclid = gclid.trim().slice(0, 256);
      if (/^[A-Za-z0-9_.=-]+$/.test(gclid)) {
        window.sessionStorage.setItem('ctc_gclid', gclid);
      }
    }
  } catch (e) {}
`;

export const viewport: Viewport = {
  themeColor: '#0F6EB8',
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
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${poppins.variable} ${redditSans.variable} ${caveat.variable}`}
    >
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Synchronous dataLayer / gtag stub so early events queue before afterInteractive scripts load */}
        <script dangerouslySetInnerHTML={{ __html: DATALAYER_STUB }} />
        {/* LocalBusiness JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['LocalBusiness', 'TaxiService'],
              name: 'City Tour Cabs',
              image: 'https://res.cloudinary.com/o0mbamog/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1792351861/citytourcabs/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
              '@id': 'https://citytourcabs.in/#business',
              url: 'https://citytourcabs.in',
              telephone: '+917021001921',
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
                latitude: 19.1306,
                longitude: 72.9324,
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
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className={`${poppins.className} bg-white text-gray-900 font-sans antialiased selection:bg-[#0F6EB8] selection:text-white`}>
        {/* GTM, GA4 (G-E6E794WM68), Google Ads (AW-18526387794), and Umami Analytics.
            Loaded lazyOnload so conversion tags never block FCP/LCP/TBT while DATALAYER_STUB
            in <head> queues any early clicks or booking events; host-gated to production. */}
        <Script id="google-tags-init" strategy="lazyOnload">
          {`
            (function () {
              var host = window.location.hostname.toLowerCase();
              if (host.endsWith('.')) host = host.slice(0, -1);
              if (host !== 'citytourcabs.in' && host !== 'www.citytourcabs.in') return;

              var dataLayer = (window.dataLayer = window.dataLayer || []);
              window.gtag = window.gtag || function () { dataLayer.push(arguments); };
              dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

              if (!document.getElementById('gtm-script')) {
                var gtmScript = document.createElement('script');
                gtmScript.id = 'gtm-script';
                gtmScript.async = true;
                gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}';
                document.head.appendChild(gtmScript);
              }

              window.gtag('js', new Date());
              window.gtag('config', 'G-E6E794WM68', {
                page_path: window.location.pathname,
              });
              window.gtag('config', 'AW-18526387794', {
                page_path: window.location.pathname,
              });

              if (!document.getElementById('gtag-js')) {
                var gtagScript = document.createElement('script');
                gtagScript.id = 'gtag-js';
                gtagScript.async = true;
                gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-E6E794WM68';
                document.head.appendChild(gtagScript);
              }

              if (!document.getElementById('umami-analytics')) {
                var umamiScript = document.createElement('script');
                umamiScript.id = 'umami-analytics';
                umamiScript.defer = true;
                umamiScript.src = 'https://analytics.kishorlab.dev/script.js';
                umamiScript.setAttribute('data-website-id', 'c308637f-6ddb-401d-8e71-09de9e4e5da7');
                document.head.appendChild(umamiScript);
              }
            })();
          `}
        </Script>
        <ContactClickTracking />
        {children}
      </body>
    </html>
  );
}
