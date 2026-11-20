// Unified Analytics & Google Ads Tracking for City Tour Cabs
// GA4: G-E6E794WM68 | Google Ads: AW-18526387794

export const GA4_MEASUREMENT_ID = 'G-E6E794WM68';
export const GADS_TAG_ID = 'AW-18526387794';

const CURRENT_GADS_CONVERSION_LABEL = '4HTzCLqMl6cdENL8iIJF';
const LEGACY_GADS_CONVERSION_LABEL = 'GQMOCJ-eoaMdENL8iIJF';

const configuredGadsConversionLabel =
  process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL?.trim();

// A stale deployment override must not reactivate the retired conversion action.
export const GADS_CONVERSION_LABEL =
  configuredGadsConversionLabel &&
  configuredGadsConversionLabel !== LEGACY_GADS_CONVERSION_LABEL
    ? configuredGadsConversionLabel
    : CURRENT_GADS_CONVERSION_LABEL;

const PRODUCTION_ANALYTICS_HOSTS = new Set([
  'citytourcabs.in',
  'www.citytourcabs.in',
]);

/** Only the production hostnames may load tags or emit conversion events. */
export function isAnalyticsHostAllowed(
  hostname = typeof window !== 'undefined' ? window.location.hostname : ''
) {
  const normalizedHost = hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, '');

  return PRODUCTION_ANALYTICS_HOSTS.has(normalizedHost);
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a successful lead enquiry for Google Analytics 4 and GTM.
 * Includes multiple layers of deduplication:
 * 1. Client-side sessionStorage latch (prevents page reloads from double-counting).
 * 2. transaction_id parameter (enables Google Ads and GA4 to deduplicate server-side).
 */
export function trackLeadEnquiry(enquiryId: string, tourName?: string) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsHostAllowed()) return;

  const cleanId = (enquiryId || '').trim();
  if (!cleanId) return;

  // Deduplication latch: check if this specific enquiry reference was already dispatched.
  const storageKey = `google_lead_tracked_${cleanId}`;
  try {
    if (sessionStorage.getItem(storageKey)) {
      return; // Already dispatched in this session.
    }
  } catch {
    // Ignore sessionStorage errors if cookies/storage are disabled.
  }

  const dataLayer: any[] = window.dataLayer || [];
  window.dataLayer = dataLayer;

  // Standard gtag command queue shape. gtag itself queues an arguments object.
  function sendGtag(...args: any[]) {
    if (typeof window.gtag === 'function') {
      window.gtag(...args);
    } else {
      dataLayer.push(arguments);
    }
  }

  try {
    // 1. Google Analytics 4 Recommended 'generate_lead' Event
    sendGtag('event', 'generate_lead', {
      transaction_id: cleanId,
      value: 1.0,
      currency: 'INR',
      lead_type: 'Tour Enquiry',
      tour_name: tourName || 'Tour Enquiry',
    });

    // 2. GTM-only signal for the Google Ads conversion tag.
    // Direct Google Ads conversion tracking was removed from this function.
    dataLayer.push({
      event: 'citytourcabs_enquiry_success_v2',
      transaction_id: cleanId,
    });
  } catch {
    return;
  }

  // Only latch after the GA4 command and GTM event were queued. This prevents
  // duplicate sends, but does not by itself prove Google Ads received the event.
  try {
    sessionStorage.setItem(storageKey, 'true');
  } catch {
    // Ignore sessionStorage errors if cookies/storage are disabled.
  }
}
