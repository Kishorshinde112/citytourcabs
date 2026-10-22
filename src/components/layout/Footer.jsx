'use client';

import React from "react";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import useSettingsStore from "@/store/settingsStore";
import useTourLinks from "@/hooks/useTourLinks";
import useCmsGlobal from "@/hooks/useCmsGlobal";
import { displayIndianPhone, telHref } from "@/lib/phone";

const FALLBACK_GROUPS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', url: '/' },
      { label: 'About Us', url: '/about' },
      { label: 'Tour Packages', url: '/tours' },
      { label: 'Contact Us', url: '/#contact' },
    ],
  },
];

export default function Footer({ onOpenPrivacyModal = () => {}, onOpenBookModal = () => {} }) {
  const { phone, email, officeAddress, workingHours, footer, siteName } = useSettingsStore();
  const tourLinks = useTourLinks();
  const footerGlobal = useCmsGlobal('footer', null);

  const fallbackGroups = [
    ...FALLBACK_GROUPS,
    {
      title: 'Popular Tours',
      links: tourLinks.slice(0, 6).map((tour) => ({
        label: tour.name,
        url: tour.href,
      })),
    },
  ];
  const groups = footerGlobal?.groups?.length ? footerGlobal.groups : fallbackGroups;
  const copyright = footerGlobal?.copyright || footer?.copyright;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1: Brand & Book Now */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-2xl text-white font-[Reddit_Sans] font-bold">
              {siteName || "CityTourCabs"}
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {footer?.bio || "City Tour Cabs is Mumbai's trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips."}
            </p>
            <button
              onClick={() => onOpenBookModal && onOpenBookModal()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white h-9 px-4 py-2 bg-[#1A96EB] hover:bg-[#1578BC] transition-all cursor-pointer shadow-xs"
            >
              Book Now
            </button>

            {(footer?.facebookUrl || footer?.instagramUrl) && (
              <div className="mt-5 flex items-center gap-3">
                {footer?.facebookUrl && (
                  <a
                    href={footer.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {footer?.instagramUrl && (
                  <a
                    href={footer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* CMS-managed footer link groups */}
          {groups.map((group, groupIdx) => (
            <div key={group.id || `${group.title}-${groupIdx}`}>
              <h3 className="mb-4 text-white font-bold font-[Reddit_Sans]">{group.title}</h3>
              <ul className="space-y-2">
                {(group.links || []).map((link, linkIdx) => (
                  <li key={link.id || `${link.url}-${linkIdx}`}>
                    <a className="text-sm hover:text-orange-600 transition-colors" href={link.url}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div>
            <h3 className="mb-4 text-white font-bold font-[Reddit_Sans]">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={telHref(phone)} className="text-sm hover:text-orange-600 transition-colors">
                    {displayIndianPhone(phone)}
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
                  <p className="text-sm leading-relaxed">
                    {officeAddress || "Shop No 4, Chembur West, Mumbai, Maharashtra 400071"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm leading-relaxed">{workingHours || "24/7 Available (Open All 365 Days)"}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">{copyright || "© 2026 CityTourCabs. All rights reserved."}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <a
                href="/privacy-policy"
                className="hover:text-orange-600 transition-colors"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="https://kishorlab.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                Site design by Kishor Lab
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
