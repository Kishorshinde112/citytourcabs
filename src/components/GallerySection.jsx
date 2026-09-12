import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySection() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1727962238717-484248a1bfc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaXN0cyUyMHNpZ2h0c2VlaW5nJTIwaW5kaWF8ZW58MXx8fHwxNzYxMzczNDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Tourists exploring heritage sites"
    },
    {
      src: "https://images.unsplash.com/photo-1664637517904-a53ba8966c11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBnYXRld2F5JTIwaW5kaWF8ZW58MXx8fHwxNzYxMzczMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Gateway of India Mumbai"
    },
    {
      src: "https://images.unsplash.com/photo-1677573949755-0efb406b9383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBlbmpveWluZyUyMGJlYWNofGVufDF8fHx8MTc2MTM3MzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Family enjoying beach vacation"
    },
    {
      src: "https://images.unsplash.com/photo-1660985311930-5bf52268fede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwc3RhdGlvbiUyMHZpZXdwb2ludHxlbnwxfHx8fDE3NjEzNzM0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Hill station scenic viewpoint"
    },
    {
      src: "https://images.unsplash.com/photo-1738639412443-54b5c75510cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjB2aXNpdCUyMHRvdXJpc3RzfGVufDF8fHx8MTc2MTM3MzQ5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Temple visit spiritual journey"
    },
    {
      src: "https://images.unsplash.com/photo-1725598944473-5900a622824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjB0b3VyaXN0c3xlbnwxfHx8fDE3NjEzNzM0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Waterfall nature exploration"
    },
    {
      src: "https://images.unsplash.com/photo-1654630485983-98767fb83e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGNhcnxlbnwxfHx8fDE3NjEzNzM0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Family car vacation memories"
    },
    {
      src: "https://images.unsplash.com/photo-1704457874634-dc24029f312e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsb25hdmFsYSUyMGhpbGxzfGVufDF8fHx8MTc2MTM3MzI0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Lonavala scenic hills"
    }
  ];

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const maxDesktopIndex = images.length - 4; // 8 - 4 = 4 (indices 0, 1, 2, 3, 4 -> 5 dots)
  const maxMobileIndex = images.length - 2;  // 8 - 2 = 6 (indices 0..6 -> 7 dots)

  const prevDesktop = () => setDesktopIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const nextDesktop = () => setDesktopIndex((prev) => (prev < maxDesktopIndex ? prev + 1 : maxDesktopIndex));

  const prevMobile = () => setMobileIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const nextMobile = () => setMobileIndex((prev) => (prev < maxMobileIndex ? prev + 1 : maxMobileIndex));

  return (
    <section className="py-16 md:py-24 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900 font-display">
            Memories from Our Tours
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
            Explore the beautiful moments captured during our tours and sightseeing trips.
          </p>
        </div>

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
            disabled={desktopIndex === maxDesktopIndex}
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
            disabled={mobileIndex === maxMobileIndex}
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

      </div>
    </section>
  );
}
