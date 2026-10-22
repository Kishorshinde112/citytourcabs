import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { getPageBySlug } from '@/lib/cmsPages';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home');
  const seo = (page as any)?.seo;

  return {
    ...(seo?.title ? { title: seo.title } : {}),
    ...(seo?.description ? { description: seo.description } : {}),
    alternates: {
      canonical: seo?.canonical || 'https://citytourcabs.in/',
    },
  };
}

export default async function HomePage() {
  const page = await getPageBySlug('home');

  if (!page?.layout?.length) {
    return <HomeClient />;
  }

  return <HomeClient blocks={page.layout} />;
}
