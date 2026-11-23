import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload.config';
import tourPagesData from '@/data/tourPagesData.json';

export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}> = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/tours', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/fleet', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.5, changeFrequency: 'yearly' },
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
  const pageSlugs = new Set<string>();
  const updatedAt = new Map<string, string>();

  try {
    const payload = await getPayload({ config });

    // 1. Fetch all Tour slugs
    let tourPage = 1;
    do {
      const batch = await payload.find({
        collection: 'tours',
        page: tourPage,
        limit: 100,
        depth: 0,
        overrideAccess: true,
      });
      for (const tour of batch.docs) {
        if (tour.slug) {
          tourSlugs.add(tour.slug);
          if (tour.updatedAt) updatedAt.set(`tour:${tour.slug}`, tour.updatedAt);
        }
      }
      if (!batch.hasNextPage) break;
      tourPage++;
    } while (tourPage < 50);

    // 2. Fetch all CMS Page slugs
    let pageNum = 1;
    do {
      const pagesBatch = await payload.find({
        collection: 'pages',
        page: pageNum,
        limit: 100,
        depth: 0,
        overrideAccess: true,
      });
      for (const pageDoc of pagesBatch.docs) {
        if (pageDoc.slug && pageDoc.slug !== 'home') {
          pageSlugs.add(pageDoc.slug);
          if (pageDoc.updatedAt) updatedAt.set(`page:${pageDoc.slug}`, pageDoc.updatedAt);
        }
      }
      if (!pagesBatch.hasNextPage) break;
      pageNum++;
    } while (pageNum < 50);
  } catch (err) {
    console.warn('[Sitemap] CMS query failed; using static fallback slugs:', err instanceof Error ? err.message : err);
  }

  const tourEntries: MetadataRoute.Sitemap = [...tourSlugs].map((slug) => ({
    url: `${baseUrl}/tours/${encodeURIComponent(slug)}`,
    lastModified: updatedAt.has(`tour:${slug}`) ? new Date(updatedAt.get(`tour:${slug}`)!) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const pageEntries: MetadataRoute.Sitemap = [...pageSlugs].map((slug) => ({
    url: `${baseUrl}/${encodeURIComponent(slug)}`,
    lastModified: updatedAt.has(`page:${slug}`) ? new Date(updatedAt.get(`page:${slug}`)!) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const allEntries = [...routes, ...tourEntries, ...pageEntries];
  const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of allEntries) {
    let normalizedUrl = entry.url.trim();
    if (normalizedUrl.length > baseUrl.length && normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    if (!uniqueMap.has(normalizedUrl)) {
      uniqueMap.set(normalizedUrl, { ...entry, url: normalizedUrl });
    }
  }

  return Array.from(uniqueMap.values());
}
