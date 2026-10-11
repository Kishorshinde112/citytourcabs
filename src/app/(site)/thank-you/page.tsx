'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const POPULAR_TOURS = [
  {
    title: 'Mumbai Darshan',
    image: '/assets/tours/bd08021da8c244de8eafa9a4f86c4e2a30099151_yk3fsq4Dd4.png',
    href: '/mumbai-darshan',
  },
  {
    title: 'Lonavala Trip',
    image: '/assets/tours/panvel_upscaled_image_2_HOyyQs2JHJ.webp',
    href: '/lonavala-trip',
  },
  {
    title: 'Shirdi Tour',
    image: '/assets/tours/shirdi_p7RAPbKB9X.jpeg',
    href: '/shirdi-tour',
  },
];

export default function ThankYouPage() {
  const { phone, email } = useSettingsStore();

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Top Orange Header Banner */}
        <div className="bg-orange-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-20 w-20 text-orange-100" />
            </div>
            <h1 className="mb-4 text-4xl sm:text-5xl font-bold font-[Reddit_Sans] text-white">
              Thank You for Your Inquiry!
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
              We've received your booking request and our team will get back to you shortly to confirm your tour details.
            </p>
            <p className="font-handwritten text-2xl text-orange-100">
              Your adventure awaits!
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* What Happens Next? */}
            <h2 className="text-center mb-12 text-[30px] font-[Reddit_Sans] font-bold text-gray-900">
              What Happens Next?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-orange-200 p-6 text-center shadow-sm">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-600 font-bold">1</span>
                </div>
                <h3 className="mb-3 font-bold font-[Reddit_Sans] text-lg text-gray-900">
                  Review
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our team will review your inquiry and tour requirements
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-orange-200 p-6 text-center shadow-sm">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-600 font-bold">2</span>
                </div>
                <h3 className="mb-3 text-[16px] font-[Reddit_Sans] font-bold text-gray-900">
                  Contact
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We'll call or email you within 24 hours to confirm details
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl border border-orange-200 p-6 text-center shadow-sm">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-600 font-bold">3</span>
                </div>
                <h3 className="mb-3 text-[16px] font-[Reddit_Sans] font-bold text-gray-900">
                  Confirm
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once confirmed, get ready for an amazing tour experience!
                </p>
              </div>
            </div>

            {/* Need Immediate Assistance? */}
            <div className="bg-orange-50 rounded-xl p-8 mb-16 border border-orange-100">
              <h3 className="text-center mb-6 text-[20px] font-[Reddit_Sans] font-bold text-gray-900">
                Need Immediate Assistance?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <a
                  href={`tel:+91${phone}`}
                  className="flex items-center gap-3 justify-center md:justify-start hover:text-orange-600 transition-colors font-medium text-gray-800"
                >
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span>+91 {phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 justify-center md:justify-end hover:text-orange-600 transition-colors font-medium text-gray-800"
                >
                  <Mail className="h-5 w-5 text-orange-600" />
                  <span>{email}</span>
                </a>
              </div>
            </div>

            {/* Return to Homepage Button */}
            <div className="text-center mb-16">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md font-medium text-base text-white px-8 py-3.5 bg-orange-600 hover:bg-orange-700 transition-colors shadow-md cursor-pointer"
              >
                Return to Homepage
              </Link>
            </div>

            {/* Explore Our Popular Tours */}
            <div>
              <h2 className="text-center mb-3 text-[30px] font-[Reddit_Sans] font-bold text-gray-900">
                Explore Our Popular Tours
              </h2>
              <p className="text-center text-gray-600 mb-8">
                While you wait, check out some of our most loved destinations
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {POPULAR_TOURS.map((tour, idx) => (
                  <Link
                    key={idx}
                    href={tour.href}
                    className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-4/3 overflow-hidden h-44">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 font-[Reddit_Sans]">
                        {tour.title}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-[#1A96EB]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
