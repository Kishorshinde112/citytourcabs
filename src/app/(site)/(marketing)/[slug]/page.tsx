import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/cmsPages';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const seo = (page as any)?.seo;

  return {
    title: seo?.title || page.title,
    ...(seo?.description ? { description: seo.description } : {}),
    alternates: {
      canonical:
        seo?.canonical ||
        (slug === 'home' ? 'https://citytourcabs.in/' : `https://citytourcabs.in/${slug}`),
    },
  };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  if (page.layout?.length) {
    return <PageBlocks blocks={page.layout} />;
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{page.title}</h1>
    </div>
  );
}
