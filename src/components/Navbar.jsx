import React, { useState } from "react";
import { Phone, Mail, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import useSettingsStore from "../store/settingsStore";
import logoImg from "../assets/citytourcabs-logo.png";

export default function Navbar({ onOpenBookModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { phone, email } = useSettingsStore();

  const tourOptions = [
    { name: "Mumbai Darshan", id: "mumbai-darshan", href: "/mumbai-darshan" },
    { name: "Lonavala Trip", id: "lonavala-trip", href: "/lonavala-trip" },
    { name: "Alibaug Sightseeing", id: "alibaug-sightseeing", href: "/alibaug-sightseeing" },
    { name: "Matheran Sightseeing", id: "matheran-sightseeing", href: "/matheran-sightseeing" },
    { name: "Shirdi Tour", id: "shirdi-tour", href: "/shirdi-tour" },
    { name: "Mahabaleshwar Sightseeing", id: "mahabaleshwar-sightseeing", href: "/mahabaleshwar-sightseeing" },
    { name: "Igatpuri Tour", id: "igatpuri-tour", href: "/igatpuri-tour" },
    { name: "Ashtavinayak", id: "ashtavinayak", href: "/ashtavinayak" },
    { name: "3 Jyotirlinga in Maharashtra", id: "jyotirlinga-maharashtra", href: "/3-jyotirlinga-in-maharashtra" },
    { name: "Konkan Darshan", id: "konkan-darshan", href: "/konkan-darshan" },
  ];

  const handleTourClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[rgb(29,132,198)] text-white py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-sm text-center sm:text-left">
              <span className="font-handwritten text-base">Available 24/7 for your convenience</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href={"tel:+91" + phone} className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 {phone}</span>
              </a>
              <span className="hidden sm:inline text-blue-300">|</span>
              <a href={"mailto:" + email} className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">{email}</span>
                <span className="sm:hidden">Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="bg-white shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo */}
            <a href="/" className="shrink-0 flex items-center gap-3">
              <img src={logoImg} alt="CityTourCabs Logo" className="h-14 w-auto object-contain" />
              <span className="text-gray-900 font-bold text-2xl font-display">
                City Tour Cabs
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-[#1A96EB] transition-colors text-sm font-medium">
                Home
              </a>

              <a href="/about" className="text-gray-700 hover:text-[#1A96EB] transition-colors text-sm font-medium">
                About
              </a>

              {/* Tour Options Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-[#1A96EB] transition-colors text-sm font-medium py-2"
                >
                  <span>Tour Options</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    {tourOptions.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={handleTourClick}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#1A96EB] transition cursor-pointer"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/#gallery" className="text-gray-700 hover:text-[#1A96EB] transition-colors text-sm font-medium">
                Our Cab Gallery
              </a>

              <a href="/#contact" className="text-gray-700 hover:text-[#1A96EB] transition-colors text-sm font-medium">
                Contact Us
              </a>
            </nav>

            {/* Desktop Book Now Button */}
            <div className="hidden md:block">
              <button
                onClick={onOpenBookModal}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-white h-9 px-4 py-2 bg-[#1A96EB] hover:bg-[#1578BC] cursor-pointer shadow-xs"
              >
                Book Now
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={"tel:+91" + phone}
                className="p-2 rounded-lg text-gray-700"
                aria-label="Call Now"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 text-gray-800 shadow-xl">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a
                href={"tel:+91" + phone}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-[#1A96EB] text-white font-semibold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Desk
              </a>
              <a
                href={"https://wa.me/91" + phone + "?text=" + encodeURIComponent("Hi City Tour Cabs, I want to book a cab.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            </div>

            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1A96EB]"
            >
              Home
            </a>
            <a
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1A96EB]"
            >
              About
            </a>

            <div className="px-3 py-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Tour Options</div>
              <div className="pl-2 space-y-1 border-l-2 border-blue-100 ml-1">
                {tourOptions.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={handleTourClick}
                    className="block py-1 pl-2 text-xs font-semibold text-gray-600 hover:text-[#1A96EB] cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1A96EB]"
            >
              Our Cab Gallery
            </a>
            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1A96EB]"
            >
              Contact Us
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookModal();
              }}
              className="w-full mt-3 py-3 rounded-md bg-[#1A96EB] hover:bg-[#1578BC] text-white font-semibold text-sm shadow-xs cursor-pointer"
            >
              Book Now
            </button>
          </div>
        )}
      </header>
    </>
  );
}
