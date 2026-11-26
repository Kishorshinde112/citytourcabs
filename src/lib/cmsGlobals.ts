import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { CACHE_TAGS } from '@/cms/hooks/revalidate';
import { lexicalToHtml } from '@/lib/lexical';
import { findCmsRedirect } from '@/lib/redirects';

export interface PublicSiteSettings {
  businessName?: string;
  siteName?: string;
  phone?: string;
  helpPhone?: string;
  supportPhone?: string;
  email?: string;
  supportEmail?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  workingHours?: string;
  logoUrl?: string;
  announcement?: {
    enabled?: boolean;
    text?: string;
  };
  promoPopup?: {
    enabled?: boolean;
    delaySeconds?: number;
    headline?: string;
    subtext?: string;
    discountBadge?: string;
    couponCode?: string;
  };
  footer?: {
    bio?: string;
    copyright?: string;
    facebookUrl?: string;
    instagramUrl?: string;
  };
}

export interface CmsTestimonial {
  id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answerHtml: string;
}

export const DEFAULT_TESTIMONIALS: CmsTestimonial[] = [
  {
    name: 'Rajesh Sharma',
    location: 'Mumbai',
    rating: 5,
    text: "Excellent service! The driver was not only professional but also acted as a great guide. He showed us all the hidden gems of Mumbai that we wouldn't have found on our own.",
  },
  {
    name: 'Priya Patel',
    location: 'Pune',
    rating: 5,
    text: "Our trip to Lonavala was amazing thanks to CityTourCabs. The cab was clean, comfortable, and the driver's knowledge of the area made our journey memorable.",
  },
  {
    name: 'Amit Desai',
    location: 'Thane',
    rating: 5,
    text: 'Highly recommend for Shirdi trips! Punctual, courteous driver who made sure we had a comfortable and spiritual journey. Will definitely book again.',
  },
];

function sanitizeSiteSettings(raw: any): PublicSiteSettings | null {
  if (!raw || typeof raw !== 'object') return null;
  // Explicitly strip admin-only webhook & notification fields before passing to RSC/client
  const {
    chatbotWebhookUrl: _chatbotWebhookUrl,
    notificationsEnabled: _notificationsEnabled,
    bookingWebhookUrl: _bookingWebhookUrl,
    enquiryWebhookUrl: _enquiryWebhookUrl,
    logo,
    ...rest
  } = raw;

  const logoUrl =
    typeof logo === 'string'
      ? logo
      : logo && typeof logo === 'object' && logo.url
        ? String(logo.url)
        : undefined;

  return {
    ...rest,
    ...(logoUrl ? { logoUrl } : {}),
  };
}

const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
  businessName: 'City Tour Cabs',
  siteName: 'City Tour Cabs',
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

const DEFAULT_PUBLIC_NAVIGATION = {
  links: [
    { label: 'Home', url: '/' },
    { label: 'Tour Packages', url: '/tours' },
    { label: 'Our Fleet', url: '/fleet' },
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ],
};

const DEFAULT_PUBLIC_FOOTER = {
  groups: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Tour Packages', url: '/tours' },
        { label: 'Our Fleet', url: '/fleet' },
        { label: 'Contact Us', url: '/contact' },
      ],
    },
  ],
};

const fetchCachedSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    const payload = await getPayload({ config });
    const data = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      overrideAccess: true,
    });
    const sanitized = sanitizeSiteSettings(data);
    if (!sanitized) throw new Error('Empty site-settings global');
    return sanitized;
  },
  ['cms-site-settings'],
  { revalidate: 300, tags: [CACHE_TAGS.settings] }
);

export const getSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  try {
    return await fetchCachedSiteSettings();
  } catch (error) {
    console.warn('[CMS] Unable to load site-settings:', error instanceof Error ? error.message : error);
    return DEFAULT_PUBLIC_SITE_SETTINGS;
  }
});

const fetchCachedNavigation = unstable_cache(
  async (): Promise<any> => {
    const payload = await getPayload({ config });
    const nav = await payload.findGlobal({
      slug: 'navigation',
      depth: 1,
      overrideAccess: true,
    });
    if (!nav || typeof nav !== 'object') throw new Error('Empty navigation global');
    return nav;
  },
  ['cms-navigation'],
  { revalidate: 300, tags: [CACHE_TAGS.navigation] }
);

export const getNavigation = cache(async () => {
  try {
    return await fetchCachedNavigation();
  } catch (error) {
    console.warn('[CMS] Unable to load navigation:', error instanceof Error ? error.message : error);
    return DEFAULT_PUBLIC_NAVIGATION;
  }
});

const fetchCachedFooter = unstable_cache(
  async (): Promise<any> => {
    const payload = await getPayload({ config });
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 1,
      overrideAccess: true,
    });
    if (!footer || typeof footer !== 'object') throw new Error('Empty footer global');
    return footer;
  },
  ['cms-footer'],
  { revalidate: 300, tags: [CACHE_TAGS.footer] }
);

export const getFooter = cache(async () => {
  try {
    return await fetchCachedFooter();
  } catch (error) {
    console.warn('[CMS] Unable to load footer:', error instanceof Error ? error.message : error);
    return DEFAULT_PUBLIC_FOOTER;
  }
});

const fetchCachedTestimonials = unstable_cache(
  async (): Promise<CmsTestimonial[]> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'testimonials',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      });
      if (Array.isArray(res.docs) && res.docs.length > 0) {
        return res.docs.map((item: any) => ({
          id: item.id ? String(item.id) : undefined,
          name: item.name || 'Happy Traveller',
          location: item.location || '',
          text: item.text || item.comment || '',
          rating: Number(item.rating) || 5,
        }));
      }
    } catch (error) {
      console.warn('[CMS] Unable to load testimonials:', error instanceof Error ? error.message : error);
    }
    return DEFAULT_TESTIMONIALS;
  },
  ['cms-testimonials'],
  { revalidate: 300, tags: [CACHE_TAGS.testimonials] }
);

export const getTestimonials = cache(async () => fetchCachedTestimonials());

const fetchCachedFaqs = unstable_cache(
  async (): Promise<CmsFaqItem[]> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'faqs',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      });
      if (Array.isArray(res.docs) && res.docs.length > 0) {
        return res.docs
          .filter((faq: any) => faq?.question && faq?.answer)
          .map((faq: any, index: number) => ({
            id: String(faq.id || index),
            question: String(faq.question),
            answerHtml: lexicalToHtml(faq.answer),
          }))
          .filter((faq) => faq.answerHtml.length > 0);
      }
    } catch (error) {
      console.warn('[CMS] Unable to load FAQs:', error instanceof Error ? error.message : error);
    }
    return [];
  },
  ['cms-faqs'],
  { revalidate: 300, tags: [CACHE_TAGS.faqs] }
);

export const getFaqs = cache(async () => fetchCachedFaqs());

const fetchCachedRedirects = unstable_cache(
  async (): Promise<any[]> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'redirects',
        limit: 500,
        depth: 0,
        overrideAccess: true,
      });
      return Array.isArray(res.docs) ? res.docs : [];
    } catch (error) {
      console.warn('[CMS] Unable to load redirects:', error instanceof Error ? error.message : error);
      return [];
    }
  },
  ['cms-redirects'],
  { revalidate: 300, tags: [CACHE_TAGS.redirects] }
);

export const getRedirects = cache(async () => fetchCachedRedirects());

export async function resolveCmsRedirect(pathname: string) {
  const redirects = await getRedirects();
  return findCmsRedirect(pathname, redirects);
}
