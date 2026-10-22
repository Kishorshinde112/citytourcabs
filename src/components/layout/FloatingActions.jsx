'use client';

import React from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import { telHref, whatsappNumber } from '@/lib/phone';

export default function FloatingActions({ onOpenBookModal = () => {}, onOpenEnquiryModal = () => {} }) {
  const { phone, whatsapp } = useSettingsStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquiryClick = () => {
    if (typeof onOpenEnquiryModal === 'function') {
      onOpenEnquiryModal();
    } else if (typeof onOpenBookModal === 'function') {
      onOpenBookModal();
    }
  };

  const [isSideHovered, setIsSideHovered] = React.useState(false);

  return (
    <>
      {/* 1. Right Edge Expandable Inquire Now Side Tab */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
        onMouseEnter={() => setIsSideHovered(true)}
        onMouseLeave={() => setIsSideHovered(false)}
      >
        <div
          className={`bg-orange-600 hover:bg-orange-700 text-white shadow-lg cursor-pointer transition-all duration-300 ease-in-out rounded-l-lg ${
            isSideHovered ? 'w-56' : 'w-12'
          }`}
          onClick={handleEnquiryClick}
        >
          <div className="flex items-center h-full">
            <div
              className={`flex items-center justify-center transition-opacity duration-300 ${
                isSideHovered ? 'opacity-0 w-0 h-0' : 'opacity-100 w-12 h-40'
              }`}
            >
              <div className="flex items-center gap-2 -rotate-90 whitespace-nowrap">
                <Phone className="h-4 w-4 rotate-90" />
                <span className="text-sm tracking-wide font-medium">Inquire Now</span>
              </div>
            </div>
            <div
              className={`transition-opacity duration-300 ${
                isSideHovered ? 'opacity-100 w-56 px-5 py-4' : 'opacity-0 w-0 h-0'
              }`}
            >
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm whitespace-nowrap font-bold">Inquire Now</p>
                  <p className="text-xs whitespace-nowrap text-orange-100">Get Instant Quote</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating WhatsApp Button (Bottom Right) */}
      <a
        href={`https://wa.me/${whatsappNumber(whatsapp || phone)}?text=${encodeURIComponent('Hi, I would like to inquire about your tour packages.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group cursor-pointer hidden sm:flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Chat with us on WhatsApp
        </span>
      </a>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-3 flex items-center gap-2 shadow-2xl">
        <a
          href={telHref(phone)}
          className="flex-1 py-2.5 px-2 rounded-md bg-[#1A96EB] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Us</span>
        </a>

        <a
          href={`https://wa.me/${whatsappNumber(whatsapp || phone)}?text=Hi%20CityTourCabs,%20I%20want%20to%20book%20a%20cab.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 px-2 rounded-md bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => onOpenBookModal()}
          className="py-2.5 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs flex items-center justify-center cursor-pointer"
        >
          Book
        </button>
      </div>
    </>
  );
}
