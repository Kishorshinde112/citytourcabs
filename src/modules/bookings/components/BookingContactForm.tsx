'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '@/store/settingsStore';
import useBookingsStore from '@/store/bookingsStore';
import { displayIndianPhone, telHref } from '@/lib/phone';
import { getStoredGclid } from '@/shared/lib/gclid';

const TOUR_PACKAGES_MAP: Record<string, string[]> = {
  'Mumbai Darshan': [
    '8hrs 80 kms',
    '10hrs 100 kms',
    '12hrs 120 kms',
  ],
  'Lonavala Trip': [
    'Lonavala sameday return',
    'Lonavala 2D/1N',
  ],
  'Alibaug Sightseeing': [
    'Alibaug sameday return',
    'Alibaug 2D/1N',
  ],
  'Matheran Sightseeing': [
    'Matheran sameday return',
    'Matheran 2D/1N',
  ],
  'Shirdi Tour': [
    'Shirdi sameday return',
    'Shirdi 2D/1N',
  ],
  'Mahabaleshwar Sightseeing': [
    'Mahabaleshwar 2D/1N',
    'Mahabaleshwar 3D/2N',
  ],
  'Igatpuri Tour': [
    'Igatpuri sameday return',
    'Igatpuri 2D/1N',
  ],
  'Ashtavinayak': [
    'Ashtavinayak 3D/2N',
    'Ashtavinayak 4D/3N',
  ],
  '3 Jyotirlinga in Maharashtra': [
    'Trimbakeshwar, Bhimashankar & Grishneshwar 3D/2N',
    '3 Jyotirlinga 4D/3N',
  ],
  'Konkan Darshan': [
    'Konkan 3D/2N',
    'Konkan 4D/3N',
  ],
};

const DEFAULT_DESTINATIONS = Object.keys(TOUR_PACKAGES_MAP);

export default function BookingContactForm({
  title = 'Get In Touch',
  subtitle = 'Ready to book your tour? Fill out the form and our team will get back to you shortly to confirm your booking',
  initialDestinations = null,
}: {
  title?: string;
  subtitle?: string;
  initialDestinations?: string[] | null;
}) {
  const router = useRouter();
  const { phone, email, officeAddress, workingHours } = useSiteSettings();
  const { addBooking } = useBookingsStore();

  const hasInitialDestinations = Array.isArray(initialDestinations) && initialDestinations.length > 0;
  const [destinations, setDestinations] = useState<string[]>(
    hasInitialDestinations ? initialDestinations! : DEFAULT_DESTINATIONS
  );
  const [formData, setFormData] = useState({
    destination: '',
    packageName: '',
    fullName: '',
    phoneNumber: '',
    travelDate: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [minTravelDate, setMinTravelDate] = useState('');
  const submittingRef = useRef(false);

  useEffect(() => {
    setMinTravelDate(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (hasInitialDestinations) return;

    let isMounted = true;
    async function fetchTours() {
      try {
        const res = await fetch('/api/tours');
        if (res.ok) {
          const data = await res.json();
          const docs = Array.isArray(data.docs) ? data.docs : (Array.isArray(data.tours) ? data.tours : []);
          if (isMounted && docs.length > 0) {
            setDestinations(docs.map((t: any) => t.title));
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchTours();
    return () => {
      isMounted = false;
    };
  }, [hasInitialDestinations]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dest = e.target.value;
    const pkgs = dest ? (TOUR_PACKAGES_MAP[dest] || ['Standard Package']) : [];
    setFormData((prev) => ({
      ...prev,
      destination: dest,
      packageName: pkgs.length === 1 ? pkgs[0] : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');

    if (!formData.destination) {
      setError('Please select a destination.');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = formData.phoneNumber.trim().replace(/[^0-9+]/g, '');
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Please enter a valid phone number with country code (7 to 15 digits).');
      return;
    }
    if (!formData.travelDate) {
      setError('Please select your travel date.');
      return;
    }

    const storedGclid = getStoredGclid();

    const bookingPayload = {
      name: formData.fullName.trim(),
      phone: cleanPhone,
      contact: cleanPhone,
      whatsapp: cleanPhone,
      route: `${formData.destination}${formData.packageName ? ` - ${formData.packageName}` : ''}`,
      tourName: formData.destination,
      vehicle: 'Tour Vehicle',
      carType: 'Tour Vehicle',
      date: formData.travelDate || new Date().toISOString().slice(0, 10),
      travelDate: formData.travelDate || new Date().toISOString().slice(0, 10),
      pickup_address: 'Customer Doorstep',
      passengers: '4',
      type: 'Inquiry',
      status: 'Pending',
      ...(storedGclid ? { gclid: storedGclid } : {}),
    };

    let inquiryId;
    submittingRef.current = true;
    try {
      const result = await addBooking(bookingPayload);
      inquiryId = result.booking.id;
      setSubmitted(true);
    } catch (err) {
      submittingRef.current = false;
      setSubmitted(false);
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      return;
    }

    try {
      sessionStorage.setItem(
        'last_booking',
        JSON.stringify({
          id: inquiryId,
          name: formData.fullName.trim(),
          contact: cleanPhone,
          phone: cleanPhone,
          tourName: `${formData.destination} - ${formData.packageName}`,
          travelDate: formData.travelDate || new Date().toISOString().slice(0, 10),
          carType: 'Tour Vehicle',
          pickupLocation: 'Customer Doorstep',
          type: 'Enquiry',
        })
      );
    } catch {}

    router.push('/enquiry-confirmed');
  };

  const currentPackages = formData.destination
    ? TOUR_PACKAGES_MAP[formData.destination] || ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms']
    : ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'];

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50 text-gray-900">
      <span id="booking-form" className="block scroll-mt-24" aria-hidden="true" />
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold font-display text-gray-900">
            {title || 'Get In Touch'}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Info Box */}
            <div className="bg-blue-50 rounded-lg p-8 md:p-10">
              <h3 className="mb-6 font-bold text-2xl font-display text-gray-900">
                Contact Information
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed">
                We&apos;re here to help make your journey memorable. Reach out to us through any of the following channels, and our team will assist you with your tour booking.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0F6EB8] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Phone className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Phone Number</p>
                    <a
                      href={telHref(phone)}
                      className="text-gray-900 hover:text-[#0F6EB8] transition-colors font-semibold"
                    >
                      {displayIndianPhone(phone)}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0F6EB8] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Mail className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Email Address</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-900 hover:text-[#0F6EB8] transition-colors break-all font-semibold"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0F6EB8] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">
                      {officeAddress || 'Office No 1102 P2 Kanjurmarg east, Mumbai 400042'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-200">
                <h3 className="mb-4 font-bold text-lg font-display text-gray-900">Operating Hours</h3>
                <div className="space-y-2 text-gray-700 font-medium">
                  {workingHours || '24/7 Available (Open All 365 Days)'}
                </div>
              </div>
            </div>

            {/* Right: Booking Inquiry Form */}
            <div>
              {submitted ? (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center space-y-4 shadow-sm">
                  <CheckCircle2 className="w-16 h-16 text-emerald-700 mx-auto" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-900 font-display">
                    Thank You!
                  </h3>
                  <p className="text-gray-700 text-sm max-w-md mx-auto">
                    Your inquiry has been received. Our team will contact you shortly to coordinate your booking.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md">
                      {error}
                    </div>
                  )}

                  {/* Destination */}
                  <div className="space-y-2">
                    <label htmlFor="booking-destination" className="block text-sm font-medium text-gray-800">
                      Destination *
                    </label>
                    <select
                      id="booking-destination"
                      name="destination"
                      required
                      value={formData.destination}
                      onChange={handleDestinationChange}
                      className="w-full bg-white border border-gray-400 focus:border-[#0F6EB8] rounded-md px-3 h-12 text-sm text-gray-900 outline-none transition-colors"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((dest, idx) => (
                        <option key={idx} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Package */}
                  <div className="space-y-2">
                    <label htmlFor="booking-package" className="block text-sm font-medium text-gray-800">
                      Package
                    </label>
                    <select
                      id="booking-package"
                      name="package"
                      value={formData.packageName}
                      onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#0F6EB8] rounded-md px-3 h-12 text-sm text-gray-900 outline-none transition-colors"
                    >
                      <option value="">Select Package</option>
                      {currentPackages.map((pkg, idx) => (
                        <option key={idx} value={pkg}>
                          {pkg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="booking-full-name" className="block text-sm font-medium text-gray-800">
                      Full Name *
                    </label>
                    <input
                      id="booking-full-name"
                      name="fullName"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#0F6EB8] rounded-md px-3 h-12 text-sm text-gray-900 placeholder:text-gray-600 outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-800">
                      Phone Number *
                    </label>
                    <input
                      id="booking-phone"
                      name="phoneNumber"
                      type="tel"
                      required
                      maxLength={20}
                      placeholder="Enter phone number with country code (e.g. +91 9876543210)"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#0F6EB8] rounded-md px-3 h-12 text-sm text-gray-900 placeholder:text-gray-600 outline-none transition-colors"
                    />
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label htmlFor="booking-travel-date" className="block text-sm font-medium text-gray-800">
                      Travel Date *
                    </label>
                    <input
                      id="booking-travel-date"
                      name="travelDate"
                      type="date"
                      required
                      min={minTravelDate || undefined}
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#0F6EB8] rounded-md px-3 h-12 text-sm text-gray-900 outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold h-12 rounded-md text-base transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
