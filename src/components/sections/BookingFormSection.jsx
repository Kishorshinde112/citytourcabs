'use client';

import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { useBooking } from '@/components/booking/BookingContext';

export default function BookingFormSection({ block = null }) {
  const { openBooking } = useBooking();

  return (
    <section className="py-14 md:py-20 bg-orange-50 text-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm md:p-12">
          <CalendarCheck className="mb-4 h-10 w-10 text-orange-700" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-display text-gray-900 md:text-3xl">
            {block?.title || 'Ready to Book Your Cab?'}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-gray-700 sm:text-base">
            Tell us your destination and travel date. Our team will confirm your cab and fare quickly.
          </p>
          <button
            type="button"
            onClick={() => openBooking()}
            className="mt-6 rounded-md bg-[#0F6EB8] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B5591] cursor-pointer"
          >
            Start Booking
          </button>
        </div>
      </div>
    </section>
  );
}
