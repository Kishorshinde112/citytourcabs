'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSiteSettings } from '@/store/settingsStore';
import { telHref } from '@/lib/phone';

const DEFAULT_SLIDES = [
  {
    image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792351883/citytourcabs/assets/bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.jpg",
    subtitle: "Discover the City of Dreams",
    title: "Mumbai Sightseeing Tours",
    description: "Explore Mumbai's iconic landmarks with our expert drivers who know every corner, every story, and every hidden gem of the city.",
    link: "/tours/mumbai-darshan",
    buttonText: "Explore Mumbai Tours"
  },
  {
    image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792351857/citytourcabs/assets/0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.jpg",
    subtitle: "Escape to the Hills",
    title: "Lonavala Weekend Getaway",
    description: "Experience the scenic beauty of Lonavala with our comfortable cabs and knowledgeable drivers who will make your hill station trip unforgettable.",
    link: "/tours/lonavala-trip",
    buttonText: "Book Lonavala Trip"
  },
  {
    image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352407/citytourcabs/assets/tours/shirdi_p7RAPbKB9X.jpg",
    subtitle: "Seek Blessings & Peace",
    title: "Shirdi Spiritual Journey",
    description: "Visit the holy town of Shirdi with our reliable cab service and experienced drivers who ensure a comfortable and peaceful pilgrimage journey.",
    link: "/tours/shirdi-tour",
    buttonText: "Book Shirdi Tour"
  }
];

function slideFromBlock(block: any) {
  const background = typeof block?.image === 'object' ? block.image?.url : block?.image;
  return {
    ...DEFAULT_SLIDES[0],
    title: block?.title || DEFAULT_SLIDES[0].title,
    subtitle: block?.subtitle || DEFAULT_SLIDES[0].subtitle,
    image: background || DEFAULT_SLIDES[0].image,
  };
}

export default function Hero({
  block = null,
  isFallbackStatic = false,
}: {
  block?: any;
  isFallbackStatic?: boolean;
}) {
  const [slides, setSlides] = useState(() => (block?.title ? [slideFromBlock(block)] : DEFAULT_SLIDES));
  const [currentSlide, setCurrentSlide] = useState(0);
  const { phone } = useSiteSettings();

  useEffect(() => {
    if (block?.title) {
      setSlides([slideFromBlock(block)]);
      setCurrentSlide(0);
      return;
    }
    if (isFallbackStatic) return;

    async function loadCmsSlides() {
      try {
        const params = new URLSearchParams({ 'where[slug][equals]': 'home', limit: '1', depth: '2' });
        const res = await fetch(`/api/pages?${params}`);
        if (!res.ok) return;
        const data = await res.json();
        const page = data.docs?.[0];
        const hero = page?.layout?.find((item: any) => item.blockType === 'hero');
        if (hero?.title) {
          const background = typeof hero.image === 'object' ? hero.image?.url : null;
          setSlides([{
            ...DEFAULT_SLIDES[0],
            title: hero.title,
            subtitle: hero.subtitle || DEFAULT_SLIDES[0].subtitle,
            image: background || DEFAULT_SLIDES[0].image,
          }]);
          setCurrentSlide(0);
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadCmsSlides();
  }, [block, isFallbackStatic]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            quality={65}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <p className="font-handwritten text-2xl md:text-3xl mb-2 text-amber-200">
            {slide.subtitle}
          </p>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight text-white font-display">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl leading-relaxed">
            {slide.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={slide.link || "#tours"}
              className="inline-flex items-center justify-center text-base font-semibold h-12 rounded-md px-7 bg-[#0F6EB8] hover:bg-[#0B5591] text-white transition-colors w-full sm:w-auto cursor-pointer shadow-sm"
            >
              {slide.buttonText || "Explore Tours"}
            </a>
            <a
              href={telHref(phone)}
              className="inline-flex items-center justify-center text-base font-semibold h-12 rounded-md px-7 bg-white/15 border border-white text-white hover:bg-orange-700 hover:text-white hover:border-orange-700 transition-colors w-full sm:w-auto cursor-pointer"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Slider Controls Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {slides.map((_, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className="p-1.5 min-w-6 min-h-6 flex items-center justify-center cursor-pointer"
              >
                <span
                  className={`block h-3 rounded-full transition-all duration-300 ${
                    isActive ? "w-8 bg-orange-600" : "w-3 bg-white/70 hover:bg-white"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
