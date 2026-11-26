'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  X, MapPin, Clock, Car, Check, AlertCircle,
  Phone, MessageCircle, Star, Sparkles,
} from 'lucide-react';
import { useSiteSettings } from '@/store/settingsStore';
import { telHref, whatsappNumber } from '@/lib/phone';

export default function TourModal({ tour, onClose }: { tour: any; onClose: () => void; onBookClick?: () => void }) {
  const { phone } = useSiteSettings();

  useEffect(() => {
    if (!tour) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tour, onClose]);

  if (!tour) return null;

  const whatsappMessage = `*🚖 City Tour Cabs - Tour Booking Request*\n\n` +
    `*Package:* ${tour.title}\n` +
    `*Duration:* ${tour.duration}\n` +
    `*Starting Fare:* ${tour.startingPrice}\n\n` +
    `Hello, I would like to inquire about booking the *${tour.title}* package. Please share available car options and best discounted rate.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 my-4 sm:my-8">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg cursor-pointer"
          aria-label="Close tour details dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <Image
            src={tour.banner}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/45 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-700 text-white font-bold text-xs">
                {tour.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white font-semibold text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-200" aria-hidden="true" />
                {tour.duration}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-700 backdrop-blur-md text-white font-semibold text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-yellow-300" aria-hidden="true" />
                {tour.rating} ({tour.reviewsCount}+ Reviews)
              </span>
            </div>

            <h2 id="tour-modal-title" className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
              {tour.title}
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
              {tour.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6">

          {/* Driver Guide Banner */}
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Driver-Cum-Tour Guide Advantage</h3>
              <p className="text-xs text-slate-700">
                Your chauffeur is an experienced local expert who acts as your personal tour guide throughout the trip.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">
              About This Tour
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {tour.shortDescription}
            </p>
          </div>

          {/* Booking Packages & Duration Options */}
          {tour.bookingPackages && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                Package Duration Options
              </h3>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {tour.bookingPackages.map((pkg: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center">
                    <div className="text-xs font-bold text-slate-800">{pkg.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{pkg.duration}</div>
                    <div className="text-indigo-700 font-black text-sm mt-1">{pkg.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Sightseeing Attractions */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              Key Attractions &amp; Sightseeing Spots
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {tour.highlights.map((spot: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                What&apos;s Included
              </h3>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {tour.inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
                What&apos;s Excluded
              </h3>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {tour.exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-700 font-bold" aria-hidden="true">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vehicle Options */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              Available Vehicles for This Tour
            </h3>
            <div className="flex flex-wrap gap-2">
              {tour.carTypes.map((car: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  {car}
                </span>
              ))}
            </div>
          </div>

          {/* Tour Guidelines */}
          {tour.rules && (
            <div className="bg-slate-100 p-4 rounded-2xl text-xs text-slate-700 space-y-1">
              <h3 className="font-bold text-slate-800 mb-1">Important Information &amp; Rules</h3>
              {tour.rules.map((rule: string, idx: number) => (
                <p key={idx}>• {rule}</p>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-600">Starting from</span>
            <div className="text-2xl font-black text-slate-900 font-display">
              {tour.startingPrice} <span className="text-xs font-normal text-slate-600">/ package</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={telHref(phone)}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-4 h-4 text-indigo-300" aria-hidden="true" />
              <span>Call Us</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Book on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
