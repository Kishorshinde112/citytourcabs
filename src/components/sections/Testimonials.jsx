'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '@/data/testimonialsData';

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

export default function Testimonials() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setReviews(
              data.testimonials.map((item) => ({
                name: item.name,
                location: item.location || '',
                text: item.comment || item.text,
                rating: item.rating || 5,
              }))
            );
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900 font-[Reddit_Sans]">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-handwritten" style={{ fontSize: "1.25rem" }}>
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <Quote className="h-8 w-8 text-orange-600 opacity-20 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(Math.min(5, rev.rating || 5))].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 mb-6 italic text-sm sm:text-base leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              {/* Author */}
              <div>
                <p className="font-semibold text-gray-900 font-[Reddit_Sans]">{rev.name}</p>
                <p className="text-sm text-gray-500">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
