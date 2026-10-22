import { create } from 'zustand';

export const DEFAULT_SETTINGS = {
  siteName: 'City Tour Cabs',
  logoUrl: "https://res.cloudinary.com/o0mbamog/image/upload/v1792351891/citytourcabs/assets/citytourcabs-logo.png",
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
    facebookUrl: '',
    instagramUrl: '',
  },
};

const useSettingsStore = create((set) => ({
  ...DEFAULT_SETTINGS,
  loading: false,

  fetchSettings: async () => {
    try {
      const res = await fetch('/api/globals/site-settings');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.phone || data.businessName || data.siteName || data.logo)) {
          const logoUrl = typeof data.logo === 'string' ? data.logo : data.logo?.url;
          set({
            siteName: data.businessName || data.siteName || DEFAULT_SETTINGS.siteName,
            logoUrl: logoUrl || DEFAULT_SETTINGS.logoUrl,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            helpPhone: data.helpPhone || DEFAULT_SETTINGS.helpPhone,
            email: data.email || DEFAULT_SETTINGS.email,
            whatsapp: data.whatsapp || data.whatsappNumber || DEFAULT_SETTINGS.whatsapp,
            officeAddress: data.officeAddress || DEFAULT_SETTINGS.officeAddress,
            workingHours: data.workingHours || DEFAULT_SETTINGS.workingHours,
            announcement: data.announcement || DEFAULT_SETTINGS.announcement,
            promoPopup: data.promoPopup || DEFAULT_SETTINGS.promoPopup,
            footer: data.footer || DEFAULT_SETTINGS.footer,
          });
        }
      }
    } catch (err) {
      console.warn('Using default settings (offline fallback):', err);
    }
  },

}));

if (typeof window !== 'undefined') {
  useSettingsStore.getState().fetchSettings();
}

export default useSettingsStore;
