import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';
import useBookingsStore from '../store/bookingsStore';

export default function BookingContactForm() {
  const { phone, email } = useSettingsStore();
  const { addBooking } = useBookingsStore();

  const tourPackagesMap = {
    "Mumbai Darshan": ["South Mumbai Heritage Tour", "Suburban Bollywood & Beach Tour", "Full City 8-Hour Tour", "Custom Mumbai Darshan"],
    "Lonavala Trip": ["Lonavala 1-Day Tour", "Lonavala & Khandala 2-Days", "Weekend Hills Getaway"],
    "Alibaug Sightseeing": ["Alibaug Coastal Sightseeing", "Kashid & Murud Beach Tour", "Alibaug 2-Days Family Trip"],
    "Matheran Sightseeing": ["Matheran Eco-Station Day Trip", "Matheran Peace Tour"],
    "Shirdi Tour": ["Shirdi 1-Day Darshan", "Shirdi & Shani Shingnapur", "Shirdi 2-Days Pilgrimage"],
    "Mahabaleshwar Sightseeing": ["Mahabaleshwar & Panchgani 2-Days", "Scenic Points & Lake Tour"],
    "Igatpuri Tour": ["Igatpuri Nature & Waterfall Tour", "Igatpuri Weekend Retreat"],
    "Ashtavinayak": ["8 Ganesha Temples 2-Days Yatra", "Ashtavinayak 3-Days Complete Pilgrimage"],
    "3 Jyotirlinga in Maharashtra": ["Trimbakeshwar, Bhimashankar & Grishneshwar 3-Days Tour", "Jyotirlinga Fast-Track Yatra"],
    "Konkan Darshan": ["Coastal Konkan 3-Days Tour", "Konkan Beaches & Forts Experience"]
  };

  const [formData, setFormData] = useState({
    destination: 'Mumbai Darshan',
    packageName: 'South Mumbai Heritage Tour',
    fullName: '',
    phoneNumber: '',
    travelDate: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleDestinationChange = (e) => {
    const dest = e.target.value;
    const pkgs = tourPackagesMap[dest] || ["Standard Package"];
    setFormData({
      ...formData,
      destination: dest,
      packageName: pkgs[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Save inquiry to Admin Dashboard & backend SQLite
    addBooking({
      name: formData.fullName,
      phone: formData.phoneNumber,
      contact: formData.phoneNumber,
      route: `${formData.destination} - ${formData.packageName}`,
      tourName: formData.destination,
      vehicle: formData.packageName,
      carType: 'Tour Cab',
      date: formData.travelDate || new Date().toISOString().slice(0, 10),
      travelDate: formData.travelDate || new Date().toISOString().slice(0, 10),
      passengers: '4'
    });

    // Also coordinate with WhatsApp
    const text = `*🚖 City Tour Cabs - Booking Inquiry*\n\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Phone:* ${formData.phoneNumber}\n` +
      `*Destination:* ${formData.destination}\n` +
      `*Package:* ${formData.packageName}\n` +
      `*Travel Date:* ${formData.travelDate}\n\n` +
      `Please confirm availability and share fare quotation.`;

    setTimeout(() => {
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
    }, 600);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold font-display text-gray-900">
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
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <a href={`tel:+91${phone}`} className="text-gray-900 hover:text-[#1A96EB] transition-colors font-medium">
                      +91 {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <a href={`mailto:${email}`} className="text-gray-900 hover:text-[#1A96EB] transition-colors break-all font-medium">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgb(26,150,235)] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900 font-medium">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-200">
                <h3 className="mb-4 font-bold text-lg font-display text-gray-900">Operating Hours</h3>
                <div className="space-y-2 text-gray-700 font-medium">24 x 7</div>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  
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
                      <option value="Mumbai Darshan">Mumbai Darshan</option>
                      <option value="Lonavala Trip">Lonavala Trip</option>
                      <option value="Alibaug Sightseeing">Alibaug Sightseeing</option>
                      <option value="Matheran Sightseeing">Matheran Sightseeing</option>
                      <option value="Shirdi Tour">Shirdi Tour</option>
                      <option value="Mahabaleshwar Sightseeing">Mahabaleshwar Sightseeing</option>
                      <option value="Igatpuri Tour">Igatpuri Tour</option>
                      <option value="Ashtavinayak">Ashtavinayak</option>
                      <option value="3 Jyotirlinga in Maharashtra">3 Jyotirlinga in Maharashtra</option>
                      <option value="Konkan Darshan">Konkan Darshan</option>
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
                      {(tourPackagesMap[formData.destination] || ["Standard Package"]).map((pkg, idx) => (
                        <option key={idx} value={pkg}>{pkg}</option>
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
                    className="w-full bg-[#1A96EB] hover:bg-[#1578BC] text-white font-medium h-10 rounded-md text-sm transition-all cursor-pointer shadow-sm"
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
