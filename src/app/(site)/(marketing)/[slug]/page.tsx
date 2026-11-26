import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import RenderBlocks from '@/blocks/RenderBlocks';
import { getPageBySlug } from '@/lib/cmsPages';
import { resolveCmsRedirect } from '@/lib/cmsGlobals';
import { createMetadata } from '@/modules/seo/metadata';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === 'home') {
    return {
      alternates: {
        canonical: 'https://citytourcabs.in/',
      },
    };
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const seo = (page as any)?.seo;

  return createMetadata({
    title: seo?.title || page.title,
    description: seo?.description,
    canonical: seo?.canonical || `/${slug}`,
    image: seo?.ogImage?.url,
  });
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === 'home') {
    permanentRedirect('/');
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    const cmsRedirect = await resolveCmsRedirect(`/${slug}`);
    if (cmsRedirect?.destination) {
      if (cmsRedirect.permanent) {
        permanentRedirect(cmsRedirect.destination);
      }
      redirect(cmsRedirect.destination);
    }
    notFound();
  }

  if (page.layout?.length) {
    return <RenderBlocks blocks={page.layout} />;
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{page.title}</h1>
    </div>
  );
}
