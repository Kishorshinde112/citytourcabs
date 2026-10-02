import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TourPackages from '../components/TourPackages';
import MumbaiDarshanRateTable from '../components/MumbaiDarshanRateTable';
import TourModal from '../components/TourModal';
import FleetSection from '../components/FleetSection';
import WhyChooseUs from '../components/WhyChooseUs';
import GallerySection from '../components/GallerySection';
import Testimonials from '../components/Testimonials';
import AboutSection from '../components/AboutSection';
import FaqSection from '../components/FaqSection';
import BookingContactForm from '../components/BookingContactForm';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import QuickBookModal from '../components/QuickBookModal';
import PrivacyModal from '../components/PrivacyModal';
import AutoEnquiryModal from '../components/AutoEnquiryModal';
import { TOURS_DATA } from '../data/toursData';

export default function Home() {
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState({});
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  // Check URL query parameters (e.g. /?tour=lonavala-trip)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    if (tourParam) {
      const match = TOURS_DATA.find(t => t.id === tourParam);
      if (match) {
        setSelectedTour(match);
        setTimeout(() => {
          const el = document.getElementById(`tour-${tourParam}`) || document.getElementById('tours');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  // Auto trigger enquiry modal after 5.5 seconds of user spending time on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoEnquiryOpen(true);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenBookModal = (initialData = {}) => {
    setBookModalInitialData(initialData);
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#1A96EB] selection:text-white pb-14 sm:pb-0">

      {/* Top Navigation */}
      <Navbar 
        onOpenBookModal={() => handleOpenBookModal()} 
        onSelectTour={(tour) => setSelectedTour(tour)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section Slider */}
        <Hero />

        {/* Explore Mumbai & Beyond (Tour Cards) */}
        <TourPackages 
          onSelectTour={(tour) => setSelectedTour(tour)} 
          showMumbaiOnly={false} 
          onOpenBookModal={(data) => handleOpenBookModal(data)}
        />

        {/* Why Choose CityTourCabs? */}
        <WhyChooseUs />

        {/* Our Cabs Gallery (Fleet) */}
        <FleetSection onOpenBookModal={(data) => handleOpenBookModal(data)} />

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
        onSelectTour={(tour) => setSelectedTour(tour)}
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
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Auto Timed Discount Enquiry Modal (5-6s Trigger) */}
      <AutoEnquiryModal
        isOpen={autoEnquiryOpen}
        onClose={() => setAutoEnquiryOpen(false)}
      />

    </div>
  );
}
