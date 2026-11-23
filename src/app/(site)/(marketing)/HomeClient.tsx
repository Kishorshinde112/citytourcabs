'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/blocks/HeroBlock';
import TourPackages from '@/modules/tours/components/TourGrid';
import FleetSection from '@/modules/fleet/components/FleetGrid';
import WhyChooseUs from '@/blocks/WhyChooseUsBlock';
import Testimonials from '@/blocks/ReviewsBlock';
import BookingContactForm from '@/modules/bookings/components/BookingContactForm';
import TourModal from '@/modules/tours/components/TourModal';
import RenderBlocks from '@/blocks/RenderBlocks';
import { useBooking } from '@/components/booking/BookingContext';
import { TOURS_DATA } from '@/data/toursData';

export default function HomeClient({
  blocks = [],
  initialTours = null,
}: {
  blocks?: any[];
  initialTours?: any[] | null;
}) {
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
        <RenderBlocks blocks={blocks} initialTours={initialTours} />
      ) : (
        <>
          <Hero />

          <TourPackages
            showMumbaiOnly={false}
            onSelectTour={(tour: any) => setSelectedTour(tour)}
            onOpenBookModal={(data: any) => openBooking(data)}
            initialTours={initialTours}
          />

          <WhyChooseUs />

          <FleetSection onOpenBookModal={(data: any) => openBooking(data)} />

          <Testimonials />

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
