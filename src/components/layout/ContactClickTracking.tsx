'use client';

import { useEffect } from 'react';
import { isAnalyticsHostAllowed } from '@/lib/analytics';

export default function ContactClickTracking() {
  useEffect(() => {
    if (!isAnalyticsHostAllowed()) return;

    function trackContactClick(click: MouseEvent) {
      if (!click.isTrusted || click.defaultPrevented || click.button !== 0) return;
      if (!(click.target instanceof Element)) return;

      const link = click.target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const isPhone = link.protocol === 'tel:';
      const isWhatsApp = link.protocol === 'https:' && link.hostname === 'wa.me';
      if (!isPhone && !isWhatsApp) return;

      const path = window.location.pathname.replace(/\/$/, '');
      const onConfirmation = path === '/booking-confirmed' || path === '/enquiry-confirmed';

      window.dataLayer ??= [];
      window.dataLayer.push({
        event: isPhone ? 'phone_click' : 'whatsapp_click',
        contact_context: onConfirmation ? 'confirmation' : 'marketing',
      });
    }

    document.addEventListener('click', trackContactClick);
    return () => document.removeEventListener('click', trackContactClick);
  }, []);

  return null;
}
