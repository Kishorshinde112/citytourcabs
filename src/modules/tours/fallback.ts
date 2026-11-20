import tourPagesJson from '@/data/tourPagesData.json';
import { TOURS_DATA } from '@/data/toursData';
import { TourPackage } from './types';

export const FALLBACK_TOURS_CATALOG = TOURS_DATA;
export const FALLBACK_TOUR_PAGES: Record<string, any> = tourPagesJson;

export function getFallbackTour(slug: string): TourPackage | null {
  const matchJson = FALLBACK_TOUR_PAGES[slug];
  const matchCatalog = TOURS_DATA.find((t: any) => t.id === slug);

  if (!matchJson && !matchCatalog) return null;

  return {
    id: slug,
    slug,
    title: matchJson?.title || matchCatalog?.title || slug,
    tagline: matchJson?.subtitle || matchCatalog?.tagline || '',
    shortDescription: matchCatalog?.shortDescription || matchJson?.subtitle || '',
    heroImage:
      matchJson?.heroImage ||
      matchCatalog?.banner ||
      'https://res.cloudinary.com/o0mbamog/image/upload/v1792351884/citytourcabs/assets/about-banner.jpg',
    leftHtml: matchJson?.leftHtml || '',
    rightHtml: matchJson?.rightHtml || '',
    startingPrice: matchCatalog?.startingPrice || '₹2,300',
    rating: matchCatalog?.rating || 4.9,
    reviewsCount: matchCatalog?.reviewsCount || 340,
    rules: matchCatalog?.rules || [],
    inclusions: matchCatalog?.inclusions || [],
    exclusions: matchCatalog?.exclusions || [],
  };
}
