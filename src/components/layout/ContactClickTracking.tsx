'use client';

import { useEffect } from 'react';
import { isAnalyticsHostAllowed, GADS_TAG_ID, GADS_PHONE_CONVERSION_LABEL, GADS_WHATSAPP_CONVERSION_LABEL } from '@/lib/analytics';

type ContactEvent = 'phone_click' | 'whatsapp_click';
type DebugStatus =
  | 'data_layer_push_started'
  | 'gtm_callback_observed'
  | 'gtm_callback_not_observed'
  | 'data_layer_push_failed';

const DEBUG_STORAGE_KEY = 'ctc_last_contact_click';

function getContactEvent(url: URL): ContactEvent | null {
  if (url.protocol === 'tel:') return 'phone_click';

  if (url.protocol === 'whatsapp:' && url.hostname === 'send') {
    return 'whatsapp_click';
  }

  if (url.protocol !== 'https:') return null;

  const host = url.hostname.toLowerCase();
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (host === 'wa.me' || host === 'www.wa.me') {
    return 'whatsapp_click';
  }

  if (
    (host === 'api.whatsapp.com' ||
      host === 'web.whatsapp.com' ||
      host === 'www.whatsapp.com') &&
    path === '/send'
  ) {
    return 'whatsapp_click';
  }

  return null;
}

export default function ContactClickTracking() {
  useEffect(() => {
    if (!isAnalyticsHostAllowed()) return;

    // Capture gclid from URL params and persist in sessionStorage
    try {
      const params = new URLSearchParams(window.location.search);
      const urlGclid = params.get('gclid');
      if (urlGclid && urlGclid.trim()) {
        sessionStorage.setItem('ctc_gclid', urlGclid.trim());
      }
    } catch {
      // Storage might be disabled
    }


    let lastClickKey = '';
    let lastClickAt = 0;

    function onContactClick(click: MouseEvent) {
      // Avoid counting script-generated clicks. Real taps and keyboard
      // activation of links still trigger trusted click events.
      if (!click.isTrusted || click.button !== 0) return;

      const target = click.target;
      const element =
        target instanceof Element
          ? target
          : target instanceof Node
            ? target.parentElement
            : null;

      const link = element?.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      const event = getContactEvent(url);
      if (!event) return;

      // One user gesture can cause overlapping click handlers. Ignore
      // immediate repeats, but allow genuine subsequent interactions.
      const now = Date.now();
      const clickKey = `${event}:${url.href}`;
      if (clickKey === lastClickKey && now - lastClickAt < 600) return;
      lastClickKey = clickKey;
      lastClickAt = now;

      const page = window.location.pathname.replace(/\/+$/, '') || '/';
      const contactContext =
        page === '/booking-confirmed' || page === '/enquiry-confirmed'
          ? 'confirmation'
          : 'marketing';
      const eventId = `ctc-${now}-${Math.random().toString(36).slice(2, 10)}`;
      const debug = new URLSearchParams(window.location.search).has(
        'tracking_debug'
      );

      function report(status: DebugStatus) {
        if (!debug) return;

        // Never store the dialed phone number or WhatsApp recipient.
        const diagnostic = {
          event,
          event_id: eventId,
          contact_context: contactContext,
          page,
          status,
          timestamp: new Date().toISOString(),
        };

        try {
          window.sessionStorage.setItem(
            DEBUG_STORAGE_KEY,
            JSON.stringify(diagnostic)
          );
        } catch {
          // Browser storage can be disabled.
        }

        console.info('[CityTourCabs tracking]', diagnostic);
      }

      // Keep existing GTM event names and contact_context unchanged.
      // GTM is responsible for firing the Google Ads conversion tags.
      const payload: Record<string, unknown> = {
        event,
        contact_context: contactContext,
        contact_event_id: eventId,
        contact_page: page,
        contact_source: 'website_click',
      };

      if (debug) {
        let callbackObserved = false;

        // GTM may invoke eventCallback after processing OR eventTimeout.
        // This is NOT proof that Google Ads received/attributed a conversion.
        payload.eventCallback = () => {
          callbackObserved = true;
          report('gtm_callback_observed');
        };
        payload.eventTimeout = 2000;

        window.setTimeout(() => {
          if (!callbackObserved) report('gtm_callback_not_observed');
        }, 3000);
      }

      try {
        // Direct Google Ads Conversion Event dispatch (in addition to GTM dataLayer)
        if (typeof window.gtag === 'function') {
          const sendTo =
            event === 'phone_click'
              ? `${GADS_TAG_ID}/${GADS_PHONE_CONVERSION_LABEL}`
              : `${GADS_TAG_ID}/${GADS_WHATSAPP_CONVERSION_LABEL}`;

          window.gtag('event', 'conversion', {
            send_to: sendTo,
            value: 1.0,
            currency: 'INR',
          });
        }
      } catch (e) {
        // Safe fallthrough
      }

            // Also report offline conversion to server if gclid was present
      try {
        const storedGclid = window.sessionStorage.getItem('ctc_gclid');
        if (storedGclid) {
          fetch('/api/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gclid: storedGclid,
              conversionName: event === 'phone_click' ? 'Phone Click' : 'WhatsApp Click',
              value: 1.0,
              currency: 'INR',
              time: new Date().toISOString(),
            }),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Fallthrough
      }

      try {
        window.dataLayer ??= [];
        report('data_layer_push_started');
        window.dataLayer.push(payload);
      } catch {
        report('data_layer_push_failed');
      }
    }

    // Capture phase also sees clicks whose propagation is stopped later.
    document.addEventListener('click', onContactClick, true);
    return () => document.removeEventListener('click', onContactClick, true);
  }, []);

  return null;
}