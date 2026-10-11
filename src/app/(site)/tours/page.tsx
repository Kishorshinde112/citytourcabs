'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TourPackages from '@/components/TourPackages';
import TourModal from '@/components/TourModal';
import QuickBookModal from '@/components/QuickBookModal';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import PrivacyModal from '@/components/PrivacyModal';
import AutoEnquiryModal from '@/components/AutoEnquiryModal';

export default function ToursListingPage() {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState<any>({});
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  const handleOpenBookModal = (initialData = {}) => {
    setAutoEnquiryOpen(false);
    setBookModalInitialData(initialData);
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col pb-14 sm:pb-0">
      <Navbar onOpenBookModal={() => handleOpenBookModal()} />
      <main className="flex-1 pt-12">
        <TourPackages onSelectTour={(tour: any) => setSelectedTour(tour)} />
      </main>
      <Footer
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenBookModal={() => handleOpenBookModal()}
      />
      <FloatingActions
        onOpenBookModal={() => handleOpenBookModal()}
        onOpenEnquiryModal={() => setAutoEnquiryOpen(true)}
      />
      {selectedTour && (
        <TourModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBookClick={() => {
            const current = selectedTour;
            setSelectedTour(null);
            handleOpenBookModal({ dropCity: current.title, tripType: 'Tour Package' });
          }}
        />
      )}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        initialData={bookModalInitialData}
      />
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      {!bookModalOpen && (
        <AutoEnquiryModal isOpen={autoEnquiryOpen} onClose={() => setAutoEnquiryOpen(false)} />
      )}
    </div>
  );
}
