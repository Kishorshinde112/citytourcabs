'use client';

import { useEffect, useState } from 'react';

/**
 * Lightweight reader for public Payload globals (navigation, footer, ...).
 * Skips client fetching when SSR initialData was provided.
 */
export default function useCmsGlobal<T = any>(
  slug: string,
  fallback: T = null as any,
  initialData?: T | null
): T {
  const hasInitial = initialData !== undefined && initialData !== null;
  const [data, setData] = useState<T>(hasInitial ? initialData : fallback);

  useEffect(() => {
    if (hasInitial) {
      setData(initialData);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(`/api/globals/${slug}?depth=1`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const next = await res.json();
        if (mounted && next) setData(next);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn(`Using fallback for CMS global "${slug}"`, err);
        }
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [slug, hasInitial, initialData]);

  return data;
}
