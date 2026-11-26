'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import TourPackages from '@/modules/tours/components/TourGrid';
import { useBooking } from '@/components/booking/BookingContext';

const TourModal = dynamic(() => import('@/modules/tours/components/TourModal'), {
  ssr: false,
});

export default function ToursClient({ initialTours = null }: { initialTours?: any[] | null }) {
  const { openBooking } = useBooking();
  const [selectedTour, setSelectedTour] = useState<any>(null);

  return (
    <div className="pt-12">
      <TourPackages
        headingAs="h1"
        onSelectTour={(tour: any) => setSelectedTour(tour)}
        initialTours={initialTours}
      />

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
    </div>
  );
}
