'use client';

import { useEffect, useState } from 'react';

export interface TourLinkItem {
  name: string;
  href: string;
}

export const DEFAULT_TOUR_LINKS: TourLinkItem[] = [
  { name: 'Mumbai Darshan', href: '/tours/mumbai-darshan' },
  { name: 'Lonavala Trip', href: '/tours/lonavala-trip' },
  { name: 'Alibaug Sightseeing', href: '/tours/alibaug-sightseeing' },
  { name: 'Matheran Sightseeing', href: '/tours/matheran-sightseeing' },
  { name: 'Shirdi Tour', href: '/tours/shirdi-tour' },
  { name: 'Mahabaleshwar Sightseeing', href: '/tours/mahabaleshwar-sightseeing' },
  { name: 'Igatpuri Tour', href: '/tours/igatpuri-tour' },
  { name: 'Ashtavinayak', href: '/tours/ashtavinayak' },
  { name: '3 Jyotirlinga in Maharashtra', href: '/tours/3-jyotirlinga-in-maharashtra' },
  { name: 'Konkan Darshan', href: '/tours/konkan-darshan' },
];

export default function useTourLinks(initialLinks?: TourLinkItem[] | null): TourLinkItem[] {
  const hasInitial = Array.isArray(initialLinks) && initialLinks.length > 0;
  const [links, setLinks] = useState<TourLinkItem[]>(
    hasInitial ? initialLinks : DEFAULT_TOUR_LINKS
  );

  useEffect(() => {
    if (hasInitial) {
      setLinks(initialLinks);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    async function loadTours() {
      try {
        const res = await fetch('/api/tours?limit=100&depth=0&sort=displayOrder', {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const docs = Array.isArray(data.docs)
          ? data.docs
          : Array.isArray(data.tours)
            ? data.tours
            : [];
        const mapped = docs
          .filter((tour: any) => tour?.slug && tour?.title)
          .map((tour: any) => ({ name: tour.title, href: `/tours/${tour.slug}` }));
        if (mounted && mapped.length > 0) setLinks(mapped);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Error fetching navbar/footer tours:', err);
        }
      }
    }

    loadTours();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [hasInitial, initialLinks]);

  return links;
}
