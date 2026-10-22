'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useBooking } from '@/components/booking/BookingContext';

const HIGHLIGHTS = [
  'Doorstep pickup and drop across Mumbai',
  'Experienced, courteous local drivers',
  'Clean, sanitized and well-maintained cabs',
  'Transparent pricing with no hidden charges',
];

export default function AboutSection({ block = null }) {
  const { openBooking } = useBooking();

  return (
    <section id="about-company" className="py-16 md:py-24 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ScrollReveal>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#1A96EB]">
                About City Tour Cabs
              </p>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold font-[Reddit_Sans] text-gray-900">
                {block?.title || 'About City Tour Cabs'}
              </h2>
              <p className="mb-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                {block?.subtitle ||
                  "City Tour Cabs is Mumbai's trusted cab service for sightseeing, outstation trips, airport transfers and local rides. We combine reliable cars, experienced drivers and honest pricing so every journey is comfortable."}
              </p>
              <ul className="mb-7 space-y-3">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openBooking({ tripType: 'City Tour' })}
                  className="rounded-md bg-[#1A96EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1578BC]"
                >
                  Book a Cab
                </button>
                <Link
                  href="/about"
                  className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#1A96EB] hover:text-[#1A96EB]"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '12+', label: 'Years of service' },
                { value: '50,000+', label: 'Happy customers' },
                { value: '45+', label: 'Cabs in our fleet' },
                { value: '25+', label: 'Destinations covered' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
                  <div className="text-3xl font-bold text-[#1A96EB]">{stat.value}</div>
                  <div className="mt-1 text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
