'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import './tour-detail.css';
import { useBooking } from '@/components/booking/BookingContext';
import { useSiteSettings } from '@/store/settingsStore';
import { displayIndianPhone, telHref } from '@/shared/lib/phone';
import { ArrowRight, Phone } from 'lucide-react';

export default function TourDetailClient({ slug, data }: { slug: string; data: any }) {
  const { phone } = useSiteSettings();
  const { openBooking } = useBooking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleOpenBookModal = (extra = {}) => {
    openBooking({
      dropCity: data.title,
      tripType: data.title || 'Tour Package',
      ...extra,
    });
  };

  const scrollToRateCard = () => {
    document.getElementById('rate-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
        {/* Banner Section */}
        <section className="relative h-[340px] md:h-[420px] overflow-hidden bg-gray-900">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-3 text-white">
                {data.title}
              </h1>
              <p className="text-base md:text-xl max-w-2xl mx-auto text-gray-100 font-sans mb-6">
                {data.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={scrollToRateCard}
                  className="px-5 py-2.5 rounded-lg bg-[#0F6EB8] hover:bg-[#0B5591] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Rates</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenBookModal()}
                  className="px-5 py-2.5 rounded-lg bg-orange-700 hover:bg-orange-800 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Book Now</span>
                </button>
                <a
                  href={telHref(phone)}
                  className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/40 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow backdrop-blur-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="tour-flex-layout mb-16">
            {/* Left Column */}
            <div className="tour-flex-left">
              <div
                className="tour-content"
                dangerouslySetInnerHTML={{ __html: data.leftHtml || '' }}
              />
            </div>

            {/* Right Column */}
            <div className="tour-flex-right" id="rate-card">
              <div className="sticky top-24 space-y-6 scroll-mt-24">
                {/* Rate Card Table */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h2 className="mb-4 text-[18px] font-bold font-display text-gray-900">Rate Card</h2>
                  <div
                    className="rate-table-html"
                    dangerouslySetInnerHTML={{ __html: data.rightHtml || '' }}
                  />
                </div>

                {/* Quick Booking Card */}
                <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                  <h2 className="mb-4 text-[18px] font-bold font-display text-orange-700">Quick Booking</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Get instant confirmation for your {data.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenBookModal()}
                    className="w-full bg-orange-700 hover:bg-orange-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm text-gray-700 mb-2">Or call us directly:</p>
                    <a
                      href={telHref(phone)}
                      className="text-[#0F6EB8] hover:text-[#0B5591] transition-colors block font-semibold"
                    >
                      {displayIndianPhone(phone)}{' '}
                      <span className="ml-2 text-xs text-gray-600 font-normal">
                        | City Tour Cabs
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
