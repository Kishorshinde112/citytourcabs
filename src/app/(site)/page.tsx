'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TourPackages from '@/components/TourPackages';
import FleetSection from '@/components/FleetSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import GallerySection from '@/components/GallerySection';
import Testimonials from '@/components/Testimonials';
import BookingContactForm from '@/components/BookingContactForm';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import QuickBookModal from '@/components/QuickBookModal';
import PrivacyModal from '@/components/PrivacyModal';
import AutoEnquiryModal from '@/components/AutoEnquiryModal';
import TourModal from '@/components/TourModal';
import { TOURS_DATA } from '@/data/toursData';

export default function HomePage() {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState<any>({});
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  // Check URL query parameters (e.g. /?tour=lonavala-trip)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tourParam = params.get('tour');
      if (tourParam) {
        const match = TOURS_DATA.find((t: any) => t.id === tourParam);
        if (match) {
          setSelectedTour(match);
          setTimeout(() => {
            const el = document.getElementById(`tour-${tourParam}`) || document.getElementById('tours');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
  }, []);

  // Auto trigger enquiry modal after 5 seconds on load / refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setBookModalOpen((currentBookOpen) => {
        if (!currentBookOpen) {
          setAutoEnquiryOpen(true);
        }
        return currentBookOpen;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenBookModal = (initialData = {}) => {
    setAutoEnquiryOpen(false); // Close enquiry modal if open to prevent overlap
    setBookModalInitialData(initialData);
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#1A96EB] selection:text-white pb-14 sm:pb-0">
      {/* Top Navigation */}
      <Navbar
        onOpenBookModal={() => handleOpenBookModal()}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section Slider */}
        <Hero />

        {/* Explore Mumbai & Beyond (Tour Cards) */}
        <TourPackages
          showMumbaiOnly={false}
          onSelectTour={(tour: any) => setSelectedTour(tour)}
          onOpenBookModal={(data: any) => handleOpenBookModal(data)}
        />

        {/* Why Choose CityTourCabs? */}
        <WhyChooseUs />

        {/* Our Cabs Gallery (Fleet) */}
        <FleetSection onOpenBookModal={(data: any) => handleOpenBookModal(data)} />

        {/* What Our Customers Say (Testimonials) */}
        <Testimonials />

        {/* Memories from Our Tours (Photo Gallery) */}
        <GallerySection />

        {/* Get In Touch (Booking & Inquiry Contact Form) */}
        <BookingContactForm />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenBookModal={() => handleOpenBookModal()}
      />

      {/* Floating Call & WhatsApp Desk + Mobile Sticky Bar */}
      <FloatingActions
        onOpenBookModal={() => handleOpenBookModal()}
        onOpenEnquiryModal={() => setAutoEnquiryOpen(true)}
      />

      {/* Full Tour Details Modal */}
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

      {/* Quick Booking Popup Modal */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        initialData={bookModalInitialData}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />

      {/* Auto Timed Discount Enquiry Modal (Guaranteed not to overlap) */}
      {!bookModalOpen && !selectedTour && (
        <AutoEnquiryModal isOpen={autoEnquiryOpen} onClose={() => setAutoEnquiryOpen(false)} />
      )}
    </div>
  );
}
