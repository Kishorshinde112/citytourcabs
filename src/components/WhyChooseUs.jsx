import React from 'react';
import { Clock, Headphones, Users, Shield, MapPin, Star } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Clock,
      title: "On-Time Pickup",
      desc: "Punctual service guaranteed every time",
      stat: "99%",
      statLabel: "On-Time Rate"
    },
    {
      icon: Headphones,
      title: "24/7 Service",
      desc: "Available round the clock for your needs",
      stat: "24/7",
      statLabel: "Always Ready"
    },
    {
      icon: Users,
      title: "Experienced Drivers",
      desc: "Professional drivers with local expertise",
      stat: "10+",
      statLabel: "Years Experience"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      desc: "Verified drivers and well-maintained vehicles",
      stat: "100%",
      statLabel: "Safety First"
    },
    {
      icon: MapPin,
      title: "Local Knowledge",
      desc: "Drivers who know every corner and hidden gem",
      stat: "500+",
      statLabel: "Destinations"
    },
    {
      icon: Star,
      title: "Highly Rated",
      desc: "Trusted by thousands of satisfied customers",
      stat: "4.8",
      statLabel: "Average Rating"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-orange-100 to-orange-50 text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Why Choose CityTourCabs?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Experience the difference with our commitment to excellence, reliability, and customer satisfaction.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 font-bold text-gray-900 font-display text-lg">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {feat.desc}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-orange-600 font-bold text-xl">
                        {feat.stat}
                      </span>
                      <span className="text-xs text-gray-500">
                        {feat.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
