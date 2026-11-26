import type { Metadata } from 'next';
import React from 'react';
import { getActiveFleet } from '@/modules/fleet/queries';
import { CarCard } from '@/modules/fleet/components/CarCard';
import { createMetadata } from '@/modules/seo/metadata';

export const revalidate = 300;

export const metadata: Metadata = createMetadata({
  title: 'Our Cab Fleet & Vehicles',
  description:
    'Explore our well-maintained fleet of sanitized AC cabs: Maruti WagonR, Swift Dzire, Maruti Ertiga, Kia Carens, Innova Crysta, and Tempo Travellers for Mumbai sightseeing and outstation trips.',
  canonical: '/fleet',
});

export default async function FleetPage() {
  const fleet = await getActiveFleet();

  return (
    <div className="bg-white text-gray-900">
      <section className="bg-gradient-to-r from-blue-900 to-[#0F6EB8] text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Our Cab Fleet & Vehicles
          </h1>
          <p className="text-base sm:text-lg text-blue-50 max-w-2xl mx-auto">
            Choose from sanitized hatchbacks, sedans, family MUVs, and luxury group travellers driven by certified polite chauffeurs.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fleet.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
