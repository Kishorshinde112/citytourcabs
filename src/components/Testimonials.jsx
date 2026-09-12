import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Rajesh Sharma",
      location: "Mumbai",
      text: "Excellent service! The driver was not only professional but also acted as a great guide. He showed us all the hidden gems of Mumbai that we wouldn't have found on our own."
    },
    {
      name: "Priya Patel",
      location: "Pune",
      text: "Our trip to Lonavala was amazing thanks to CityTourCabs. The cab was clean, comfortable, and the driver's knowledge of the area made our journey memorable."
    },
    {
      name: "Amit Desai",
      location: "Thane",
      text: "Highly recommend for Shirdi trips! Punctual, courteous driver who made sure we had a comfortable and spiritual journey. Will definitely book again."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900 font-display">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-handwritten text-xl">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <Quote className="h-8 w-8 text-orange-600 opacity-20 mb-4" />
                
                {/* 5 Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
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
                <p className="text-gray-900 font-semibold">{rev.name}</p>
                <p className="text-sm text-gray-500">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
