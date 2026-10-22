'use client';

import { useEffect, useState } from 'react';

/**
 * Lightweight reader for public Payload globals (navigation, footer, ...).
 * The server-provided fallback stays visible if the CMS is unreachable.
 */
export default function useCmsGlobal(slug, fallback = null) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
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
      } catch (err) {
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
  }, [slug]);

  return data;
}
