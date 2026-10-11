import { create } from 'zustand';

export const DEFAULT_SETTINGS = {
  siteName: 'City Tour Cabs',
  logoUrl: '/assets/citytourcabs-logo.png',
  phone: '7021001921',
  helpPhone: '9967672660',
  email: 'citytourcabs8@gmail.com',
  whatsapp: '917021001921',
  officeAddress: 'Shop No 4, Chembur West, Mumbai, Maharashtra 400071',
  workingHours: '24/7 Available (Open All 365 Days)',
  announcement: {
    enabled: true,
    text: 'Available 24/7 for your convenience',
  },
  promoPopup: {
    enabled: true,
    delaySeconds: 5,
    headline: 'Special Tour Offer!',
    subtext: 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.',
    discountBadge: 'FLAT 15% OFF',
    couponCode: 'CITY15',
  },
  footer: {
    bio: 'City Tour Cabs is Mumbai\'s trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.',
    copyright: '© 2026 City Tour Cabs. All rights reserved.',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
  },
  chatbotWebhookUrl: 'https://n8n.kishorlab.dev/webhook-test/4d6e3906-3c0c-4c18-bef2-cf30563485c0',
};

const useSettingsStore = create((set, get) => ({
  ...DEFAULT_SETTINGS,
  loading: false,

  fetchSettings: async () => {
    try {
      const res = await fetch('/api/globals/site-settings');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.phone || data.businessName || data.siteName)) {
          set({
            siteName: data.businessName || data.siteName || DEFAULT_SETTINGS.siteName,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            helpPhone: data.helpPhone || DEFAULT_SETTINGS.helpPhone,
            email: data.email || DEFAULT_SETTINGS.email,
            whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
            officeAddress: data.officeAddress || DEFAULT_SETTINGS.officeAddress,
            workingHours: data.workingHours || DEFAULT_SETTINGS.workingHours,
            announcement: data.announcement || DEFAULT_SETTINGS.announcement,
            promoPopup: data.promoPopup || DEFAULT_SETTINGS.promoPopup,
            footer: data.footer || DEFAULT_SETTINGS.footer,
            chatbotWebhookUrl: data.chatbotWebhookUrl || DEFAULT_SETTINGS.chatbotWebhookUrl,
          });
        }
      }
    } catch (err) {
      console.warn('Using default settings (offline fallback):', err);
    }
  },

  updateSettings: async (newSettings) => {
    set((state) => ({ ...state, ...newSettings }));
    try {
      const res = await fetch('/api/globals/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        get().fetchSettings();
      }
    } catch (err) {
      console.error('Failed to sync settings with server:', err);
    }
  },
}));

if (typeof window !== 'undefined') {
  useSettingsStore.getState().fetchSettings();
}

export default useSettingsStore;
