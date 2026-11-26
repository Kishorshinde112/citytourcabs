import type { Metadata } from 'next';
import React from 'react';
import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import BookingContactForm from '@/modules/bookings/components/BookingContactForm';
import { createMetadata } from '@/modules/seo/metadata';
import { TaxiServiceSchema } from '@/modules/seo/jsonld';
import { SITE_CONFIG } from '@/shared/config/site';
import { getTourLinks } from '@/modules/tours/queries';
import { getSiteSettings } from '@/lib/cmsGlobals';
import { displayIndianPhone, telHref, whatsappNumber } from '@/lib/phone';

export const revalidate = 300;

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with City Tour Cabs Mumbai for cab bookings, sightseeing enquiries, customized tour packages, and outstation taxi service. 24/7 support.',
  canonical: '/contact',
});

export default async function ContactPage() {
  const [tourLinks, settings] = await Promise.all([
    getTourLinks(),
    getSiteSettings(),
  ]);
  const initialDestinations = tourLinks.map((t) => t.name).filter(Boolean);
  const phone = settings.phone || SITE_CONFIG.defaultPhone;
  const email = settings.email || SITE_CONFIG.defaultEmail;
  const workingHours = settings.workingHours || SITE_CONFIG.workingHours;

  return (
    <div className="bg-white text-gray-900">
      <TaxiServiceSchema />

      {/* Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-[#0F6EB8] text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Contact City Tour Cabs
          </h1>
          <p className="text-base sm:text-lg text-blue-50 max-w-2xl mx-auto">
            Have questions about a tour package or need a customized itinerary? Reach out anytime — we are available 24/7.
          </p>
        </div>
      </section>

      {/* Quick Details Cards */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0F6EB8] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Direct Call Desk</p>
              <a href={telHref(phone)} className="text-sm font-bold text-gray-900 hover:text-[#0F6EB8]">
                {displayIndianPhone(phone)}
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">WhatsApp Support</p>
              <a
                href={`https://wa.me/${whatsappNumber(phone)}?text=Hi%20CityTourCabs,%20I%20have%20an%20enquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-gray-900 hover:text-emerald-700"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0F6EB8] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Email Desk</p>
              <a href={`mailto:${email}`} className="text-sm font-bold text-gray-900 hover:text-[#0F6EB8] break-all">
                {email}
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Working Hours</p>
              <p className="text-sm font-bold text-gray-900">{workingHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Enquiry Form */}
      <BookingContactForm
        title="Send an Enquiry"
        subtitle="Fill in your details and our team will get back to you with fixed tariff quotes and cab availability."
        initialDestinations={initialDestinations}
      />
    </div>
  );
}
