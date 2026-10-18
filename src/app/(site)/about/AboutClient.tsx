'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import QuickBookModal from "@/components/QuickBookModal";
import PrivacyModal from "@/components/PrivacyModal";
import AutoEnquiryModal from "@/components/AutoEnquiryModal";
import BookingContactForm from "@/components/BookingContactForm";
import useSettingsStore from "@/store/settingsStore";

export default function AboutClient() {
  const { phone } = useSettingsStore();
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  const [aboutData, setAboutData] = useState({
    heroTitle: "About Us",
    heroSubtitle: "Your trusted local cab partner in Mumbai",
    heroImage: "/assets/about-banner.jpg",
    welcomeTitle: "Welcome to CityTourCabs",
    welcomeDescription: "We make city travel easy, affordable, and comfortable with fast doorstep pickup and drop, reliable service, and friendly professional drivers who truly care about your experience.",
    driverImage: "/assets/about-driver.jpg",
    statsYears: "12+",
    statsCustomers: "50,000+",
    statsCabs: "45+",
    statsCities: "25+",
    missionTitle: "Our Mission",
    missionDescription: "To keep Mumbai moving safely and smoothly",
    fleetDescription: "From economical sedans for city errands to premium SUVs and tempo travellers for family vacations and pilgrimage tours, our fleet is rigorously inspected and sanitized before every single trip.",
  });

  useEffect(() => {
    async function loadAboutPage() {
      try {
        const res = await fetch('/api/pages/about');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.page) {
            const p = data.page;
            setAboutData({
              heroTitle: p.hero?.title || "About Us",
              heroSubtitle: p.hero?.subtitle || "Your trusted local cab partner in Mumbai",
              heroImage: p.hero?.backgroundImage || "/assets/about-banner.jpg",
              welcomeTitle: p.aboutContent?.welcomeTitle || "Welcome to CityTourCabs",
              welcomeDescription: p.aboutContent?.welcomeDescription || "We make city travel easy, affordable, and comfortable with fast doorstep pickup and drop, reliable service, and friendly professional drivers who truly care about your experience.",
              driverImage: p.aboutContent?.driverImage || "/assets/about-driver.jpg",
              statsYears: p.aboutContent?.statsYears || "12+",
              statsCustomers: p.aboutContent?.statsCustomers || "50,000+",
              statsCabs: p.aboutContent?.statsCabs || "45+",
              statsCities: p.aboutContent?.statsCities || "25+",
              missionTitle: p.aboutContent?.missionTitle || "Our Mission",
              missionDescription: p.aboutContent?.missionDescription || "To keep Mumbai moving safely and smoothly",
              fleetDescription: p.aboutContent?.fleetDescription || "From economical sedans for city errands to premium SUVs and tempo travellers for family vacations and pilgrimage tours, our fleet is rigorously inspected and sanitized before every single trip.",
            });
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadAboutPage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBookModalOpen((current) => {
        if (!current) setAutoEnquiryOpen(true);
        return current;
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenBookModal = () => {
    setAutoEnquiryOpen(false);
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col pb-14 sm:pb-0">
      {/* Navbar */}
      <Navbar onOpenBookModal={() => handleOpenBookModal()} />

      <main className="flex-1">
        {/* Section 0: Hero Banner */}
        <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={aboutData.heroImage}
              alt={aboutData.heroTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[Reddit_Sans] mb-4 text-white">
              {aboutData.heroTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 max-w-2xl mx-auto">
              {aboutData.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Section 1: Welcome to CityTourCabs */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[Reddit_Sans] text-[rgb(58,128,227)] mb-6">
                {aboutData.welcomeTitle}
              </h2>
              <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                {aboutData.welcomeDescription}
              </p>

              <div className="flex flex-wrap gap-6 justify-center my-8">
                <img
                  src={aboutData.driverImage}
                  alt="Professional driver"
                  className="h-64 sm:h-72 w-full sm:w-[420px] object-cover rounded-2xl shadow-md"
                />
                <img
                  src="/assets/about-cityscape.png"
                  alt="Mumbai cityscape"
                  className="h-64 sm:h-72 w-full sm:w-[420px] object-cover rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="py-16 md:py-24 bg-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-[#fff7ed] p-8 sm:p-12 rounded-2xl border border-orange-100">
                <span className="bg-[#ea580c] text-white px-8 py-3 rounded-full inline-block mb-6 text-lg sm:text-xl font-bold shadow-xs">
                  {aboutData.missionTitle}
                </span>
                <p
                  className="font-handwritten text-3xl sm:text-4xl text-gray-700 mb-6 font-semibold"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  &ldquo;{aboutData.missionDescription}&rdquo;
                </p>
                <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                  Whether you&apos;re heading to work, the airport, or exploring the city, we&apos;re always just a call or WhatsApp message away.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Wide Range of Cars */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold font-[Reddit_Sans] text-center mb-4 text-gray-900">
                Wide Range of Cars
              </h2>
              <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
                Choose from our wide range of cars to match your travel needs — from budget-friendly rides to premium options for extra comfort.
              </p>

              <div className="flex justify-center gap-6 mb-10 flex-wrap">
                {/* Budget-Friendly */}
                <div className="bg-[#f9fbff] border-2 border-[#e0e7ef] rounded-2xl p-6 w-[260px] text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#1A96EB] rounded-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 32V28C18 25.7909 19.7909 24 22 24H34C36.2091 24 38 25.7909 38 28V32M22 36C23.1046 36 24 35.1046 24 34C24 32.8954 23.1046 32 22 32C20.8954 32 20 32.8954 20 34C20 35.1046 20.8954 36 22 36ZM34 36C35.1046 36 36 35.1046 36 34C36 32.8954 35.1046 32 34 32C32.8954 32 32 32.8954 32 34C32 35.1046 32.8954 36 34 36Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-[#1a96eb] mb-2">Budget-Friendly</div>
                  <div className="text-gray-600 text-sm">Economy rides for everyday travel</div>
                </div>

                {/* Sedan */}
                <div className="bg-[#f9fbff] border-2 border-[#e0e7ef] rounded-2xl p-6 w-[260px] text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#1A96EB] rounded-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 32V28C18 25.7909 19.7909 24 22 24H34C36.2091 24 38 25.7909 38 28V32M22 36C23.1046 36 24 35.1046 24 34C24 32.8954 23.1046 32 22 32C20.8954 32 20 32.8954 20 34C20 35.1046 20.8954 36 22 36ZM34 36C35.1046 36 36 35.1046 36 34C36 32.8954 35.1046 32 34 32C32.8954 32 32 32.8954 32 34C32 35.1046 32.8954 36 34 36Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-[#1a96eb] mb-2">Sedan</div>
                  <div className="text-gray-600 text-sm">Comfortable rides for families</div>
                </div>

                {/* SUV */}
                <div className="bg-[#f9fbff] border-2 border-[#e0e7ef] rounded-2xl p-6 w-[260px] text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#1A96EB] rounded-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 32V28C18 25.7909 19.7909 24 22 24H34C36.2091 24 38 25.7909 38 28V32M22 36C23.1046 36 24 35.1046 24 34C24 32.8954 23.1046 32 22 32C20.8954 32 20 32.8954 20 34C20 35.1046 20.8954 36 22 36ZM34 36C35.1046 36 36 35.1046 36 34C36 32.8954 35.1046 32 34 32C32.8954 32 32 32.8954 32 34C32 35.1046 32.8954 36 34 36Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-[#1a96eb] mb-2">SUV</div>
                  <div className="text-gray-600 text-sm">Spacious for groups and luggage</div>
                </div>

                {/* Premium */}
                <div className="bg-[#f9fbff] border-2 border-[#e0e7ef] rounded-2xl p-6 w-[260px] text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#1A96EB] rounded-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 32V28C18 25.7909 19.7909 24 22 24H34C36.2091 24 38 25.7909 38 28V32M22 36C23.1046 36 24 35.1046 24 34C24 32.8954 23.1046 32 22 32C20.8954 32 20 32.8954 20 34C20 35.1046 20.8954 36 22 36ZM34 36C35.1046 36 36 35.1046 36 34C36 32.8954 35.1046 32 34 32C32.8954 32 32 32.8954 32 34C32 35.1046 32.8954 36 34 36Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-[#1a96eb] mb-2">Premium</div>
                  <div className="text-gray-600 text-sm">Luxury travel experience</div>
                </div>
              </div>

              <div className="bg-[#eaf6ff] rounded-2xl p-6 text-center">
                <span className="text-gray-700 text-base sm:text-lg">
                  Every vehicle is{" "}
                  <Link href="/#gallery" className="text-[#1a96eb] underline font-medium">
                    clean, well-maintained
                  </Link>
                  , and driven by courteous drivers committed to your safety and satisfaction.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: What Sets Us Apart? */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold font-[Reddit_Sans] text-center mb-3 text-gray-900">
                What Sets Us Apart?
              </h2>
              <p className="text-center text-lg text-gray-700 mb-10">
                We believe in <span className="text-[#ff9800] font-semibold">personal connection</span> over app confusion.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE6D1] flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Easy Booking</div>
                    <div className="text-gray-600 text-sm">Book via website, call, or WhatsApp - No app required</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE6D1] flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Fast Doorstep Pickup</div>
                    <div className="text-gray-600 text-sm">Quick and reliable pickup from your location</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE6D1] flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Safety First</div>
                    <div className="text-gray-600 text-sm">Clean, well-maintained vehicles with courteous drivers</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE6D1] flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <path d="M9 17h6"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Wide Range</div>
                    <div className="text-gray-600 text-sm">From budget to premium – match your travel needs</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f9fbff] rounded-2xl p-6 text-center border-2 border-[#1A96EB]">
                <span className="text-gray-700 text-base sm:text-lg">
                  With easy booking through our website, call, or WhatsApp, you can schedule your ride in seconds
                  <br />
                  <span className="text-[#1a96eb] underline font-semibold">
                    — no downloads, no waiting.
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Choose CityTourCabs (CTA) */}
        <section
          className="py-16 md:py-24 text-white"
          style={{ background: "linear-gradient(90deg, rgb(26, 150, 235), rgb(21, 120, 188))" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[Reddit_Sans] mb-4 text-white">
                Choose CityTourCabs
              </h2>
              <p
                className="font-handwritten text-2xl sm:text-3xl mb-4 font-semibold"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Fast. Safe. Affordable. Always at your doorstep.
              </p>
              <p className="text-lg sm:text-xl text-blue-100 mb-8">
                So next time you need a reliable ride in Mumbai
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleOpenBookModal}
                  className="bg-[#FF6600] hover:bg-[#e65c00] text-white px-8 sm:px-10 py-4 rounded-xl text-lg font-bold shadow-md transition-colors inline-block"
                >
                  Book Your Ride Now
                </button>
                <a
                  href={`tel:+91${phone}`}
                  className="bg-white hover:bg-blue-50 text-[#2196f3] px-8 sm:px-10 py-4 rounded-xl text-lg font-bold shadow-md transition-colors inline-block"
                >
                  Call +91 {phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Get In Touch */}
        <div id="contact">
          <BookingContactForm />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenBookModal={() => handleOpenBookModal()}
      />

      {/* Floating Actions */}
      <FloatingActions
        onOpenBookModal={() => handleOpenBookModal()}
        onOpenEnquiryModal={() => setAutoEnquiryOpen(true)}
      />

      {/* Quick Booking Modal */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        initialData={{ tripType: "City Tour" }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Timed Auto Enquiry Modal (Guaranteed not to overlap) */}
      {!bookModalOpen && (
        <AutoEnquiryModal
          isOpen={autoEnquiryOpen}
          onClose={() => setAutoEnquiryOpen(false)}
        />
      )}
    </div>
  );
}
