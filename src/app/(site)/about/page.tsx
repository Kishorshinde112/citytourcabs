import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | City Tour Cabs Mumbai',
  description:
    'City Tour Cabs is your trusted local taxi and sightseeing tour partner in Mumbai. Fast doorstep pickup, certified drivers, and sanitized cabs.',
  openGraph: {
    title: 'About Us - City Tour Cabs Mumbai',
    description:
      'Learn about City Tour Cabs: Mumbai’s most trusted cab service for sightseeing, outstation, airport transfers and local rides.',
    url: 'https://citytourcabs.in/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
