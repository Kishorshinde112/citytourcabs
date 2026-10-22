import { NextResponse, type NextRequest } from 'next/server';
import { findCmsRedirect, type CmsRedirect } from '@/lib/redirects';

const CACHE_TTL_MS = 30_000;
let cacheExpiresAt = 0;
let cachedRedirects: CmsRedirect[] = [];

async function getCmsRedirects(request: NextRequest): Promise<CmsRedirect[]> {
  if (Date.now() < cacheExpiresAt) return cachedRedirects;

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    timer = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(
      new URL('/api/redirects?limit=200&depth=0', request.nextUrl.origin),
      {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      }
    );

    if (!response.ok) throw new Error(`Redirects API returned ${response.status}`);

    const data = await response.json();
    cachedRedirects = Array.isArray(data?.docs) ? data.docs : [];
  } catch {
    // Keep serving the site when the CMS is unavailable; next.config.mjs
    // redirects remain the built-in fallback.
  } finally {
    if (timer) clearTimeout(timer);
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  }

  return cachedRedirects;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const redirects = await getCmsRedirects(request);
  const match = findCmsRedirect(pathname, redirects);

  if (!match?.destination) return NextResponse.next();

  const target = new URL(match.destination, request.url);
  if (!target.search) target.search = search;

  return NextResponse.redirect(target, match.permanent === false ? 307 : 308);
}

export const config = {
  matcher: [
    '/((?!api|admin|_next/static|_next/image|favicon.ico|media|assets|.*\\..*).*)',
  ],
};
