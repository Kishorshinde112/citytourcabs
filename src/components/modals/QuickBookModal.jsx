'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import useSettingsStore from '@/store/settingsStore';
import useBookingsStore from '@/store/bookingsStore';

const DEFAULT_DESTINATIONS = [
  'Mumbai Darshan',
  'Lonavala Trip',
  'Alibaug Sightseeing',
  'Matheran Sightseeing',
  'Shirdi Tour',
  'Mahabaleshwar Sightseeing',
  'Igatpuri Tour',
  'Ashtavinayak',
  '3 Jyotirlinga in Maharashtra',
  'Konkan Darshan',
];

const TOUR_PACKAGES_MAP = {
  'Mumbai Darshan': [
    '8hrs 80 kms',
    '10hrs 100 kms',
    '12hrs 120 kms',
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

const CAR_TYPES = [
  'Wagon R (Hatchback 4+1)',
  'Swift Dzire (Sedan 4+1)',
  'Maruti Ertiga (MUV 6+1)',
  'Kia Carens (MUV 7+1)',
  'Toyota Innova Crysta (Luxury 7+1)',
  'Tempo Traveller (13/17/26 Seater)',
];

const PASSENGER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8+'];

const getTodayString = () => new Date().toISOString().split('T')[0];

export default function QuickBookModal({ isOpen, onClose, initialData = {} }) {
  const router = useRouter();
  const { phone: supportPhone } = useSettingsStore();
  const { addBooking } = useBookingsStore();

  const isEnquiry = Boolean(initialData.isEnquiry || initialData.type === 'Inquiry');

  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [destination, setDestination] = useState('');
  const [packageName, setPackageName] = useState('');
  const [carType, setCarType] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [passengers, setPassengers] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch dynamic tours from API
  useEffect(() => {
    let isMounted = true;
    async function loadTours() {
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
        // Fallback to DEFAULT_DESTINATIONS
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      setLoading(false);

      const targetDest =
        initialData.destination ||
        initialData.tourName ||
        initialData.title ||
        initialData.drop ||
        '';
      setDestination(targetDest);

      const availablePackages = targetDest
        ? (TOUR_PACKAGES_MAP[targetDest] || ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'])
        : ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'];
      setPackageName(initialData.packageName || initialData.package || (availablePackages.length === 1 ? availablePackages[0] : ''));

      setCarType(initialData.carType || initialData.vehicle || '');
      setFullName(initialData.fullName || initialData.name || '');
      setPhoneNumber(initialData.phoneNumber || initialData.phone || initialData.contact || '');
      setWhatsappNumber(initialData.whatsappNumber || initialData.whatsapp || '');
      setPassengers(initialData.passengers || '');
      setTravelDate(initialData.travelDate || initialData.date || '');
      setPickupTime(initialData.pickupTime || '');
      setPickupAddress(initialData.pickupAddress || initialData.pickupLocation || '');
      setSpecialRequirements(initialData.specialRequirements || initialData.message || '');
    }
  }, [isOpen, initialData]);

  // Handle destination change & update package options
  const handleDestinationChange = (e) => {
    const newDest = e.target.value;
    setDestination(newDest);
    const pkgs = newDest
      ? (TOUR_PACKAGES_MAP[newDest] || ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'])
      : ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'];
    setPackageName(pkgs.length === 1 ? pkgs[0] : '');
  };

  if (!isOpen) return null;

  const currentPackages = TOUR_PACKAGES_MAP[destination] || ['8hrs 80 kms', '10hrs 100 kms', '12hrs 120 kms'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!destination) {
      setError('Please select a destination.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = phoneNumber.trim().replace(/[^0-9+]/g, '');
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Please enter a valid phone number with country code (7 to 15 digits).');
      return;
    }
    if (!travelDate) {
      setError('Please select your travel date.');
      return;
    }
    if (!isEnquiry && !carType) {
      setError('Please select a car type.');
      return;
    }
    if (!isEnquiry && !pickupAddress.trim()) {
      setError('Please enter your pickup address.');
      return;
    }

    setLoading(true);

    const cleanWhatsapp = whatsappNumber.trim().replace(/[^0-9+]/g, '');

    const bookingPayload = {
      name: fullName.trim(),
      phone: cleanPhone,
      whatsapp: cleanWhatsapp || cleanPhone,
      route: `${destination}${packageName ? ` - ${packageName}` : ''}`,
      tourName: destination,
      vehicle: carType || 'Tour Vehicle',
      carType: carType || 'Tour Vehicle',
      date: travelDate,
      travelDate: travelDate,
      pickup_time: pickupTime,
      pickup_address: pickupAddress.trim() || 'Customer Doorstep',
      passengers: passengers,
      special_requirements: specialRequirements.trim(),
      type: isEnquiry ? 'Enquiry' : 'Booking',
      status: 'Pending',
    };

    try {
      // 1. Save to SQLite DB & Admin (server automatically forwards to internal n8n)
      const result = await addBooking(bookingPayload);
      const refId = result.booking.id;
      try {
        sessionStorage.setItem(
          'last_booking',
          JSON.stringify({
            id: refId,
            name: fullName.trim(),
            contact: cleanPhone,
            phone: cleanPhone,
            pickupLocation: pickupAddress.trim() || 'Customer Doorstep',
            tourName: `${destination}${packageName ? ` - ${packageName}` : ''}`,
            travelDate: travelDate,
            carType: carType,
            type: isEnquiry ? 'Enquiry' : 'Booking',
          })
        );
      } catch { }

      setSuccess(true);

      // Close modal and redirect
      setTimeout(() => {
        onClose();
        router.push(
          isEnquiry
            ? `/enquiry-confirmed?id=${refId}`
            : `/booking-confirmed?id=${refId}`
        );
      }, 700);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Submission failed. Please try again or call us directly.');
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
    >

      <div
        className={`relative bg-white rounded-xl w-full ${isEnquiry
            ? 'max-w-[420px] p-6'
            : 'max-w-2xl p-6 sm:p-8'
          } max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-auto`}
      >

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          {isEnquiry ? (
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-1 leading-snug">
                Get 5% to 10% Discount and free Tour ITINERARY on your first ride
              </h2>
              <p className="text-base font-semibold text-slate-800">
                Submit your Enquiry Now!
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold font-[Reddit_Sans] text-slate-900 leading-tight">
                Book Your Tour Now
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and our team will get back to you shortly to confirm your booking.
              </p>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Booking confirmed! Redirecting to confirmation page...</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* 1. Destination Field */}
          <div>
            <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 mb-1">
              Destination <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="destination"
                name="destination"
                required
                value={destination}
                onChange={handleDestinationChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none cursor-pointer text-slate-900"
              >
                <option value="">Select Destination</option>
                {destinations.map((dest, idx) => (
                  <option key={idx} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Package & Car Type (2 Columns) */}
          {!isEnquiry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Package Dropdown */}
              <div>
                <label htmlFor="package" className="block text-xs font-semibold text-slate-700 mb-1">
                  Package
                </label>
                <div className="relative">
                  <select
                    id="package"
                    name="package"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none cursor-pointer text-slate-900"
                  >
                    <option value="">Select Package</option>
                    {currentPackages.map((pkg, idx) => (
                      <option key={idx} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Car Type Dropdown */}
              <div>
                <label htmlFor="carType" className="block text-xs font-semibold text-slate-700 mb-1">
                  Car Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="carType"
                    name="carType"
                    required
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none cursor-pointer text-slate-900"
                  >
                    <option value="">Select Car Type</option>
                    {CAR_TYPES.map((car, idx) => (
                      <option key={idx} value={car}>
                        {car}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* 4. Phone & WhatsApp */}
          {isEnquiry ? (
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                maxLength={20}
                placeholder="Enter phone number with country code (e.g. +91 9876543210)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  maxLength={20}
                  placeholder="Enter phone number (e.g. +91 9876543210)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                  Whatsapp Number
                </label>
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  maxLength={20}
                  placeholder="WhatsApp number with country code"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400"
                />
                <span className="block text-[11px] text-slate-400 mt-1">To share driver details</span>
              </div>
            </div>
          )}

          {/* 5. Passengers & Date & Time (for Full Booking) */}
          {!isEnquiry && (
            <div>
              <label htmlFor="passengers" className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Passengers <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="passengers"
                  name="passengers"
                  required
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none cursor-pointer text-slate-900"
                >
                  <option value="">Select Passengers</option>
                  {PASSENGER_OPTIONS.map((count) => (
                    <option key={count} value={count}>
                      {count} {count === '1' ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* 6. Travel Date & Pickup Time */}
          {isEnquiry ? (
            <div>
              <label htmlFor="travelDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Travel Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="travelDate"
                name="travelDate"
                type="date"
                required
                min={getTodayString()}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 cursor-pointer"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="travelDate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="travelDate"
                  name="travelDate"
                  type="date"
                  required
                  min={getTodayString()}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="pickupTime" className="block text-xs font-semibold text-slate-700 mb-1">
                  Pickup Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="pickupTime"
                  name="pickupTime"
                  type="time"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 7. Pickup Address & Special Requirements */}
          {!isEnquiry && (
            <>
              <div>
                <label htmlFor="pickupAddress" className="block text-xs font-semibold text-slate-700 mb-1">
                  Pickup Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="pickupAddress"
                  name="pickupAddress"
                  type="text"
                  required
                  placeholder="Enter your pickup address (Hotel / Airport / Home)"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="specialRequirements" className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requirements (Optional)
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  rows={3}
                  placeholder="Any special requests or requirements for your tour..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-slate-900 placeholder:text-slate-400 leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm hover:shadow transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : isEnquiry ? 'Submit Enquiry' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
