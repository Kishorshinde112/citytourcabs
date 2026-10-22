import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/cmsPages';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about');
  const seo = (page as any)?.seo;

  return {
    title: seo?.title || 'About Us',
    description:
      seo?.description ||
      'City Tour Cabs is your trusted local taxi and sightseeing tour partner in Mumbai. Fast doorstep pickup, certified drivers, and sanitized cabs.',
    openGraph: {
      title: seo?.title || 'About Us - City Tour Cabs Mumbai',
      description:
        seo?.description ||
        'Learn about City Tour Cabs: Mumbai’s most trusted cab service for sightseeing, outstation, airport transfers and local rides.',
      url: 'https://citytourcabs.in/about',
    },
    alternates: {
      canonical: seo?.canonical || 'https://citytourcabs.in/about',
    },
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  if (!page?.layout?.length) {
    return <AboutClient />;
  }

  return <PageBlocks blocks={page.layout} />;
}
