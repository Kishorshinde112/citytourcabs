'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/store/settingsStore";
import useTourLinks from "@/shared/hooks/useTourLinks";
import useCmsGlobal from "@/shared/hooks/useCmsGlobal";
import { displayIndianPhone, telHref, whatsappNumber } from "@/shared/lib/phone";

const DEFAULT_NAV_LINKS = [
  { label: 'Home', url: '/' },
  { label: 'Tour Packages', url: '/tours' },
  { label: 'Our Fleet', url: '/fleet' },
  { label: 'About Us', url: '/about' },
  { label: 'Contact', url: '/contact' },
];

const isToursLink = (url) => {
  const clean = String(url || '').replace(/\/+$/, '');
  return clean === '/tours' || clean === '/tour-packages';
};

export default function Navbar({
  onOpenBookModal = () => {},
  initialNavigation = null,
  initialTourLinks = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { phone, whatsapp, email, announcement, siteName, logoUrl } = useSiteSettings();
  const tourOptions = useTourLinks(initialTourLinks);
  const navigation = useCmsGlobal('navigation', { links: DEFAULT_NAV_LINKS }, initialNavigation);
  const navLinks = navigation?.links?.length ? navigation.links : DEFAULT_NAV_LINKS;

  const handleTourClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {announcement?.enabled !== false && (
        <div className="bg-[#0F6EB8] text-white py-2.5 transition-all">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="text-sm text-center sm:text-left">
                <span className="font-handwritten text-base tracking-wide font-normal">
                  {announcement?.text || 'Available 24/7 for your convenience'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a href={telHref(phone)} className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>{displayIndianPhone(phone)}</span>
                </a>
                <span className="hidden sm:inline text-blue-100" aria-hidden="true">|</span>
                <a href={"mailto:" + email} className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{email}</span>
                  <span className="sm:hidden">Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="bg-white shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo */}
            <a href="/" className="shrink-0 flex items-center gap-3">
              <Image
                src={logoUrl || "https://res.cloudinary.com/o0mbamog/image/upload/v1792351891/citytourcabs/assets/citytourcabs-logo.png"}
                alt=""
                width={56}
                height={56}
                priority
                className="h-14 w-auto object-contain"
              />
              <span className="text-[#0F6EB8] font-display font-bold text-[24px]">
                {siteName || "City Tour Cabs"}
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, idx) => {
                if (isToursLink(link.url)) {
                  return (
                    <div
                      key={`${link.url}-${idx}`}
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        aria-expanded={dropdownOpen}
                        aria-haspopup="menu"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center text-gray-800 hover:text-[#0F6EB8] transition-colors text-sm font-medium py-2 cursor-pointer"
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-600" aria-hidden="true" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                          <a
                            href="/tours"
                            onClick={handleTourClick}
                            className="block px-4 py-2 text-xs font-semibold text-[#0F6EB8] hover:bg-blue-50 transition cursor-pointer"
                          >
                            All Tour Packages
                          </a>
                          {tourOptions.map((item, itemIdx) => (
                            <a
                              key={itemIdx}
                              href={item.href}
                              onClick={handleTourClick}
                              className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0F6EB8] transition cursor-pointer"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={`${link.url}-${idx}`}
                    href={link.url}
                    className="text-gray-800 hover:text-[#0F6EB8] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Book Now CTA */}
            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => onOpenBookModal()}
                className="bg-[#0F6EB8] hover:bg-[#0B5591] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Book Now
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={telHref(phone)}
                className="p-2 rounded-lg text-gray-700"
                aria-label="Call Now"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
              </a>
              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 text-gray-800 shadow-xl">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a
                href={telHref(phone)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-[#0F6EB8] hover:bg-[#0B5591] text-white font-semibold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                Call Desk
              </a>
              <a
                href={"https://wa.me/" + whatsappNumber(whatsapp || phone) + "?text=" + encodeURIComponent("Hi City Tour Cabs, I want to book a cab.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                WhatsApp
              </a>
            </div>

            {navLinks.map((link, idx) => {
              if (isToursLink(link.url)) {
                return (
                  <div key={`${link.url}-${idx}`} className="px-3 py-2">
                    <a
                      href="/tours"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 hover:text-[#0F6EB8]"
                    >
                      {link.label}
                    </a>
                    <div className="pl-2 space-y-1 border-l-2 border-blue-100 ml-1">
                      {tourOptions.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.href}
                          onClick={handleTourClick}
                          className="block py-1 pl-2 text-xs font-semibold text-gray-700 hover:text-[#0F6EB8] cursor-pointer"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={`${link.url}-${idx}`}
                  href={link.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-[#0F6EB8]"
                >
                  {link.label}
                </a>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookModal();
              }}
              className="w-full mt-3 py-3 rounded-md bg-[#0F6EB8] hover:bg-[#0B5591] text-white font-semibold text-sm shadow-xs cursor-pointer"
            >
              Book Now
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
