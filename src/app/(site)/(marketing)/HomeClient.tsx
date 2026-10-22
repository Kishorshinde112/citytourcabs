'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import TourPackages from '@/components/TourPackages';
import FleetSection from '@/components/FleetSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import GallerySection from '@/components/GallerySection';
import Testimonials from '@/components/Testimonials';
import BookingContactForm from '@/components/BookingContactForm';
import TourModal from '@/components/TourModal';
import PageBlocks from '@/components/PageBlocks';
import { useBooking } from '@/components/booking/BookingContext';
import { TOURS_DATA } from '@/data/toursData';

export default function HomeClient({ blocks = [] }: { blocks?: any[] }) {
  const { openBooking } = useBooking();
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // Deep links such as /?tour=lonavala-trip open the matching tour card/modal.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    if (!tourParam) return;

    const match = TOURS_DATA.find((t: any) => t.id === tourParam);
    if (match) {
      setSelectedTour(match);
      setTimeout(() => {
        const el = document.getElementById(`tour-${tourParam}`) || document.getElementById('tours');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const hasCmsBlocks = Array.isArray(blocks) && blocks.length > 0;

  return (
    <>
      {hasCmsBlocks ? (
        <PageBlocks blocks={blocks} />
      ) : (
        <>
          <Hero />

          <TourPackages
            showMumbaiOnly={false}
            onSelectTour={(tour: any) => setSelectedTour(tour)}
            onOpenBookModal={(data: any) => openBooking(data)}
          />

          <WhyChooseUs />

          <FleetSection onOpenBookModal={(data: any) => openBooking(data)} />

          <Testimonials />

          <GallerySection />

          <BookingContactForm />
        </>
      )}

      {selectedTour && (
        <TourModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBookClick={() => {
            const current = selectedTour;
            setSelectedTour(null);
            openBooking({ dropCity: current.title, tripType: 'Tour Package' });
          }}
        />
      )}
    </>
  );
}
