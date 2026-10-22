'use client';

import { useEffect, useState } from 'react';

export const DEFAULT_TOUR_LINKS = [
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

/**
 * Single reader for CMS tour navigation links.
 * Payload REST returns { docs }, not the legacy { success, tours } shape.
 */
export default function useTourLinks() {
  const [links, setLinks] = useState(DEFAULT_TOUR_LINKS);

  useEffect(() => {
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
          .filter((tour) => tour?.slug && tour?.title)
          .map((tour) => ({ name: tour.title, href: `/tours/${tour.slug}` }));
        if (mounted && mapped.length > 0) setLinks(mapped);
      } catch (err) {
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
  }, []);

  return links;
}
