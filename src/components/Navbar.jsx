import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import useSettingsStore from "../store/settingsStore";
import logoImg from "../assets/citytourcabs-logo.png";

export default function Navbar({ onOpenBookModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { phone, email } = useSettingsStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="bg-[#1D84C6] text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-medium">
          <div>
            <span>Available 24/7 for your convenience</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href={"tel:+91" + phone} className="hover:text-blue-100 flex items-center gap-1.5 transition">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 {phone}</span>
            </a>
            <span className="text-blue-300">|</span>
            <a href={"mailto:" + email} className="hover:text-blue-100 flex items-center gap-1.5 transition">
              <span>{email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={"sticky top-0 z-50 transition-all duration-200 bg-white border-b border-slate-200 " + (isScrolled ? "shadow-md py-2" : "py-3")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* Brand Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <img src={logoImg} alt="City Tour Cabs Logo" className="h-11 sm:h-12 w-auto object-contain" />
              <span className="text-[#1D84C6] font-extrabold text-xl sm:text-2xl tracking-tight font-display">
                City Tour Cabs
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              <a href="/" className="text-sm font-semibold text-slate-700 hover:text-[#1D84C6] transition">
                Home
              </a>

              <a href="/#about" className="text-sm font-semibold text-slate-700 hover:text-[#1D84C6] transition">
                About
              </a>

              {/* Tour Options Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className="text-sm font-semibold text-slate-700 hover:text-[#1D84C6] transition flex items-center gap-1 py-2"
                >
                  <span>Tour Options</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fadeIn">
                    {tourOptions.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={handleTourClick}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1D84C6] transition cursor-pointer"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/#fleet" className="text-sm font-semibold text-slate-700 hover:text-[#1D84C6] transition">
                Our Cab Gallery
              </a>

              <a href="/#contact" className="text-sm font-semibold text-slate-700 hover:text-[#1D84C6] transition">
                Contact Us
              </a>
            </div>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href={"https://wa.me/91" + phone + "?text=" + encodeURIComponent("Hi City Tour Cabs, I want to check cab rates and availability.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={"tel:+91" + phone}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1D84C6] text-xs font-bold border border-blue-200 shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#1D84C6]" />
                <span>+91 {phone}</span>
              </a>

              <button
                onClick={() => onOpenBookModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D84C6] hover:bg-[#1578BC] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <span>Book Now</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={"tel:+91" + phone}
                className="p-2 rounded-lg bg-blue-50 text-[#1D84C6] border border-blue-200"
                aria-label="Call Now"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn text-slate-800 shadow-xl">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a
                href={"tel:+91" + phone}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1D84C6] text-white font-bold text-xs shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Desk
              </a>
              <a
                href={"https://wa.me/91" + phone + "?text=" + encodeURIComponent("Hi City Tour Cabs, I want to book a cab.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            </div>

            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1D84C6]"
            >
              Home
            </a>
            <a
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1D84C6]"
            >
              About
            </a>

            <div className="px-3 py-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tour Options</div>
              <div className="pl-2 space-y-1 border-l-2 border-blue-100 ml-1">
                {tourOptions.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={handleTourClick}
                    className="block py-1 pl-2 text-xs font-semibold text-slate-600 hover:text-[#1D84C6] cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1D84C6]"
            >
              Our Cab Gallery
            </a>
            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1D84C6]"
            >
              Contact Us
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookModal();
              }}
              className="w-full mt-3 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              Book Now
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
