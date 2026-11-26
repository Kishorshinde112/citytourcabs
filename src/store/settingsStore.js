'use client';

import React, { createContext, useContext } from 'react';
import { create } from 'zustand';

export const DEFAULT_SETTINGS = {
  siteName: 'City Tour Cabs',
  logoUrl: 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351891/citytourcabs/assets/citytourcabs-logo.png',
  phone: '7021001921',
  helpPhone: '9967672660',
  email: 'citytourcabs1@gmail.com',
  whatsapp: '917021001921',
  officeAddress: 'Office No 1102 P2 Kanjurmarg east, Mumbai 400042',
  workingHours: '24/7 Available (Open All 365 Days)',
  announcement: {
    enabled: true,
    text: 'Available 24/7 for your convenience',
  },
  promoPopup: {
    enabled: true,
    delaySeconds: 7,
    headline: 'Special Tour Offer!',
    subtext: 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.',
    discountBadge: 'FLAT 15% OFF',
    couponCode: 'CITY15',
  },
  footer: {
    bio: "City Tour Cabs is Mumbai's trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.",
    copyright: '© 2026 City Tour Cabs. All rights reserved.',
    facebookUrl: '',
    instagramUrl: '',
  },
};

export function normalizeSiteSettings(data) {
  if (!data || typeof data !== 'object') return DEFAULT_SETTINGS;
  const logoUrl =
    data.logoUrl ||
    (typeof data.logo === 'string' ? data.logo : data.logo?.url);

  return {
    siteName: data.businessName || data.siteName || DEFAULT_SETTINGS.siteName,
    logoUrl: logoUrl || DEFAULT_SETTINGS.logoUrl,
    phone: data.phone || DEFAULT_SETTINGS.phone,
    helpPhone: data.helpPhone || data.supportPhone || DEFAULT_SETTINGS.helpPhone,
    email: data.email || data.supportEmail || DEFAULT_SETTINGS.email,
    whatsapp: data.whatsapp || data.whatsappNumber || DEFAULT_SETTINGS.whatsapp,
    officeAddress: data.officeAddress || DEFAULT_SETTINGS.officeAddress,
    workingHours: data.workingHours || DEFAULT_SETTINGS.workingHours,
    announcement: data.announcement || DEFAULT_SETTINGS.announcement,
    promoPopup: {
      ...DEFAULT_SETTINGS.promoPopup,
      ...(data.promoPopup || {}),
    },
    footer: {
      ...DEFAULT_SETTINGS.footer,
      ...(data.footer || {}),
    },
  };
}

export const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ settings = null, children }) {
  const value = React.useMemo(
    () => (settings ? normalizeSiteSettings(settings) : null),
    [settings]
  );
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

const useSettingsStore = create((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,
  loading: false,

  hydrateSettings: (data) => {
    if (!data || typeof data !== 'object') return;
    set({
      ...normalizeSiteSettings(data),
      hydrated: true,
    });
  },

  fetchSettings: async () => {
    if (get().hydrated || get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch('/api/globals/site-settings');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.phone || data.businessName || data.siteName || data.logo || data.logoUrl)) {
          set({
            ...normalizeSiteSettings(data),
            hydrated: true,
            loading: false,
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Using default settings (offline fallback):', err);
    }
    set({ loading: false });
  },
}));

/**
 * Reads SSR-provided settings from SiteSettingsContext when inside SiteShell,
 * falling back to the Zustand store on standalone routes (e.g., booking-confirmed).
 */
export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  const store = useSettingsStore();
  return ctx || store;
}

export default useSettingsStore;
