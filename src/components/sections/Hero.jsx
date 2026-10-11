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
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={slide.link || "#tours"}
                    className="inline-flex items-center justify-center rounded-xl text-base font-semibold text-white px-7 py-3.5 bg-[#1A96EB] hover:bg-[#1578BC] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
                  >
                    {slide.buttonText || "Explore Tours"}
                  </a>
                  <a
                    href={`tel:+91${phone}`}
                    className="inline-flex items-center justify-center rounded-xl text-base font-semibold text-white px-7 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all border border-white/30"
                  >
                    Call: +91 {phone}
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
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-8 bg-[#1A96EB]" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
