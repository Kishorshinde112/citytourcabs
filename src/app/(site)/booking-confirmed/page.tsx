import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import BookingConfirmedClient from './BookingConfirmedClient';

export const metadata: Metadata = {
  title: 'Booking Confirmed | City Tour Cabs Mumbai',
  description: 'Your booking has been received. Our team will contact you shortly to confirm your driver and cab details.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <BookingConfirmedClient />
    </Suspense>
  );
}
