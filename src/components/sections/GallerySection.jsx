'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

function optimizeImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("images.unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?auto=format&fit=crop&w=600&q=75`;
  }
  if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_600/");
  }
  return url;
}

const DEFAULT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1727962238717-484248a1bfc1?auto=format&fit=crop&w=600&q=75",
    alt: "Tourists exploring heritage sites"
  },
  {
    src: "https://images.unsplash.com/photo-1664637517904-a53ba8966c11?auto=format&fit=crop&w=600&q=75",
    alt: "Gateway of India Mumbai"
  },
  {
    src: "https://images.unsplash.com/photo-1677573949755-0efb406b9383?auto=format&fit=crop&w=600&q=75",
    alt: "Family enjoying beach vacation"
  },
  {
    src: "https://images.unsplash.com/photo-1660985311930-5bf52268fede?auto=format&fit=crop&w=600&q=75",
    alt: "Hill station scenic viewpoint"
  },
  {
    src: "https://images.unsplash.com/photo-1738639412443-54b5c75510cd?auto=format&fit=crop&w=600&q=75",
    alt: "Temple visit spiritual journey"
  },
  {
    src: "https://images.unsplash.com/photo-1725598944473-5900a622824e?auto=format&fit=crop&w=600&q=75",
    alt: "Waterfall nature exploration"
  },
  {
    src: "https://images.unsplash.com/photo-1654630485983-98767fb83e9f?auto=format&fit=crop&w=600&q=75",
    alt: "Family car vacation memories"
  },
  {
    src: "https://images.unsplash.com/photo-1704457874634-dc24029f312e?auto=format&fit=crop&w=600&q=75",
    alt: "Lonavala scenic hills"
  }
];

export default function GallerySection({
  title = 'Memories from Our Tours',
  subtitle = 'Explore the beautiful moments captured during our tours and sightseeing trips.',
}) {
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const sectionRef = React.useRef(null);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok && active) {
          const data = await res.json();
          const docs = Array.isArray(data.docs) ? data.docs : (Array.isArray(data.gallery) ? data.gallery : []);
          if (docs.length > 0) {
            const mapped = docs
              .map((g) => ({
                src: optimizeImageUrl(typeof g.image === 'object' && g.image?.url ? g.image.url : (g.image || g.imageUrl || '')),
                alt: g.title || 'Tour Photo',
              }))
              .filter((img) => Boolean(img.src));
            if (mapped.length > 0) {
              setImages(mapped);
            }
          }
        }
      } catch (err) {
        // Fallback
      }
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            loadGallery();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(sectionRef.current);
      return () => {
        active = false;
        observer.disconnect();
      };
    } else {
      loadGallery();
    }
  }, []);

  const maxDesktopIndex = Math.max(0, images.length - 4);
  const maxMobileIndex = Math.max(0, images.length - 2);

  const prevDesktop = () => setDesktopIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const nextDesktop = () => setDesktopIndex((prev) => (prev < maxDesktopIndex ? prev + 1 : maxDesktopIndex));

  const prevMobile = () => setMobileIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const nextMobile = () => setMobileIndex((prev) => (prev < maxMobileIndex ? prev + 1 : maxMobileIndex));

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white text-gray-900 lazy-render-scroll">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[30px] font-[Reddit_Sans] font-bold text-gray-900">
              {title || 'Memories from Our Tours'}
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#4b5563" }}>
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* Desktop Carousel (>= md) */}
          <div className="hidden md:block relative">
          <button
            onClick={prevDesktop}
            disabled={desktopIndex === 0}
            className="size-9 rounded-md absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-orange-600 hover:text-white border border-gray-100 flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextDesktop}
            disabled={desktopIndex >= maxDesktopIndex}
            className="size-9 rounded-md absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-orange-600 hover:text-white border border-gray-100 flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${desktopIndex * 25}%)` }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="flex-shrink-0 px-2" style={{ width: "25%" }}>
                  <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg group">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setDesktopIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  desktopIndex === idx ? "bg-orange-600 w-8" : "bg-gray-300 w-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Carousel (< md) */}
        <div className="md:hidden relative">
          <button
            onClick={prevMobile}
            disabled={mobileIndex === 0}
            className="size-9 rounded-md absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white shadow-lg hover:bg-orange-600 hover:text-white border border-gray-100 flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextMobile}
            disabled={mobileIndex >= maxMobileIndex}
            className="size-9 rounded-md absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white shadow-lg hover:bg-orange-600 hover:text-white border border-gray-100 flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${mobileIndex * 50}%)` }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="flex-shrink-0 px-1.5" style={{ width: "50%" }}>
                  <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxMobileIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  mobileIndex === idx ? "bg-orange-600 w-8" : "bg-gray-300 w-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>

      </div>
    </section>
  );
}
