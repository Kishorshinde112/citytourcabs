import type { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/cmsPages';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('privacy-policy');
  const seo = (page as any)?.seo;

  return {
    title: seo?.title || 'Privacy Policy',
    description:
      seo?.description ||
      'Read the City Tour Cabs Privacy Policy to understand how we collect, use, and protect your personal information when booking our cabs and tour services.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: seo?.canonical || 'https://citytourcabs.in/privacy-policy',
    },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug('privacy-policy');

  if (!page?.layout?.length) {
    return <PrivacyPolicyClient />;
  }

  return <PageBlocks blocks={page.layout} />;
}
