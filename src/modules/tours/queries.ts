import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { CACHE_TAGS } from '@/cms/hooks/revalidate';
import { TourPackage } from './types';
import { getFallbackTour, FALLBACK_TOURS_CATALOG } from './fallback';
import { defaultTourCards, TourCardItem } from './defaultTours';

const fetchCachedTourBySlug = unstable_cache(
  async (slug: string): Promise<TourPackage | null> => {
    const fallback = getFallbackTour(slug);

    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'tours',
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (res.docs.length > 0) {
        const doc = res.docs[0] as any;
        const detailsBlock =
          Array.isArray(doc.layout) && doc.layout.find((b: any) => b.blockType === 'tourDetails')
            ? doc.layout.find((b: any) => b.blockType === 'tourDetails')
            : doc.layout?.[0];

        return {
          id: doc.id || slug,
          slug: doc.slug || slug,
          title: doc.title || detailsBlock?.tourName || fallback?.title || slug,
          tagline: detailsBlock?.subtitle || doc.tagline || doc.description || fallback?.tagline || '',
          shortDescription: detailsBlock?.description || doc.description || fallback?.shortDescription || '',
          heroImage:
            doc.heroImageMedia?.url ||
            (typeof doc.heroImageMedia === 'object' && doc.heroImageMedia?.filename
              ? `/media/${doc.heroImageMedia.filename}`
              : detailsBlock?.heroImage || doc.heroImage || fallback?.heroImage),
          leftHtml: doc.itineraryHtml || fallback?.leftHtml || '',
          rightHtml: doc.rateTableHtml || fallback?.rightHtml || '',
          startingPrice: doc.starting_price || doc.startingPrice || fallback?.startingPrice || '₹2,300',
          rating: fallback?.rating || 4.9,
          reviewsCount: fallback?.reviewsCount || 340,
          seo: doc.seo || null,
        };
      }
    } catch (err) {
      console.warn(`[Tour Queries] Using static fallback for tour "${slug}":`, err instanceof Error ? err.message : err);
    }

    return fallback;
  },
  ['cms-tour-by-slug'],
  { revalidate: 300, tags: [CACHE_TAGS.tours] }
);

export const getTourBySlug = cache(async (slug: string) => fetchCachedTourBySlug(slug));

const fetchCachedAllTours = unstable_cache(
  async (): Promise<TourPackage[]> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'tours',
        limit: 100,
        depth: 0,
        sort: 'displayOrder',
      });

      if (res.docs.length > 0) {
        return res.docs.map((doc: any) => {
          const fallback = getFallbackTour(doc.slug);
          return {
            id: doc.id,
            slug: doc.slug,
            title: doc.title,
            tagline: doc.tagline || fallback?.tagline || '',
            shortDescription: doc.description || fallback?.shortDescription || '',
            startingPrice: doc.starting_price || doc.startingPrice || fallback?.startingPrice || '₹2,300',
            heroImage: doc.hero_image || fallback?.heroImage || '',
            rating: 4.9,
            reviewsCount: 340,
          };
        });
      }
    } catch {
      console.warn('[Tour Queries] Using fallback tour catalog');
    }

    return FALLBACK_TOURS_CATALOG.map((t: any) => ({
      id: t.id,
      slug: t.id,
      title: t.title,
      tagline: t.tagline,
      shortDescription: t.shortDescription,
      startingPrice: t.startingPrice,
      heroImage: t.banner,
      rating: t.rating,
      reviewsCount: t.reviewsCount,
    }));
  },
  ['cms-all-tours'],
  { revalidate: 300, tags: [CACHE_TAGS.tours] }
);

export const getAllTours = cache(async () => fetchCachedAllTours());

const fetchCachedTourCards = unstable_cache(
  async (): Promise<TourCardItem[]> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'tours',
        limit: 100,
        depth: 1,
        sort: 'displayOrder',
        overrideAccess: true,
      });

      if (res.docs && res.docs.length > 0) {
        const staticMap = new Map(defaultTourCards.map((t) => [t.id, t]));
        return res.docs.map((doc: any) => {
          const staticTour =
            staticMap.get(doc.slug) ||
            defaultTourCards.find((t) => t.id === doc.slug || t.href === `/${doc.slug}`) ||
            ({} as any);
          const details = Array.isArray(doc.layout)
            ? doc.layout.find((b: any) => b.blockType === 'tourDetails')
            : null;
          const cmsImage =
            typeof details?.heroImage === 'string' && !details.heroImage.includes('unsplash.com')
              ? details.heroImage
              : null;
          const finalImage =
            cmsImage ||
            (typeof doc.banner === 'string' ? doc.banner : null) ||
            staticTour.image ||
            'https://res.cloudinary.com/o0mbamog/image/upload/v1792351884/citytourcabs/assets/about-banner.jpg';

          return {
            id: doc.slug || staticTour.id,
            title: doc.title || staticTour.title,
            badge: details?.subtitle || doc.subtitle || staticTour.badge || '',
            description: details?.description || doc.shortDescription || staticTour.description || '',
            image: finalImage,
            href: `/tours/${doc.slug || staticTour.id}`,
          };
        });
      }
    } catch (err) {
      console.warn('[Tour Queries] Using default tour cards fallback for SSR:', err instanceof Error ? err.message : err);
    }

    return defaultTourCards;
  },
  ['cms-tour-cards'],
  { revalidate: 300, tags: [CACHE_TAGS.tours] }
);

export const getInitialTourCards = cache(async () => fetchCachedTourCards());

export const getTourLinks = cache(async () => {
  const cards = await getInitialTourCards();
  return cards
    .filter((tour) => tour?.title && tour?.href)
    .map((tour) => ({
      name: tour.title,
      href: tour.href,
    }));
});
