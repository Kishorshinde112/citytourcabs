'use client';

import React from "react";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/store/settingsStore";
import useTourLinks from "@/shared/hooks/useTourLinks";
import useCmsGlobal from "@/shared/hooks/useCmsGlobal";
import { displayIndianPhone, telHref } from "@/shared/lib/phone";

const FALLBACK_GROUPS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', url: '/' },
      { label: 'About Us', url: '/about' },
      { label: 'Tour Packages', url: '/tours' },
      { label: 'Our Fleet', url: '/fleet' },
      { label: 'Contact Us', url: '/contact' },
    ],
  },
];

export default function Footer({
  onOpenPrivacyModal = () => {},
  onOpenBookModal = () => {},
  initialFooter = null,
  initialTourLinks = null,
}) {
  const { phone, email, officeAddress, workingHours, footer, siteName } = useSiteSettings();
  const tourLinks = useTourLinks(initialTourLinks);
  const footerGlobal = useCmsGlobal('footer', null, initialFooter);

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
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1: Brand & Book Now */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-2xl text-white font-display font-bold">
              {siteName || "CityTourCabs"}
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              {footer?.bio || "City Tour Cabs is Mumbai's trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips."}
            </p>
            <button
              type="button"
              onClick={() => onOpenBookModal && onOpenBookModal()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white h-9 px-4 py-2 bg-[#0F6EB8] hover:bg-[#0B5591] transition-all cursor-pointer shadow-xs"
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
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
                {footer?.instagramUrl && (
                  <a
                    href={footer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* CMS-managed footer link groups */}
          {groups.map((group, groupIdx) => (
            <div key={group.id || `${group.title}-${groupIdx}`}>
              <h3 className="mb-4 text-white font-bold font-display">{group.title}</h3>
              <ul className="space-y-2">
                {(group.links || []).map((link, linkIdx) => (
                  <li key={link.id || `${link.url}-${linkIdx}`}>
                    <a className="text-sm text-gray-300 hover:text-orange-300 transition-colors" href={link.url}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div>
            <h3 className="mb-4 text-white font-bold font-display">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <a href={telHref(phone)} className="text-sm text-gray-200 hover:text-orange-300 transition-colors">
                    {displayIndianPhone(phone)}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <a href={"mailto:" + email} className="text-sm text-gray-200 hover:text-orange-300 transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {officeAddress || "Office No 1102 P2 Kanjurmarg east, Mumbai 400042"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">{workingHours || "24/7 Available (Open All 365 Days)"}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-300">{copyright || "© 2026 CityTourCabs. All rights reserved."}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
              <a
                href="/privacy-policy"
                className="hover:text-orange-300 transition-colors"
              >
                Privacy Policy
              </a>
              <span aria-hidden="true">•</span>
              <a
                href="/terms"
                className="hover:text-orange-300 transition-colors"
              >
                Terms & Cancellation
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
