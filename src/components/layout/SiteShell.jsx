'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import QuickBookModal from '../modals/QuickBookModal';
import PrivacyModal from '../modals/PrivacyModal';
import AutoEnquiryModal from '../modals/AutoEnquiryModal';
import { BookingContext } from '../booking/BookingContext';
import useSettingsStore from '@/store/settingsStore';

/**
 * Single owner of the marketing-site chrome and lead modals.
 * Every page under (site)/(marketing) renders content only.
 */
export default function SiteShell({ children }) {
  const pathname = usePathname();
  const promoPopup = useSettingsStore((state) => state.promoPopup);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState({});
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);
  const [enquiryInitialData, setEnquiryInitialData] = useState({});

  const bookModalOpenRef = useRef(false);
  useEffect(() => {
    bookModalOpenRef.current = bookModalOpen;
  }, [bookModalOpen]);

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
  const autoPopupDelay = Math.max(1, Number(promoPopup?.delaySeconds) || 5) * 1000;
  useEffect(() => {
    if (!autoPopupEnabled) return undefined;
    const timer = setTimeout(() => {
      if (!bookModalOpenRef.current) setAutoEnquiryOpen(true);
    }, autoPopupDelay);
    return () => clearTimeout(timer);
  }, [autoPopupEnabled, autoPopupDelay]);

  return (
    <BookingContext.Provider value={{ openBooking, openEnquiry, openPrivacy }}>
      <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#1A96EB] selection:text-white pb-14 sm:pb-0">
        <Navbar onOpenBookModal={() => openBooking()} />

        <main className="flex-1">{children}</main>

        <Footer
          onOpenPrivacyModal={openPrivacy}
          onOpenBookModal={() => openBooking()}
        />

        <FloatingActions
          onOpenBookModal={() => openBooking()}
          onOpenEnquiryModal={() => openEnquiry()}
        />

        <QuickBookModal
          isOpen={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          initialData={bookModalInitialData}
        />

        <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />

        {!bookModalOpen && (
          <AutoEnquiryModal
            isOpen={autoEnquiryOpen}
            onClose={() => setAutoEnquiryOpen(false)}
            initialData={enquiryInitialData}
          />
        )}
      </div>
    </BookingContext.Provider>
  );
}
