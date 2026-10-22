'use client';

import React from 'react';
import { Phone, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useBooking } from '@/components/booking/BookingContext';
import useSettingsStore from '@/store/settingsStore';
import ScrollReveal from '@/components/common/ScrollReveal';

interface HighlightSpot {
  name: string;
  desc: string;
}

const TOUR_HIGHLIGHTS: HighlightSpot[] = [
  { name: 'Gateway of India', desc: 'Historic 20th-century monument overlooking the Arabian Sea' },
  { name: 'Taj Mahal Palace Hotel', desc: 'Legendary luxury hotel with iconic heritage architecture' },
  { name: 'Marine Drive', desc: "Queen's Necklace promenade with stunning seaside views" },
  { name: 'Girgaon Chowpatty Viewing Deck', desc: 'Famous beach known for Mumbai street food and scenic sunset' },
  { name: 'Kamla Nehru Park', desc: "Lush park on Malabar Hill with the Old Woman's Shoe" },
  { name: 'Hanging Gardens', desc: 'Terraced gardens perched at the top of Malabar Hill' },
  { name: 'Taraporewala Aquarium', desc: "India's oldest aquarium featuring marine life" },
  { name: 'Chhatrapati Shivaji Maharaj Museum', desc: 'Premier art and history museum in Mumbai' },
  { name: 'Flora Fountain', desc: 'Historic architectural landmark at Hutatma Chowk' },
  { name: 'Elephanta Caves', desc: 'Ancient rock-cut cave temples on Elephanta Island' },
  { name: 'Haji Ali Dargah', desc: 'Iconic mosque and tomb situated on an islet in Worli Bay' },
  { name: 'Mahalaxmi Temple', desc: 'Celebrated Hindu temple dedicated to Goddess Lakshmi' },
  { name: 'Mahalaxmi Racecourse', desc: 'Historic horse-racing track spanning 225 acres' },
  { name: 'Chhatrapati Shivaji Maharaj Terminus', desc: 'UNESCO World Heritage railway terminus' },
  { name: 'Colaba Causeway', desc: 'Vibrant street shopping hub with cafes and boutiques' },
  { name: 'Worli Sea Face', desc: 'Picturesque coastal promenade with waves crashing on rocks' },
  { name: 'Nehru Planetarium Science Centre', desc: 'Famous astronomical and interactive science museum' },
  { name: 'Siddhivinayak Temple', desc: 'Renowned temple dedicated to Lord Shri Ganesha' },
  { name: 'Bandra-Worli Sea Link', desc: 'Modern 8-lane cable-stayed bridge spanning Mahim Bay' },
  { name: 'Bandra Bandstand', desc: 'Celebrity residences and scenic rocky shoreline walk' },
  { name: 'Mount Mary Basilica', desc: 'Centuries-old Roman Catholic basilica in Bandra' },
  { name: 'Juhu Beach', desc: 'Sprawling sandy beach famous for sunsets and Mumbai snacks' },
  { name: 'ISKCON Temple, Juhu', desc: 'Grand spiritual complex dedicated to Lord Krishna' }
];

const RULES_LIST = [
  'Toll parking and entry tickets are not included in the car hire charges',
  '(Flexible pick-up timing and doorstep pick up)',
  'You can add or skip places of your choice.',
  'You can take your own time at each spot.',
  'Cancellation charge of Rs 500/- will be applicable if the booking is Cancelled after arrival of driver',
  'Night Allowance of Rs.500/- will be applicable after 11pm (Only for Tempo Traveller)',
  'All bookings are charged for the full package duration. For eg, if you book 8 hours and 80 km, even if you return the car in 6 hrs, you still must pay for the full 8 you booked (Applicable on all packages)',
  'Time and kilometres are calculated from your pickup point to pickup point (if the drop location is different then extra charges might applicable)'
];

const RATE_CARD_ROWS = [
  { vehicle: 'WagonR', h8: '₹2300', h10: '₹2800', h12: '₹3400', extraKm: '₹12/km', extraHr: '₹120/hr' },
  { vehicle: 'Sedan', h8: '₹2500', h10: '₹3200', h12: '₹3800', extraKm: '₹14/km', extraHr: '₹140/hr' },
  { vehicle: 'Ertiga', h8: '₹3200', h10: '₹3800', h12: '₹4400', extraKm: '₹16/km', extraHr: '₹160/hr' },
  { vehicle: 'Kia Carens', h8: '₹3500', h10: '₹4200', h12: '₹4800', extraKm: '₹18/km', extraHr: '₹180/hr' },
  { vehicle: 'Crysta', h8: '₹3800', h10: '₹4500', h12: '₹5200', extraKm: '₹20/km', extraHr: '₹200/hr' },
];

export default function MumbaiDarshanClient() {
  const { phone } = useSettingsStore();
  const { openBooking, openEnquiry } = useBooking();

  const handleOpenBookModal = (extra = {}) => {
    openBooking({
      dropCity: 'Mumbai Darshan',
      tripType: 'Mumbai Darshan Tour',
      ...extra,
    });
  };

  const scrollToRateCard = () => {
    const el = document.getElementById('rate-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-gray-900 font-sans relative selection:bg-blue-100 selection:text-blue-900">
      <div>
        {/* ================= HERO BANNER ================= */}
        <section className="relative bg-black text-white py-16 sm:py-20 overflow-hidden border-b border-gray-200">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/o0mbamog/image/upload/v1792352358/citytourcabs/assets/tours/mumbai-darshan.jpg')",
            }}
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Mumbai Darshan
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
              Discover Mumbai iconic landmarks with expert local driver-guides!
            </p>
            <div className="pt-3 flex flex-wrap justify-center items-center gap-3">
              <button
                type="button"
                onClick={scrollToRateCard}
                className="px-6 py-2.5 rounded-xl bg-[#0090ff] hover:bg-[#007cdb] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Rate Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/40 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow backdrop-blur-sm"
              >

                <span>Submit Enquiry (Get Discount)</span>
              </button>
              <a
                href={`tel:+91${phone}`}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow backdrop-blur-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= 2-COLUMN MAIN SECTION ================= */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 items-start">

              {/* ================= LEFT COLUMN ================= */}
              <div className="lg:col-span-7 space-y-8">
                <ScrollReveal>
                  {/* 1. Tagline */}
                  <div>
                    <h3 className="text-lg font-bold text-[#2dc26b] flex items-center gap-2">
                      🚗 Get drivers who act as a guide
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      Explore Mumbai's iconic landmarks with expert drivers who know every historic corner, scenic seaside view, and hidden culinary gem.
                    </p>
                    <div className="border-b border-dashed border-gray-300 my-6" />
                  </div>

                  {/* 2. Rules To be Noted */}
                  <div>
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-4">
                      Rules To be Noted
                    </h2>
                    <div className="space-y-3">
                      {RULES_LIST.map((rule, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed"
                        >
                          <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span className={idx === 0 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                            {rule}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-b border-dashed border-gray-300 my-6" />
                  </div>

                  {/* 3. Tour Highlights points to visit */}
                  <div>
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-4">
                      Tour Highlights points to visit
                    </h2>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
                      {TOUR_HIGHLIGHTS.map((spot, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-xl shrink-0 mt-0.5">📍</span>
                          <div>
                            <span className="font-bold text-gray-900 text-sm">
                              {spot.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                              {spot.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* ================= RIGHT COLUMN: STICKY SIDEBAR ================= */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <ScrollReveal delay={0.1}>
                  {/* 1. Rate Card Table */}
                  <div
                    id="rate-card"
                  className="scroll-mt-24 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="bg-[#0090ff] text-white p-4 font-black text-base flex items-center justify-between">
                    <span>Rate Card</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-blue-50/80 text-gray-800 text-[11px] font-extrabold border-t border-blue-200">
                          <th className="p-3 border-r border-gray-200">Vehicle</th>
                          <th className="p-3 text-center border-r border-gray-200">8 Hrs / 80 Kms</th>
                          <th className="p-3 text-center border-r border-gray-200">10 Hrs / 100 Kms</th>
                          <th className="p-3 text-center border-r border-gray-200">12 Hrs / 120 Kms</th>
                          <th className="p-3 text-center">Extra Kms / Extra Hrs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
                        {RATE_CARD_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition">
                            <td className="p-3 font-bold border-r border-gray-200 text-gray-900">
                              {row.vehicle}
                            </td>
                            <td className="p-3 text-center border-r border-gray-200 font-medium">
                              {row.h8}
                            </td>
                            <td className="p-3 text-center border-r border-gray-200 font-medium">
                              {row.h10}
                            </td>
                            <td className="p-3 text-center border-r border-gray-200 font-medium">
                              {row.h12}
                            </td>
                            <td className="p-3 text-center text-[11px] whitespace-pre-line text-gray-500">
                              <div>{row.extraKm}</div>
                              <div>{row.extraHr}</div>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50/70">
                          <td className="p-3 font-bold border-r border-gray-200 text-gray-900">
                            13 Seater A/C Traveller
                          </td>
                          <td colSpan={4} className="p-3 text-center font-semibold text-gray-700">
                            Full Day Mumbai Darshan ( 12 hrs 100 kms ) ={' '}
                            <span className="text-gray-900 font-bold">Rs.8500/-</span>
                          </td>
                        </tr>
                        <tr className="bg-gray-50/70">
                          <td className="p-3 font-bold border-r border-gray-200 text-gray-900">
                            17 Seater A/C Traveller
                          </td>
                          <td colSpan={4} className="p-3 text-center font-semibold text-gray-700">
                            Full Day Mumbai Darshan ( 12 hrs 100 kms ) ={' '}
                            <span className="text-gray-900 font-bold">Rs.9500/-</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Package Coverage Details Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 text-xs text-gray-700 space-y-2 leading-relaxed shadow-sm">
                  <div className="font-bold text-gray-900 text-sm mb-1">
                    Package Coverage Details
                  </div>
                  <div className="whitespace-pre-line text-gray-600 space-y-1">
                    <p>In the 8 Hrs / 80 Kms package, around 8–10 places can be covered.</p>
                    <p>In the 10 Hrs / 100 Kms package, around 10–12 places can be covered.</p>
                    <p>In the 12 Hrs / 120 Kms package, around 14 or more places can be covered.</p>
                    <p>For Tempo Traveller only ( 12 hrs 100 kms ) packages are available.</p>
                    <p className="text-gray-400 text-[11px] pt-1">
                      (The mentioned numbers may vary depending on traffic conditions and time spent at each location.)
                    </p>
                  </div>
                </div>

                {/* 3. Quick Booking Card */}
                <div className="bg-[#fff7ed]/50 rounded-2xl border-2 border-orange-400 p-6 space-y-4 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 flex items-center justify-between">
                    <span>Quick Booking</span>
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-extrabold">
                      Instant
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Get instant driver &amp; cab confirmation for your Mumbai Darshan
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenBookModal({ dropCity: 'Mumbai Darshan' })}
                    className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-lg shadow-orange-500/20 transition cursor-pointer"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={() => openEnquiry()}
                    className="w-full py-3 rounded-xl bg-white hover:bg-orange-50 text-orange-600 border border-orange-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Submit Enquiry Now</span>
                  </button>
                  <div className="pt-2 text-xs text-gray-600 flex items-center justify-between border-t border-orange-200/70">
                    <span>Or call us directly:</span>
                    <a
                      href={`tel:+91${phone}`}
                      className="font-bold text-[#0090ff] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0090ff]" />
                      <span>+91 {phone}</span>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
