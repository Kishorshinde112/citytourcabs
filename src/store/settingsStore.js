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
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          set({
            siteName: data.settings.siteName || DEFAULT_SETTINGS.siteName,
            logoUrl: data.settings.logoUrl || DEFAULT_SETTINGS.logoUrl,
            phone: data.settings.phone || DEFAULT_SETTINGS.phone,
            helpPhone: data.settings.helpPhone || DEFAULT_SETTINGS.helpPhone,
            email: data.settings.email || DEFAULT_SETTINGS.email,
            whatsapp: data.settings.whatsapp || DEFAULT_SETTINGS.whatsapp,
            officeAddress: data.settings.officeAddress || DEFAULT_SETTINGS.officeAddress,
            workingHours: data.settings.workingHours || DEFAULT_SETTINGS.workingHours,
            announcement: data.settings.announcement || DEFAULT_SETTINGS.announcement,
            promoPopup: data.settings.promoPopup || DEFAULT_SETTINGS.promoPopup,
            footer: data.settings.footer || DEFAULT_SETTINGS.footer,
            chatbotWebhookUrl: data.settings.chatbotWebhookUrl || DEFAULT_SETTINGS.chatbotWebhookUrl,
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
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          get().fetchSettings();
        }
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
