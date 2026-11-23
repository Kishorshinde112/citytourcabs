'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/shared/ui/ScrollReveal';
import { defaultTourCards, type TourCardItem } from '../defaultTours';

export interface TourPackagesProps {
  showMumbaiOnly?: boolean;
  onSelectTour?: (tour: any) => void;
  onOpenBookModal?: (tour: any) => void;
  headingAs?: React.ElementType;
  title?: string;
  subtitle?: string;
  tourIds?: any;
  initialTours?: TourCardItem[] | null;
}

export default function TourPackages({
  showMumbaiOnly = false,
  onSelectTour = undefined,
  onOpenBookModal = undefined,
  headingAs: Heading = 'h2',
  title = 'Explore Mumbai & Beyond',
  subtitle = 'Discover our range of convenient and comfortable cab services tailored to your needs.',
  tourIds = null,
  initialTours = null,
}: TourPackagesProps) {
  const [tourCards, setTourCards] = useState<TourCardItem[]>(() =>
    Array.isArray(initialTours) && initialTours.length > 0 ? initialTours : defaultTourCards
  );

  useEffect(() => {
    // If initialTours was already provided during SSR/ISR, skip redundant client fetch waterfall
    if (Array.isArray(initialTours) && initialTours.length > 0) return;

    let isMounted = true;
    async function loadTours() {
      try {
        const res = await fetch('/api/tours?limit=100&depth=1');
        const data = await res.json();
        const docs = Array.isArray(data.docs)
          ? data.docs
          : (data.success && Array.isArray(data.tours) ? data.tours : []);

        if (isMounted && docs.length > 0) {
          const mapped = docs.map((doc: any) => {
            const staticTour: any = defaultTourCards.find((t) => t.id === doc.slug || t.href === `/${doc.slug}`) || {};
            const details = Array.isArray(doc.layout) ? doc.layout.find((b: any) => b.blockType === 'tourDetails') : null;
            const cmsImage = typeof details?.heroImage === 'string' && !details.heroImage.includes('unsplash.com')
              ? details.heroImage
              : null;
            const finalImage = cmsImage || (typeof doc.banner === 'string' ? doc.banner : null) || staticTour.image || 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351884/citytourcabs/assets/about-banner.jpg';
            return {
              id: doc.slug || staticTour.id,
              title: doc.title || staticTour.title,
              badge: details?.subtitle || doc.subtitle || staticTour.badge || '',
              description: details?.description || doc.shortDescription || staticTour.description || '',
              image: finalImage,
              href: `/tours/${doc.slug || staticTour.id}`,
            };
          });
          setTourCards(mapped);
        }
      } catch (err) {
        console.error('Error fetching dynamic tours:', err);
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, [initialTours]);

  const selectedIds = Array.isArray(tourIds) && tourIds.length
    ? tourIds
        .map((tour) => (tour && typeof tour === 'object' ? tour.slug || tour.id : tour))
        .filter(Boolean)
        .map(String)
    : null;

  const displayTours = tourCards.filter((tour) => {
    if (showMumbaiOnly && tour.id !== 'mumbai-darshan') return false;
    if (!selectedIds) return true;
    return selectedIds.includes(String(tour.id)) || selectedIds.some((id) => tour.href?.endsWith(`/${id}`));
  });

  return (
    <section id="tours" className="py-16 md:py-24 bg-blue-50 text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <Heading className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-[Reddit_Sans]">
              {title || 'Explore Mumbai & Beyond'}
            </Heading>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 10 Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTours.map((tour, idx) => (
            <ScrollReveal key={tour.id} delay={(idx % 3) * 0.1} className="h-full">
              <div
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  {/* Tour Card Image */}
                  <a href={tour.href} className="block relative h-48 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 shrink-0 text-white" />
                        <span className="text-sm font-medium">{tour.badge}</span>
                      </div>
                    </div>
                  </a>

                  {/* Tour Card Header & Content */}
                  <div className="p-6">
                    <a href={tour.href} className="hover:text-[#1A96EB] transition-colors">
                      <h3 className="font-[Reddit_Sans] font-bold text-[18px] text-gray-900 mb-2">
                        {tour.title}
                      </h3>
                    </a>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {tour.description}
                    </p>
                  </div>
                </div>

                {/* Tour Card Action (Learn More ->) */}
                <div className="px-6 pb-6 pt-0">
                  <a
                    href={tour.href}
                    className="inline-flex items-center text-[#1A96EB] hover:text-[#1578BC] font-medium text-sm transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
