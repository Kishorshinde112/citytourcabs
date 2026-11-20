import { getPayload } from 'payload';
import config from '@/payload.config';
import { TourPackage } from './types';
import { getFallbackTour, FALLBACK_TOURS_CATALOG } from './fallback';

export async function getTourBySlug(slug: string): Promise<TourPackage | null> {
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
}

export async function getAllTours(): Promise<TourPackage[]> {
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
  } catch (err) {
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
}
