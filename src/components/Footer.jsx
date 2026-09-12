import React from "react";
import { Car, Phone, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { TOURS_DATA } from "../data/toursData";
import useSettingsStore from "../store/settingsStore";
import logoImg from "../assets/citytourcabs-logo.png";

export default function Footer({ onOpenPrivacyModal, onSelectTour }) {
  const { phone, email } = useSettingsStore();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="CityTourCabs Logo" className="h-12 w-auto object-contain" />
              <span className="font-display font-black text-2xl tracking-tight text-white">
                CityTour<span className="text-[#1D84C6]">Cabs</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join our vibrant tour community and connect with fellow travel enthusiasts! Share experiences, discover hidden gems, and get exclusive travel tips with drivers who act as professional tour guides.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-blue-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Available 24/7 For Your Convenience</span>
            </div>
          </div>

          {/* Popular Tours Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Popular Tour Packages
            </h4>
            <ul className="space-y-2 text-xs">
              {TOURS_DATA.slice(0, 6).map((tour) => (
                <li key={tour.id}>
                  <button
                    onClick={() => onSelectTour(tour)}
                    className="text-slate-400 hover:text-[#1D84C6] transition text-left"
                  >
                    • {tour.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/" className="hover:text-[#1D84C6] transition">Home</a></li>
              <li><a href="/mumbai-darshan" className="hover:text-[#1D84C6] transition">Mumbai Darshan</a></li>
              <li><a href="/#tours" className="hover:text-[#1D84C6] transition">Tour Packages</a></li>
              <li><a href="/#fleet" className="hover:text-[#1D84C6] transition">Our Cab Gallery</a></li>
              <li><a href="/#why-us" className="hover:text-[#1D84C6] transition">Why Choose Us</a></li>
              <li><a href="/#about" className="hover:text-[#1D84C6] transition">About Us</a></li>
              <li>
                <button onClick={onOpenPrivacyModal} className="hover:text-[#1D84C6] transition">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1D84C6] shrink-0" />
                <a href={"tel:+91" + phone} className="text-white hover:text-blue-400 font-bold">
                  +91 {phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={"https://wa.me/91" + phone + "?text=Hi%20CityTourCabs"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  WhatsApp: +91 {phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={"mailto:" + email} className="hover:text-white">
                  {email}
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-[#1D84C6] shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CityTourCabs. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyModal} className="hover:text-slate-300 transition">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacyModal} className="hover:text-slate-300 transition">
              Terms of Service
            </button>
            <span>•</span>
            <span className="text-[#1D84C6] font-bold">Safe • Reliable • Guide Drivers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
