'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Home,
  CalendarCheck,
  MapPin,
  User,
  Sparkles,
} from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import { trackLeadEnquiry } from '@/lib/analytics';

export default function EnquiryConfirmedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { phone } = useSettingsStore();
  const [enquiry, setEnquiry] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const enquiryIdRef = useRef<string>('');
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    let saved: any = {};

    try {
      const stored = sessionStorage.getItem('last_booking');
      if (stored) {
        saved = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    const fallbackId = (
      searchParams.get('id') ||
      saved.id ||
      ''
    ).trim();

    // Route Guard: If no valid enquiry reference exists, redirect to home page immediately
    if (!fallbackId) {
      setIsRedirecting(true);
      router.replace('/');
      return;
    }

    enquiryIdRef.current = fallbackId;

    const resolvedTour =
      searchParams.get('tour') ||
      saved.tourName ||
      saved.dropCity ||
      saved.tripType ||
      'Tour Enquiry';

    setEnquiry({
      id: fallbackId,
      name:
        searchParams.get('name') ||
        saved.name ||
        '',
      contact:
        searchParams.get('contact') ||
        saved.contact ||
        saved.phone ||
        '',
      tourName: resolvedTour,
      travelDate:
        searchParams.get('date') ||
        saved.travelDate ||
        '',
    });

    // Unified GA4 & Google Ads Lead Conversion tracking (with deduplication latches)
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      trackLeadEnquiry(fallbackId, resolvedTour);
    }
  }, [searchParams, router]);

  // While checking authorization or redirecting, show spinner and block content
  if (isRedirecting || !enquiry) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const enquiryId = enquiryIdRef.current || enquiry.id || '';

  const whatsappMessage =
    `Hi City Tour Cabs, I just submitted an enquiry (Ref: ${enquiryId}). Please share tour details and fare quotation for ${encodeURIComponent(
      enquiry.tourName || 'my tour'
    )}.`;

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
            <Sparkles className="w-4 h-4" />
            Enquiry Confirmed
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Thank You, {enquiry.name || 'Valued Customer'}! 🎉
          </h1>

          <p className="text-zinc-400 text-sm max-w-sm">
            Your enquiry request has been received. Our team will call you in{' '}
            <span className="text-yellow-400 font-bold">
              a couple of minutes
            </span>{' '}
            to confirm your tour and cab details.
          </p>
        </div>

        {/* Enquiry Summary Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl mb-6 space-y-4">

          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Enquiry Reference
            </span>
            <span className="text-yellow-400 font-black text-base">{enquiryId}</span>
          </div>

          <div className="space-y-3">

            {/* Customer Name */}
            {enquiry.name && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Name:</span>
                <span className="text-white font-semibold ml-auto">
                  {enquiry.name}
                </span>
              </div>
            )}

            {/* Phone Number */}
            {enquiry.contact && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">Phone:</span>
                <span className="text-white font-semibold ml-auto">
                  +91 {enquiry.contact}
                </span>
              </div>
            )}

            {/* Tour / Destination */}
            {enquiry.tourName && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-zinc-400 shrink-0">
                  Tour / Destination:
                </span>
                <span className="text-white font-semibold ml-auto text-right">
                  {enquiry.tourName}
                </span>
              </div>
            )}

            {/* Travel Date */}
            {enquiry.travelDate && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-zinc-400">
                  Travel Date:
                </span>
                <span className="text-white font-semibold ml-auto">
                  {enquiry.travelDate}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">

          <a
            href={`tel:+91${phone}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black text-sm transition shadow-lg shadow-yellow-400/20"
          >
            <Phone className="w-4 h-4" />
            Call Us Now
          </a>

          <a
            href={`https://wa.me/91${phone}?text=${encodeURIComponent(whatsappMessage)}`}
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
