import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload.config';
import tourPagesData from '@/data/tourPagesData.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://citytourcabs.in').replace(/\/$/,'');
  const routes: MetadataRoute.Sitemap = ['', '/tours','/about','/privacy-policy'].map(path => ({url:`${baseUrl}${path}`}));
  const tourSlugs = new Set(Object.keys(tourPagesData));
  const updatedAt = new Map<string, string>();
  try {
    const payload = await getPayload({config});
    let page = 1;
    do {
      const batch = await payload.find({collection:'tours',page,limit:100,depth:0,overrideAccess:true});
      for (const tour of batch.docs) if (tour.slug) {
        tourSlugs.add(tour.slug);
        if (tour.updatedAt) updatedAt.set(tour.slug,tour.updatedAt);
      }
      if (!batch.hasNextPage) break;
      page++;
    } while (page < 100);
  } catch (err) {console.warn('[Sitemap] CMS unavailable; using static tour slugs');}
  return [...routes,...[...tourSlugs].map(slug => ({
    url:`${baseUrl}/tours/${encodeURIComponent(slug)}`,
    ...(updatedAt.has(slug) ? {lastModified:new Date(updatedAt.get(slug)!)} : {}),
  }))];
}
