'use client';

import React, { useState, useEffect } from 'react';
import useSettingsStore from '@/store/settingsStore';

const DEFAULT_SLIDES = [
  {
    image: "/assets/bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.png",
    subtitle: "Discover the City of Dreams",
    title: "Mumbai Sightseeing Tours",
    description: "Explore Mumbai's iconic landmarks with our expert drivers who know every corner, every story, and every hidden gem of the city.",
    link: "/mumbai-darshan",
    buttonText: "Explore Mumbai Tours"
  },
  {
    image: "/assets/0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.png",
    subtitle: "Escape to the Hills",
    title: "Lonavala Weekend Getaway",
    description: "Experience the scenic beauty of Lonavala with our comfortable cabs and knowledgeable drivers who will make your hill station trip unforgettable.",
    link: "/lonavala-trip",
    buttonText: "Book Lonavala Trip"
  },
  {
    image: "https://images.unsplash.com/photo-1629640890590-7836d69c5237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaGlyZGklMjB0ZW1wbGUlMjBJbmRpYXxlbnwxfHx8fDE3NjEzNzg4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    subtitle: "Seek Blessings & Peace",
    title: "Shirdi Spiritual Journey",
    description: "Visit the holy town of Shirdi with our reliable cab service and experienced drivers who ensure a comfortable and peaceful pilgrimage journey.",
    link: "/shirdi-tour",
    buttonText: "Book Shirdi Tour"
  }
];

export default function Hero() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { phone } = useSettingsStore();

  useEffect(() => {
    async function loadCmsSlides() {
      try {
        const res = await fetch('/api/pages/home');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.page?.slides && data.page.slides.length > 0) {
            setSlides(data.page.slides);
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadCmsSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden">
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
              <div className="max-w-3xl text-white">
                <p className="font-handwritten text-2xl md:text-3xl mb-2 text-orange-300">
                  {slide.subtitle}
                </p>
                <h1
                  className="mb-4 text-4xl md:text-5xl font-bold leading-tight"
                  style={{ color: "white", fontFamily: "'Reddit Sans', sans-serif" }}
                >
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={slide.link || "#tours"}>
                    <button className="inline-flex items-center justify-center text-base font-medium h-12 rounded-md px-7 bg-[#1A96EB] hover:bg-[#1578BC] text-white transition-colors w-full sm:w-auto cursor-pointer shadow-sm">
                      {slide.buttonText || "Explore Tours"}
                    </button>
                  </a>
                  <a href={`tel:${phone?.replace(/\s+/g, '')}`}>
                    <button className="inline-flex items-center justify-center text-base font-medium h-12 rounded-md px-7 bg-white/10 border border-white text-white hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors w-full sm:w-auto cursor-pointer">
                      Call Now
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slider Controls Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-8 bg-orange-600" : "w-3 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
