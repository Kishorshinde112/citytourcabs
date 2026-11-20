import type { Metadata } from 'next';
import React from 'react';
import { createMetadata } from '@/modules/seo/metadata';
import { SITE_CONFIG } from '@/shared/config/site';

export const metadata: Metadata = createMetadata({
  title: 'Terms & Cancellation Policy',
  description:
    'Read City Tour Cabs booking policies, cancellation rules, night allowance details, and transparent tariff guidelines.',
  canonical: '/terms',
});

export default function TermsPage() {
  return (
    <div className="bg-white text-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold font-[Reddit_Sans] text-gray-900 border-b border-gray-200 pb-4">
          Terms & Conditions / Cancellation Policy
        </h1>

        <section className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-xl font-bold text-gray-900">1. Booking & Confirmation</h2>
          <p>
            All bookings with City Tour Cabs are confirmed subject to vehicle and driver availability. Once your enquiry is accepted, you will receive driver and vehicle details via WhatsApp or SMS.
          </p>

          <h2 className="text-xl font-bold text-gray-900">2. Tariff & Inclusions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Car hire charges include vehicle fuel and chauffeur services.</li>
            <li><strong>Toll charges, parking fees, and entry tickets</strong> at monuments are NOT included in the base package and must be paid by the customer on actuals.</li>
            <li>Package hours and kilometres start from doorstep pickup point to pickup point.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">3. Cancellation Policy</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Free cancellation if informed at least 12 hours prior to scheduled pickup.</li>
            <li>A cancellation fee of <strong>₹500</strong> is applicable if the booking is cancelled after the arrival of the driver at the pickup address.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">4. Extra Kilometres & Hours</h2>
          <p>
            Any usage beyond the booked package hours or kilometres will be charged according to the standard extra-km and extra-hour rates displayed on the vehicle rate card.
          </p>

          <h2 className="text-xl font-bold text-gray-900">5. Night Allowance</h2>
          <p>
            For Tempo Travellers and outstation journeys running past 11:00 PM, a standard night allowance of ₹500 is applicable.
          </p>
        </section>
      </div>
    </div>
  );
}
