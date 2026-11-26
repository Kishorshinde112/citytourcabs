'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '@/store/settingsStore';
import { displayIndianPhone } from '@/lib/phone';

export default function PrivacyModal({ isOpen, onClose }) {
  const { phone, email } = useSiteSettings();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8">

        <button
          type="button"
          onClick={onClose}
          aria-label="Close privacy policy dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Trust &amp; Transparency</span>
        </div>

        <h2 id="privacy-modal-title" className="text-2xl font-black font-display text-slate-900 mb-4">
          Privacy Policy &amp; Booking Terms
        </h2>

        <div className="max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 pr-2">
          <div>
            <h3 className="font-bold text-slate-900">1. Information Collection</h3>
            <p>We collect your name, contact phone number, and pickup location strictly for vehicle allotment, dispatch coordination, and GST tax invoice generation. We never share your data with third-party telemarketers.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">2. Driver &amp; Passenger Safety</h3>
            <p>All vehicles are commercially licensed with valid commercial passenger insurance. All chauffeurs undergo mandatory background checks, commercial license verification, and safety training.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">3. Tolls, Parking &amp; Inter-State Taxes</h3>
            <p>Base fares include vehicle rental, fuel, and driver daily allowance. Fastag toll plaza charges, state border entry taxes (if applicable), and hotel/monument parking charges are payable on actual receipts.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">4. Cancellation &amp; Refund Policy</h3>
            <p>Local &amp; city tour bookings can be cancelled or rescheduled up to 6 hours prior without fee. Outstation bookings cancelled less than 12 hours prior to departure attract a nominal ₹500 token charge.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">5. Contact Information</h3>
            <p>For any inquiries or grievances, contact our grievance officer at <strong>{email}</strong> or call <strong>{displayIndianPhone(phone)}</strong>.</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>

      </div>
    </div>
  );
}
