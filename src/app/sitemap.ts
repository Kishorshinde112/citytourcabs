import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload.config';
import tourPagesData from '@/data/tourPagesData.json';

export const dynamic = 'force-dynamic';

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/tours', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://citytourcabs.in').replace(/\/$/, '');
  const now = new Date();

  const routes: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const tourSlugs = new Set(Object.keys(tourPagesData));
  const updatedAt = new Map<string, string>();

  try {
    const payload = await getPayload({ config });
    let page = 1;
    do {
      const batch = await payload.find({
        collection: 'tours',
        page,
        limit: 100,
        depth: 0,
        overrideAccess: true,
      });
      for (const tour of batch.docs) {
        if (tour.slug) {
          tourSlugs.add(tour.slug);
          if (tour.updatedAt) updatedAt.set(tour.slug, tour.updatedAt);
        }
      }
      if (!batch.hasNextPage) break;
      page++;
    } while (page < 100);
  } catch {
    console.warn('[Sitemap] CMS unavailable; using static tour slugs');
  }

  return [
    ...routes,
    ...[...tourSlugs].map((slug) => ({
      url: `${baseUrl}/tours/${encodeURIComponent(slug)}`,
      ...(updatedAt.has(slug) ? { lastModified: new Date(updatedAt.get(slug)!) } : { lastModified: now }),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
