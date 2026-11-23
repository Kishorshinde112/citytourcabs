import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { getPageBySlug } from '@/lib/cmsPages';
import { getInitialTourCards } from '@/modules/tours/queries';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home');
  const seo = (page as any)?.seo;

  const homeTitle = seo?.title || 'City Tour Cabs - Best Cab & Taxi Service in Mumbai';

  return {
    title: {
      absolute: homeTitle,
    },
    ...(seo?.description ? { description: seo.description } : {}),
    alternates: {
      canonical: seo?.canonical || 'https://citytourcabs.in/',
    },
  };
}

export default async function HomePage() {
  const [page, initialTours] = await Promise.all([
    getPageBySlug('home'),
    getInitialTourCards(),
  ]);

  if (!page?.layout?.length) {
    return <HomeClient initialTours={initialTours} />;
  }

  return <HomeClient blocks={page.layout} initialTours={initialTours} />;
}
