'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Home,
  CalendarCheck,
  Car,
  MapPin,
  User,
  Sparkles,
} from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import { displayIndianPhone, telHref, whatsappNumber } from '@/lib/phone';
import { isAnalyticsHostAllowed } from '@/lib/analytics';

type BookingDetails = {
  id: string;
  name: string;
  contact: string;
  pickupLocation: string;
  tourName: string;
  travelDate: string;
  carType: string;
  type: 'Booking';
};

function asText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}

export default function BookingConfirmedClient() {
  const router = useRouter();
  const { phone } = useSettingsStore();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const trackedBookingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let saved: Record<string, unknown> = {};

    try {
      const stored = window.sessionStorage.getItem('last_booking');
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        saved = parsed as Record<string, unknown>;
      }
    } catch {
      // Invalid or unavailable session data must never create a conversion.
    }

    const bookingType = asText(saved.type).trim().toLowerCase();
    const bookingId = asText(saved.id).trim();

    // An enquiry must stay in its own, existing GTM conversion flow.
    if (bookingType === 'enquiry' || bookingType === 'inquiry') {
      setIsRedirecting(true);
      router.replace('/enquiry-confirmed');
      return;
    }

    // Only a saved booking request with a backend-generated ID qualifies.
    if (bookingType !== 'booking' || !bookingId) {
      setIsRedirecting(true);
      router.replace('/');
      return;
    }

    setBooking({
      id: bookingId,
      name: asText(saved.name),
      contact: asText(saved.contact) || asText(saved.phone),
      pickupLocation: asText(saved.pickupLocation) || asText(saved.pickupCity),
      tourName: asText(saved.tourName) || asText(saved.dropCity) || asText(saved.tripType) || 'Cab Service',
      travelDate: asText(saved.travelDate),
      carType: asText(saved.carType) || 'Sedan (Dzire / Etios)',
      type: 'Booking',
    });

    // Send a GTM-only event. Never dispatch a direct Google Ads conversion
    // here: the GTM conversion tag should be the sole sender.
    if (!isAnalyticsHostAllowed()) return;
    if (trackedBookingIds.current.has(bookingId)) return;

    const dedupKey = `ctc_booking_request_tracked_${bookingId}`;
    try {
      if (window.sessionStorage.getItem(dedupKey) === 'true') {
        trackedBookingIds.current.add(bookingId);
        return;
      }
    } catch {
      // Ref-based deduplication still works if storage is unavailable.
    }

    try {
      window.dataLayer ??= [];
      window.dataLayer.push({
        event: 'booking_request_success',
        transaction_id: bookingId,
        booking_id: bookingId,
        lead_type: 'booking_request',
      });

      // Latch only after the event was queued. This confirms neither
      // tag firing nor Google Ads acceptance/attribution.
      trackedBookingIds.current.add(bookingId);
      try {
        window.sessionStorage.setItem(dedupKey, 'true');
      } catch {
        // No persistent latch when storage is disabled.
      }
    } catch {
      // Do not mark as tracked if the dataLayer push failed.
    }
  }, [router]);

  // While checking authorization or redirecting, show spinner and block content
  if (isRedirecting || !booking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const whatsappMessage = `Hi City Tour Cabs, I just submitted a booking request. Please confirm my cab for ${booking.tourName || 'my trip'}.`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/30 mb-5">
            <CheckCircle2 className="w-12 h-12 text-black" />
          </div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" /> Booking Request Received
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Thank You, {booking.name || 'Valued Customer'}! 🎉
          </h1>
          <p className="text-zinc-400 text-sm max-w-sm">
            Your booking request has been received. Our team will contact you shortly to confirm your booking, driver and cab details.
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl mb-6 space-y-4">
          <div className="space-y-3">
            {booking.name && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Name:</span>
                <span className="text-white font-semibold ml-auto">{booking.name}</span>
              </div>
            )}
            {booking.contact && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Phone:</span>
                <span className="text-white font-semibold ml-auto">{displayIndianPhone(booking.contact)}</span>
              </div>
            )}
            {booking.pickupLocation && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Pickup:</span>
                <span className="text-white font-semibold ml-auto text-right max-w-[55%]">
                  {booking.pickupLocation}
                </span>
              </div>
            )}
            {booking.tourName && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-zinc-400 shrink-0">Tour / Destination:</span>
                <span className="text-white font-semibold ml-auto text-right">
                  {booking.tourName}
                </span>
              </div>
            )}
            {booking.travelDate && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Travel Date:</span>
                <span className="text-white font-semibold ml-auto">{booking.travelDate}</span>
              </div>
            )}
            {booking.carType && (
              <div className="flex items-center gap-3 text-sm">
                <Car className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Vehicle:</span>
                <span className="text-white font-semibold ml-auto">{booking.carType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={telHref(phone)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black text-sm transition shadow-lg shadow-yellow-400/20"
          >
            <Phone className="w-4 h-4" />
            Call Us Now
          </a>
          <a
            href={`https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-sm transition shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm transition"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}