import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import EnquiryConfirmedClient from './EnquiryConfirmedClient';

export const metadata: Metadata = {
  title: 'Enquiry Confirmed | City Tour Cabs Mumbai',
  description:
    'Your tour enquiry has been received. Our team will contact you in a couple of minutes to confirm your tour and cab details.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnquiryConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <EnquiryConfirmedClient />
    </Suspense>
  );
}
