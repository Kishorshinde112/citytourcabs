'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/blocks/HeroBlock';
import TourPackages from '@/modules/tours/components/TourGrid';
import FleetSection from '@/modules/fleet/components/FleetGrid';
import WhyChooseUs from '@/blocks/WhyChooseUsBlock';
import Testimonials from '@/blocks/ReviewsBlock';
import BookingContactForm from '@/modules/bookings/components/BookingContactForm';
import { useBooking } from '@/components/booking/BookingContext';

const TourModal = dynamic(() => import('@/modules/tours/components/TourModal'), {
  ssr: false,
});

export default function HomeClient({
  hasCmsBlocks = false,
  initialTours = null,
  initialFleet = null,
  initialTestimonials = null,
}: {
  hasCmsBlocks?: boolean;
  initialTours?: any[] | null;
  initialFleet?: any[] | null;
  initialTestimonials?: any[] | null;
}) {
  const { openBooking } = useBooking();
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // Deep links such as /?tour=lonavala-trip open the matching tour card/modal lazily.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    if (!tourParam) return;

    let active = true;
    import('@/data/toursData')
      .then(({ TOURS_DATA }) => {
        if (!active) return;
        const match = TOURS_DATA.find((t: any) => t.id === tourParam);
        if (match) {
          setSelectedTour(match);
          setTimeout(() => {
            const el = document.getElementById(`tour-${tourParam}`) || document.getElementById('tours');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const initialDestinations = Array.isArray(initialTours)
    ? initialTours.map((t: any) => t.title).filter(Boolean)
    : null;

  return (
    <>
      {!hasCmsBlocks && (
        <>
          <Hero isFallbackStatic />

          <TourPackages
            showMumbaiOnly={false}
            onSelectTour={(tour: any) => setSelectedTour(tour)}
            onOpenBookModal={(data: any) => openBooking(data)}
            initialTours={initialTours}
          />

          <WhyChooseUs isFallbackStatic />

          <FleetSection
            onOpenBookModal={(data: any) => openBooking(data)}
            initialFleet={initialFleet}
          />

          <Testimonials initialReviews={initialTestimonials} />

          <BookingContactForm initialDestinations={initialDestinations} />
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
