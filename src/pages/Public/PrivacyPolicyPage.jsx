import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import QuickBookModal from "../../components/QuickBookModal";
import AutoEnquiryModal from "../../components/AutoEnquiryModal";
import BookingContactForm from "../../components/BookingContactForm";
import useSettingsStore from "../../store/settingsStore";
import { Shield, FileText, UserCheck, Eye, Lock, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { phone, email } = useSettingsStore();
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [autoEnquiryOpen, setAutoEnquiryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenBookModal = (extra = {}) => {
    setBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Navbar */}
      <Navbar onOpenBookModal={() => handleOpenBookModal()} />

      <main className="flex-1">
        {/* Section 0: Hero Banner */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-white">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-orange-200 mt-4">
              Last Updated: October 26, 2025
            </p>
          </div>
        </section>

        {/* Section 1: Privacy Policy Details */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                At CityTourCabs, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cab and tour services.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Personal Information
                  </h3>
                  <p>When you book a tour or use our services, we may collect:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Name and contact information (phone number, email address)</li>
                    <li>Pickup and drop-off locations</li>
                    <li>Travel dates and preferences</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Special requirements or requests for your journey</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Automatically Collected Information
                  </h3>
                  <p>We may automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>IP address and browser type</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  How We Use Your Information
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and confirm your cab and tour bookings</li>
                  <li>Communicate with you regarding your itinerary and updates</li>
                  <li>Provide customer support and resolve any issues</li>
                  <li>Improve our services and enhance passenger safety</li>
                  <li>Send booking confirmations, invoices, and service reminders</li>
                  <li>Comply with applicable legal and regulatory obligations</li>
                </ul>
              </div>
            </div>

            {/* 3. Information Sharing and Disclosure */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Information Sharing and Disclosure
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Our Drivers:</strong> To facilitate your tour or cab service</li>
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (payment processors, communication platforms)</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
                </ul>
                <p className="font-medium text-orange-700">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>

            {/* 4. Data Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Data Security
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>
            </div>

            {/* 5. Your Rights */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Your Rights
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information (subject to legal obligations)</li>
                  <li>Opt-out of marketing communications at any time</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                </ul>
              </div>
            </div>

            {/* 6. Cookies and Tracking Technologies */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
                Cookies and Tracking Technologies
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of our website.
                </p>
              </div>
            </div>

            {/* 7. Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
                Third-Party Links
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>
            </div>

            {/* 8. Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
                Children's Privacy
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>
            </div>

            {/* 9. Changes to This Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
                Changes to This Privacy Policy
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date.
                </p>
              </div>
            </div>

            {/* 10. Contact Us Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Contact Us
                </h2>
              </div>
              <div className="text-gray-700 space-y-3">
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <p>
                  <strong>Email: </strong>
                  <a className="text-orange-600 hover:text-orange-700 underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </p>
                <p>
                  <strong>Phone: </strong>
                  <a className="text-orange-600 hover:text-orange-700 underline" href={`tel:+91${phone}`}>
                    +91 {phone}
                  </a>
                </p>
                <p>
                  <strong>Location: </strong>
                  Mumbai, Maharashtra
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Get In Touch */}
        <div id="contact">
          <BookingContactForm />
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
        initialData={{ tripType: "City Tour" }}
      />

      {/* Auto Enquiry Modal */}
      <AutoEnquiryModal
        isOpen={autoEnquiryOpen}
        onClose={() => setAutoEnquiryOpen(false)}
      />
    </div>
  );
}
