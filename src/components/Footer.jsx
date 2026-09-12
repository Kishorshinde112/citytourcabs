import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import useSettingsStore from "../store/settingsStore";

export default function Footer({ onOpenPrivacyModal, onOpenBookModal }) {
  const { phone, email } = useSettingsStore();

  const tourLinks = [
    { name: "Mumbai Darshan", href: "/mumbai-darshan" },
    { name: "Lonavala Trip", href: "/lonavala-trip" },
    { name: "Alibaug Sightseeing", href: "/alibaug-sightseeing" },
    { name: "Matheran Sightseeing", href: "/matheran-sightseeing" },
    { name: "Shirdi Tour", href: "/shirdi-tour" },
    { name: "Mahabaleshwar Sightseeing", href: "/mahabaleshwar-sightseeing" },
    { name: "Igatpuri Tour", href: "/igatpuri-tour" },
    { name: "Ashtavinayak", href: "/ashtavinayak" },
    { name: "3 Jyotirlinga in Maharashtra", href: "/3-jyotirlinga-in-maharashtra" },
    { name: "Konkan Darshan", href: "/konkan-darshan" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Book Now */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-2xl text-white font-display font-bold">
              CityTourCabs
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Join our vibrant tour community and connect with fellow travel enthusiasts! Share experiences, discover hidden gems, and get exclusive travel tips. Let's explore the world together!
            </p>
            <button
              onClick={() => onOpenBookModal && onOpenBookModal()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white h-9 px-4 py-2 bg-[#1A96EB] hover:bg-[#1578BC] transition-all cursor-pointer shadow-xs"
            >
              Book Now
            </button>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-white font-bold font-display">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a className="text-sm hover:text-orange-600 transition-colors" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="text-sm hover:text-orange-600 transition-colors" href="/#about">
                  About Us
                </a>
              </li>
              <li>
                <a className="text-sm hover:text-orange-600 transition-colors" href="/#gallery">
                  Our Cab Gallery
                </a>
              </li>
              <li>
                <a className="text-sm hover:text-orange-600 transition-colors" href="/#contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Offered */}
          <div>
            <h3 className="mb-4 text-white font-bold font-display">Services Offered</h3>
            <ul className="space-y-2">
              {tourLinks.map((t, idx) => (
                <li key={idx}>
                  <a className="text-sm hover:text-orange-600 transition-colors" href={t.href}>
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div>
            <h3 className="mb-4 text-white font-bold font-display">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={"tel:+91" + phone} className="text-sm hover:text-orange-600 transition-colors">
                    +91 {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={"mailto:" + email} className="text-sm hover:text-orange-600 transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">© 2026 CityTourCabs. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <button
                onClick={onOpenPrivacyModal}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
