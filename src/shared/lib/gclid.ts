import { GCLID_STORAGE_KEY, sanitizeGclid } from '@/lib/gclid.mjs';

export { GCLID_STORAGE_KEY, sanitizeGclid };

export function captureGclidFromUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const urlGclid = sanitizeGclid(
      new URLSearchParams(window.location.search).get('gclid')
    );
    if (urlGclid) {
      window.sessionStorage.setItem(GCLID_STORAGE_KEY, urlGclid);
      return urlGclid;
    }
  } catch {
    // Ignore storage/URL errors when cookies or sessionStorage are restricted.
  }
  return '';
}

export function getStoredGclid(): string {
  if (typeof window === 'undefined') return '';
  const fromUrl = captureGclidFromUrl();
  if (fromUrl) return fromUrl;
  try {
    return sanitizeGclid(window.sessionStorage.getItem(GCLID_STORAGE_KEY));
  } catch {
    return '';
  }
}
