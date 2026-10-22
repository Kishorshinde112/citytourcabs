import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@/payload.config';

/**
 * Read a CMS page by slug for server components.
 * Builds without a database fall back to the existing static content.
 */
export const getPageBySlug = cache(async (slug: string) => {
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
});
