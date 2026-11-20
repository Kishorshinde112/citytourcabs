import type { Metadata } from 'next';
import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import BookingContactForm from '@/modules/bookings/components/BookingContactForm';
import { createMetadata } from '@/modules/seo/metadata';
import { TaxiServiceSchema } from '@/modules/seo/jsonld';
import { SITE_CONFIG } from '@/shared/config/site';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with City Tour Cabs Mumbai for cab bookings, sightseeing enquiries, customized tour packages, and outstation taxi service. 24/7 support.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <div className="bg-white text-gray-900">
      <TaxiServiceSchema />

      {/* Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-[#1A96EB] text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-[Reddit_Sans] mb-4">
            Contact City Tour Cabs
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Have questions about a tour package or need a customized itinerary? Reach out anytime — we are available 24/7.
          </p>
        </div>
      </section>

      {/* Quick Details Cards */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#1A96EB] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Direct Call Desk</p>
              <a href={`tel:+91${SITE_CONFIG.defaultPhone}`} className="text-sm font-bold text-gray-900 hover:text-[#1A96EB]">
                +91 {SITE_CONFIG.defaultPhone}
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">WhatsApp Support</p>
              <a
                href={`https://wa.me/91${SITE_CONFIG.defaultPhone}?text=Hi%20CityTourCabs,%20I%20have%20an%20enquiry.`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-gray-900 hover:text-green-600"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#1A96EB] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Desk</p>
              <a href={`mailto:${SITE_CONFIG.defaultEmail}`} className="text-sm font-bold text-gray-900 hover:text-[#1A96EB] break-all">
                {SITE_CONFIG.defaultEmail}
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Working Hours</p>
              <p className="text-sm font-bold text-gray-900">{SITE_CONFIG.workingHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Enquiry Form */}
      <BookingContactForm
        title="Send an Enquiry"
        subtitle="Fill in your details and our team will get back to you with fixed tariff quotes and cab availability."
      />
    </div>
  );
}
