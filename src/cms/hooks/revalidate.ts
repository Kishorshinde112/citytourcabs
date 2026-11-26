import { revalidatePath, revalidateTag } from 'next/cache';

export const CACHE_TAGS = {
  pages: 'cms-pages',
  tours: 'cms-tours',
  fleet: 'cms-fleet',
  testimonials: 'cms-testimonials',
  faqs: 'cms-faqs',
  settings: 'cms-settings',
  navigation: 'cms-navigation',
  footer: 'cms-footer',
  redirects: 'cms-redirects',
  sitemap: 'cms-sitemap',
} as const;

export function triggerRevalidation(slug?: string, tags: string[] = []) {
  try {
    for (const tag of tags) {
      if (tag) {
        revalidateTag(tag);
      }
    }

    revalidatePath('/', 'page');
    revalidatePath('/tours', 'page');
    revalidatePath('/fleet', 'page');
    revalidatePath('/about', 'page');
    revalidatePath('/contact', 'page');
    revalidatePath('/privacy-policy', 'page');
    revalidatePath('/llms.txt', 'page');

    if (
      tags.includes(CACHE_TAGS.settings) ||
      tags.includes(CACHE_TAGS.navigation) ||
      tags.includes(CACHE_TAGS.footer)
    ) {
      revalidatePath('/', 'layout');
    }

    if (slug) {
      revalidatePath(`/${slug}`, 'page');
      revalidatePath(`/tours/${slug}`, 'page');
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[revalidate] Cache revalidation skipped outside request lifecycle:', err);
    }
  }
}
