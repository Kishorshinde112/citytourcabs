'use client';

import React, { useState } from 'react';
import TourPackages from '@/components/TourPackages';
import TourModal from '@/components/TourModal';
import { useBooking } from '@/components/booking/BookingContext';

export default function ToursClient() {
  const { openBooking } = useBooking();
  const [selectedTour, setSelectedTour] = useState<any>(null);

  return (
    <div className="pt-12">
      <TourPackages headingAs="h1" onSelectTour={(tour: any) => setSelectedTour(tour)} />

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
