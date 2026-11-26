'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const DEFAULT_REVIEWS = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Excellent service! The driver was not only professional but also acted as a great guide. He showed us all the hidden gems of Mumbai that we wouldn't have found on our own.",
  },
  {
    name: "Priya Patel",
    location: "Pune",
    rating: 5,
    text: "Our trip to Lonavala was amazing thanks to CityTourCabs. The cab was clean, comfortable, and the driver's knowledge of the area made our journey memorable.",
  },
  {
    name: "Amit Desai",
    location: "Thane",
    rating: 5,
    text: "Highly recommend for Shirdi trips! Punctual, courteous driver who made sure we had a comfortable and spiritual journey. Will definitely book again.",
  },
];

export default function Testimonials({
  title = 'What Our Customers Say',
  subtitle = "Don't just take our word for it - hear from our satisfied customers.",
  initialReviews = null,
}: {
  title?: string;
  subtitle?: string;
  initialReviews?: any[] | null;
}) {
  const hasInitial = Array.isArray(initialReviews) && initialReviews.length > 0;
  const [reviews, setReviews] = useState(hasInitial ? initialReviews : DEFAULT_REVIEWS);

  const sectionRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hasInitial) return;
    let active = true;

    async function loadTestimonials() {
      try {
        const res = await fetch('/api/testimonials?limit=100&depth=0');
        if (res.ok && active) {
          const data = await res.json();
          const docs = Array.isArray(data.docs)
            ? data.docs
            : Array.isArray(data.testimonials)
              ? data.testimonials
              : [];
          if (docs.length > 0) {
            setReviews(
              docs.map((item: any) => ({
                name: item.name,
                location: item.location || '',
                text: item.text || item.comment,
                rating: item.rating || 5,
              }))
            );
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            loadTestimonials();
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
      loadTestimonials();
    }
  }, [hasInitial]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white text-gray-900 lazy-render-scroll">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900 font-display">
              {title || 'What Our Customers Say'}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto font-handwritten text-xl md:text-2xl">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev: any, idx: number) => {
            const ratingCount = Math.min(5, Math.max(1, Number(rev.rating) || 5));
            return (
              <ScrollReveal key={idx} delay={idx * 0.15} className="h-full">
                <div className="bg-white rounded-xl border border-gray-200 p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                  <div>
                    <Quote className="h-8 w-8 text-orange-700 opacity-20 mb-4" aria-hidden="true" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4" aria-label={`${ratingCount} out of 5 stars`}>
                      {[...Array(ratingCount)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-6 italic text-sm sm:text-base leading-relaxed">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <p className="font-semibold text-gray-900 font-display">{rev.name}</p>
                    <p className="text-sm text-gray-600">{rev.location}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
