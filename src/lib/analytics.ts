// Unified Analytics & Google Ads Tracking for City Tour Cabs
// GA4: G-E6E794WM68 | Google Ads: AW-18526387794

export const GA4_MEASUREMENT_ID = 'G-E6E794WM68';
export const GADS_TAG_ID = 'AW-18526387794';

// Optional custom conversion label from environment variable if defined in Google Ads
export const GADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL || '';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a successful lead enquiry across both Google Ads and Google Analytics 4.
 * Includes multiple layers of deduplication:
 * 1. Client-side sessionStorage latch (prevents page reloads from double-counting).
 * 2. transaction_id parameter (enables Google Ads and GA4 to deduplicate server-side).
 */
export function trackLeadEnquiry(enquiryId: string, tourName?: string) {
  if (typeof window === 'undefined') return;

  const cleanId = (enquiryId || '').trim();
  if (!cleanId) return;

  // Deduplication Latch: Check if this specific inquiry reference was already tracked in this session
  const storageKey = `google_lead_tracked_${cleanId}`;
  try {
    if (sessionStorage.getItem(storageKey)) {
      return; // Already tracked, do not fire duplicate event
    }
    sessionStorage.setItem(storageKey, 'true');
  } catch {
    // ignore sessionStorage errors if cookies/storage are disabled
  }

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  // Safe gtag dispatch helper
  const sendGtag = (...args: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag(...args);
    } else {
      window.dataLayer.push(arguments);
    }
  };

  const gadsSendTo = GADS_CONVERSION_LABEL
    ? `${GADS_TAG_ID}/${GADS_CONVERSION_LABEL}`
    : GADS_TAG_ID;

  // 1. Google Ads Conversion Event with transaction_id deduplication
  sendGtag('event', 'conversion', {
    send_to: gadsSendTo,
    transaction_id: cleanId,
    value: 1.0,
    currency: 'INR',
  });

  // 2. Google Analytics 4 Recommended 'generate_lead' Event
  sendGtag('event', 'generate_lead', {
    transaction_id: cleanId,
    value: 1.0,
    currency: 'INR',
    lead_type: 'Tour Enquiry',
    tour_name: tourName || 'Tour Enquiry',
  });
}
