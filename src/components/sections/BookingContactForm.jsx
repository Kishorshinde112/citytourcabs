'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import useBookingsStore from '@/store/bookingsStore';

const TOUR_PACKAGES_MAP = {
  'Mumbai Darshan': [
    'South Mumbai Heritage Tour (8 Hours / 80 Km)',
    'Suburban Bollywood & Beach Tour (10 Hours / 100 Km)',
    'Full City Complete Darshan (12 Hours / 120 Km)',
    'Custom Mumbai Darshan Plan',
  ],
  'Lonavala Trip': [
    'Lonavala 1-Day Sightseeing Tour',
    'Lonavala & Khandala 2-Days Tour',
    'Weekend Hills Scenic Tour',
  ],
  'Alibaug Sightseeing': [
    'Alibaug Coastal Sightseeing (1 Day)',
    'Kashid Beach & Murud Janjira (2 Days)',
    'Alibaug Family Getaway',
  ],
  'Matheran Sightseeing': [
    'Matheran Eco-Station Day Trip',
    'Matheran Nature & Sunset Tour',
  ],
  'Shirdi Tour': [
    'Shirdi 1-Day Express Darshan',
    'Shirdi & Shani Shingnapur (2 Days)',
    'Shirdi Complete Pilgrimage',
  ],
  'Mahabaleshwar Sightseeing': [
    'Mahabaleshwar & Panchgani (2 Days)',
    'Scenic Points & Venna Lake Tour',
  ],
  'Igatpuri Tour': [
    'Igatpuri Nature & Waterfall Tour (1 Day)',
    'Igatpuri Weekend Retreat (2 Days)',
  ],
  'Ashtavinayak': [
    'Ashtavinayak 2-Days Yatra (8 Ganesha Temples)',
    'Ashtavinayak 3-Days Complete Pilgrimage',
  ],
  '3 Jyotirlinga in Maharashtra': [
    'Trimbakeshwar, Bhimashankar & Grishneshwar 3-Days Tour',
    'Jyotirlinga Fast-Track Yatra',
  ],
  'Konkan Darshan': [
    'Coastal Konkan 3-Days Tour',
    'Konkan Beaches, Forts & Temples (4 Days)',
  ],
};

const DEFAULT_DESTINATIONS = Object.keys(TOUR_PACKAGES_MAP);

export default function BookingContactForm() {
  const router = useRouter();
  const { phone, email } = useSettingsStore();
  const { addBooking } = useBookingsStore();

  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [formData, setFormData] = useState({
    destination: 'Mumbai Darshan',
    packageName: TOUR_PACKAGES_MAP['Mumbai Darshan'][0],
    fullName: '',
    phoneNumber: '',
    travelDate: new Date().toISOString().split('T')[0],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchTours() {
      try {
        const res = await fetch('/api/tours');
        if (res.ok) {
          const data = await res.json();
          const docs = Array.isArray(data.docs) ? data.docs : (Array.isArray(data.tours) ? data.tours : []);
          if (isMounted && docs.length > 0) {
            setDestinations(docs.map((t) => t.title));
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    fetchTours();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDestinationChange = (e) => {
    const dest = e.target.value;
    const pkgs = TOUR_PACKAGES_MAP[dest] || ['Standard Package'];
    setFormData((prev) => ({
      ...prev,
      destination: dest,
      packageName: pkgs[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitted(true);

    const inquiryId = 'INQ-' + Math.floor(100000 + Math.random() * 900000);

    const bookingPayload = {
      id: inquiryId,
      name: formData.fullName.trim(),
      phone: cleanPhone,
      contact: cleanPhone,
      whatsapp: cleanPhone,
      route: `${formData.destination} - ${formData.packageName}`,
      tourName: formData.destination,
      vehicle: 'Tour Vehicle',
      carType: 'Tour Vehicle',
      date: formData.travelDate || new Date().toISOString().slice(0, 10),
      travelDate: formData.travelDate || new Date().toISOString().slice(0, 10),
      pickup_address: 'Customer Doorstep',
      passengers: '4',
      type: 'Inquiry',
      status: 'Pending',
    };

    // Save inquiry to SQLite DB & Admin Dashboard
    await addBooking(bookingPayload);

    // Save to sessionStorage for confirmation page
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
          type: 'Inquiry',
        })
      );
    } catch {}

    // Forward to n8n webhook
    try {
      fetch('https://n8n.kishorlab.dev/webhook/lead-ingestor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      }).catch(() => {});
    } catch (err) {}

    // Redirect to dedicated inquiry confirmed page
    router.push(`/inquiry-confirmed?id=${inquiryId}`);
  };

  const currentPackages = TOUR_PACKAGES_MAP[formData.destination] || ['Standard Package'];

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold font-[Reddit_Sans] text-gray-900">
            Get In Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Ready to book your tour? Fill out the form and our team will get back to you shortly to confirm your booking
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Info Box */}
            <div className="bg-blue-50 rounded-lg p-8 md:p-10">
              <h3 className="mb-6 font-bold text-2xl font-display text-gray-900">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're here to help make your journey memorable. Reach out to us through any of the following channels, and our team will assist you with your tour booking.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 font-medium">Phone Number</p>
                    <a
                      href={`tel:+91${phone}`}
                      className="text-gray-900 hover:text-[#1A96EB] transition-colors font-semibold"
                    >
                      +91 {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 font-medium">Email Address</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-900 hover:text-[#1A96EB] transition-colors break-all font-semibold"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-200">
                <h3 className="mb-4 font-bold text-lg font-display text-gray-900">Operating Hours</h3>
                <div className="space-y-2 text-gray-700 font-medium">24 x 7 Available</div>
              </div>
            </div>

            {/* Right: Booking Inquiry Form */}
            <div>
              {submitted ? (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center space-y-4 shadow-sm">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h4 className="text-2xl font-bold text-gray-900 font-display">
                    Thank You!
                  </h4>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Your inquiry has been received. Opening WhatsApp to coordinate your booking with our team...
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
                    <label className="text-sm font-medium text-gray-700">
                      Destination *
                    </label>
                    <select
                      required
                      value={formData.destination}
                      onChange={handleDestinationChange}
                      className="w-full bg-white border border-gray-400 focus:border-[#1A96EB] rounded-md px-3 h-12 text-sm outline-none transition-colors"
                    >
                      {destinations.map((dest, idx) => (
                        <option key={idx} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Package */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Package *
                    </label>
                    <select
                      required
                      value={formData.packageName}
                      onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#1A96EB] rounded-md px-3 h-12 text-sm outline-none transition-colors"
                    >
                      {currentPackages.map((pkg, idx) => (
                        <option key={idx} value={pkg}>
                          {pkg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#1A96EB] rounded-md px-3 h-12 text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#1A96EB] rounded-md px-3 h-12 text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full bg-white border border-gray-400 focus:border-[#1A96EB] rounded-md px-3 h-12 text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium h-12 rounded-md text-base transition-all cursor-pointer shadow-sm hover:shadow"
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
