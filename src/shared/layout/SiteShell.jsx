'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import { BookingContext } from '@/components/booking/BookingContext';
import useSettingsStore, {
  SiteSettingsProvider,
  normalizeSiteSettings,
} from '@/store/settingsStore';

// Dynamic imports with ssr: false for heavy modals so their JS bundles are not loaded during initial mobile hydration
const QuickBookModal = dynamic(
  () => import('@/modules/bookings/components/QuickBookModal'),
  { ssr: false }
);
const PrivacyModal = dynamic(
  () => import('@/components/modals/PrivacyModal'),
  { ssr: false }
);
const AutoEnquiryModal = dynamic(
  () => import('@/modules/bookings/components/AutoEnquiryModal'),
  { ssr: false }
);

/**
 * Single owner of the marketing-site chrome and lead modals.
 * Every page under (site)/(marketing) renders content only.
 */
export default function SiteShell({
  children,
  siteSettings = null,
  navigation = null,
  footer = null,
  tourLinks = null,
}) {
  const pathname = usePathname();
  const hydrateSettings = useSettingsStore((state) => state.hydrateSettings);
  const storePromoPopup = useSettingsStore((state) => state.promoPopup);
  const resolvedSettings = siteSettings ? normalizeSiteSettings(siteSettings) : null;
  const promoPopup = resolvedSettings?.promoPopup || storePromoPopup;

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState({});
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);
  const [enquiryInitialData, setEnquiryInitialData] = useState({});

  const bookModalOpenRef = useRef(false);
  useEffect(() => {
    bookModalOpenRef.current = bookModalOpen;
  }, [bookModalOpen]);

  useEffect(() => {
    if (siteSettings) {
      hydrateSettings(siteSettings);
    } else {
      useSettingsStore.getState().fetchSettings();
    }
  }, [siteSettings, hydrateSettings]);

  const openBooking = useCallback((initialData = {}) => {
    setAutoEnquiryOpen(false);
    setBookModalInitialData(initialData);
    setBookModalOpen(true);
  }, []);

  const openEnquiry = useCallback((initialData = {}) => {
    setBookModalOpen(false);
    setEnquiryInitialData(initialData);
    setAutoEnquiryOpen(true);
  }, []);

  const openPrivacy = useCallback(() => setPrivacyModalOpen(true), []);

  // Timed discount enquiry modal. Legal pages should never interrupt the reader.
  const autoPopupEnabled = pathname !== '/privacy-policy' && promoPopup?.enabled !== false;
  const autoPopupDelay = Math.max(1, Number(promoPopup?.delaySeconds) || 7) * 1000;
  useEffect(() => {
    if (!autoPopupEnabled) return undefined;
    const timer = setTimeout(() => {
      if (!bookModalOpenRef.current) setAutoEnquiryOpen(true);
    }, autoPopupDelay);
    return () => clearTimeout(timer);
  }, [autoPopupEnabled, autoPopupDelay]);

  const initialDestinations = Array.isArray(tourLinks) && tourLinks.length > 0
    ? tourLinks.map((t) => t?.label).filter(Boolean)
    : null;

  return (
    <SiteSettingsProvider settings={siteSettings}>
      <BookingContext.Provider value={{ openBooking, openEnquiry, openPrivacy }}>
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#0F6EB8] selection:text-white pb-14 sm:pb-0">
          <Navbar
            onOpenBookModal={() => openBooking()}
            initialNavigation={navigation}
            initialTourLinks={tourLinks}
          />

          <main className="flex-1">{children}</main>

          <Footer
            onOpenPrivacyModal={openPrivacy}
            onOpenBookModal={() => openBooking()}
            initialFooter={footer}
            initialTourLinks={tourLinks}
          />

          <FloatingActions
            onOpenBookModal={() => openBooking()}
            onOpenEnquiryModal={() => openEnquiry()}
          />

          {bookModalOpen && (
            <QuickBookModal
              isOpen={bookModalOpen}
              onClose={() => setBookModalOpen(false)}
              initialData={bookModalInitialData}
              initialDestinations={initialDestinations}
            />
          )}

          {privacyModalOpen && (
            <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
          )}

          {autoEnquiryOpen && !bookModalOpen && (
            <AutoEnquiryModal
              isOpen={autoEnquiryOpen}
              onClose={() => setAutoEnquiryOpen(false)}
              initialData={enquiryInitialData}
              initialDestinations={initialDestinations}
            />
          )}
        </div>
      </BookingContext.Provider>
    </SiteSettingsProvider>
  );
}
