import type { Metadata } from 'next';
import ToursClient from './ToursClient';

export const metadata: Metadata = {
  title: 'Cab Tour Packages from Mumbai',
  description:
    'Browse Mumbai Darshan, Lonavala, Alibaug, Matheran, Shirdi, Mahabaleshwar, Ashtavinayak, Jyotirlinga and Konkan cab tour packages with transparent rates and doorstep pickup.',
  alternates: {
    canonical: 'https://citytourcabs.in/tours',
  },
  openGraph: {
    title: 'Cab Tour Packages from Mumbai | City Tour Cabs',
    description:
      'Private AC cabs with local driver-guides for Mumbai Darshan and outstation tours. Fixed, transparent packages.',
    url: 'https://citytourcabs.in/tours',
    siteName: 'City Tour Cabs',
    type: 'website',
  },
};

export default function ToursListingPage() {
  return <ToursClient />;
}
