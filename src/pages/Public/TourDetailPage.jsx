import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import QuickBookModal from "../../components/QuickBookModal";
import AutoEnquiryModal from "../../components/AutoEnquiryModal";
import useSettingsStore from "../../store/settingsStore";
import tourPagesData from "../../data/tourPagesData.json";

export default function TourDetailPage({ slug }) {
  const data = tourPagesData[slug] || {};
  const { phone } = useSettingsStore();

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookModalInitialData, setBookModalInitialData] = useState({});
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data.title) {
      document.title = `${data.title} | City Tour Cabs`;
    }
    const timer = setTimeout(() => setAutoEnquiryOpen(true), 5000);
    return () => clearTimeout(timer);
  }, [slug, data.title]);

  const handleOpenBookModal = (extra = {}) => {
    setBookModalInitialData({
      dropCity: data.title,
      tripType: data.title || "Tour Package",
      ...extra,
    });
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Navigation */}
      <Navbar onOpenBookModal={() => handleOpenBookModal()} />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={data.heroImage}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 text-white">
                {data.title}
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 font-sans">
                {data.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="tour-flex-layout mb-16">
            {/* Left Column */}
            <div className="tour-flex-left">
              <div
                className="tour-content"
                dangerouslySetInnerHTML={{ __html: data.leftHtml || "" }}
              />
            </div>

            {/* Right Column */}
            <div className="tour-flex-right">
              <div className="sticky top-24 space-y-6">
                {/* Rate Card Table */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="mb-4 text-[18px] font-bold text-gray-900">
                    Rate Card
                  </h3>
                  <div
                    className="rate-table-html"
                    dangerouslySetInnerHTML={{ __html: data.rightHtml || "" }}
                  />
                </div>

                {/* Quick Booking Card */}
                <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                  <h3 className="mb-4 text-[18px] font-bold text-orange-600">
                    Quick Booking
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant confirmation for your {data.title}
                  </p>
                  <button
                    onClick={() => handleOpenBookModal()}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Or call us directly:
                    </p>
                    <a
                      href={`tel:+91${phone}`}
                      className="text-[#1A96EB] hover:text-[#1578BC] transition-colors block"
                    >
                      📞 +91 {phone}{" "}
                      <span className="ml-2 text-xs text-gray-500">
                        | City Tour Cabs
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenBookModal={() => handleOpenBookModal()} />

      {/* Floating Actions */}
      <FloatingActions 
        onOpenBookModal={() => handleOpenBookModal()} 
        onOpenEnquiryModal={() => setAutoEnquiryOpen(true)}
      />

      {/* Quick Booking Modal */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        initialData={bookModalInitialData}
      />

      {/* Auto Enquiry Modal */}
      <AutoEnquiryModal
        isOpen={autoEnquiryOpen}
        onClose={() => setAutoEnquiryOpen(false)}
      />
    </div>
  );
}
