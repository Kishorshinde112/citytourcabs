import React from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';

export default function FloatingActions({ onOpenBookModal, onOpenEnquiryModal }) {
  const { phone } = useSettingsStore();

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

  return (
    <>
      {/* Right Edge Side Floating Vertical Inquire Now Tab */}
      <button
        onClick={handleEnquiryClick}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-3 px-2 rounded-l-md shadow-xl flex items-center gap-1.5 cursor-pointer [writing-mode:vertical-rl] rotate-180 transition-all hover:px-2.5"
        aria-label="Inquire Now"
      >
        <Phone className="w-3.5 h-3.5 rotate-90 text-white" />
        <span className="tracking-wide">Inquire Now</span>
      </button>

      {/* Desktop Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-gray-900/80 hover:bg-gray-900 text-white shadow-md flex items-center justify-center transition cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>

        {/* Floating WhatsApp */}
        <a
          href={`https://wa.me/91${phone}?text=Hi%20CityTourCabs,%20I%20would%20like%20to%20inquire%20about%20your%20tour%20packages.`}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center transition transform hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-3 flex items-center gap-2 shadow-2xl">
        <a
          href={`tel:+91${phone}`}
          className="flex-1 py-2.5 px-2 rounded-md bg-[#1A96EB] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Us</span>
        </a>

        <a
          href={`https://wa.me/91${phone}?text=Hi%20CityTourCabs,%20I%20want%20to%20book%20a%20cab.`}
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
