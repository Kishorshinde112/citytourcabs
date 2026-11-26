import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { CACHE_TAGS } from '@/cms/hooks/revalidate';

const fetchCachedPageBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      });
      return result.docs[0] || null;
    } catch (error) {
      console.warn(`[CMS] Unable to load page "${slug}"; using static fallback.`, error);
      return null;
    }
  },
  ['cms-page-by-slug'],
  { revalidate: 300, tags: [CACHE_TAGS.pages] }
);

/**
 * Read a CMS page by slug for server components.
 * Cached across requests with tag-based revalidation; builds without a database fall back cleanly.
 */
export const getPageBySlug = cache(async (slug: string) => fetchCachedPageBySlug(slug));
