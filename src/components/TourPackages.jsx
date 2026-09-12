import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

export default function TourPackages({ showMumbaiOnly = false }) {
  const tourCards = [
    {
      id: "mumbai-darshan",
      title: "Mumbai Darshan",
      badge: "Discover Mumbai's iconic landmarks",
      description: "Discover Mumbai's iconic landmarks with our Mumbai Sightseeing Tours",
      image: "/assets/tours/bd08021da8c244de8eafa9a4f86c4e2a30099151_yk3fsq4Dd4.png",
      href: "/mumbai-darshan"
    },
    {
      id: "lonavala-trip",
      title: "Lonavala Trip",
      badge: "A Perfect Weekend Gateway!",
      description: "Escape the hustle and bustle of the city with our Lonavala Trip Package.",
      image: "/assets/tours/panvel_upscaled_image_2_HOyyQs2JHJ.webp",
      href: "/lonavala-trip"
    },
    {
      id: "alibaug-sightseeing",
      title: "Alibaug Sightseeing",
      badge: "Coastal Paradise Near Mumbai",
      description: "Escape to the coastal charm of Alibaug with our reliable and comfortable cab services. Perfect for weekend getaways, family trips, or a peaceful beachside retreat near Mumbai.",
      image: "/assets/tours/alibag_rt4bWntlkB.webp",
      href: "/alibaug-sightseeing"
    },
    {
      id: "matheran-sightseeing",
      title: "Matheran Sightseeing",
      badge: "India's Smallest Hill Station",
      description: "Experience the charm of India's smallest hill station with our reliable and comfortable cab services to Matheran. Enjoy a pollution-free escape surrounded by lush greenery, scenic viewpoints, and peaceful nature trails.",
      image: "/assets/tours/matheran_82596VAAMO.webp",
      href: "/matheran-sightseeing"
    },
    {
      id: "shirdi-tour",
      title: "Shirdi Tour",
      badge: "Spiritual Journey to Sai Baba's Abode",
      description: "Plan your spiritual journey to Shirdi with our reliable and comfortable cab service.",
      image: "/assets/tours/shirdi_p7RAPbKB9X.jpeg",
      href: "/shirdi-tour"
    },
    {
      id: "mahabaleshwar-sightseeing",
      title: "Mahabaleshwar Sightseeing",
      badge: "The Queen of Hill Stations",
      description: "Experience the scenic beauty of Mahabaleshwar with our reliable and comfortable cab service. Perfect for families, friends, and couples looking to unwind amidst nature.",
      image: "/assets/tours/mhabaleshwar_9KMZyI1jrD.webp",
      href: "/mahabaleshwar-sightseeing"
    },
    {
      id: "igatpuri-tour",
      title: "Igatpuri Tour",
      badge: "Hills, Waterfall & Dams",
      description: "Escape the hustle and bustle of the city with our Igatpuri Trip Package",
      image: "/assets/tours/igatpuri_final_7NAxDp2jVq.jpg",
      href: "/igatpuri-tour"
    },
    {
      id: "ashtavinayak",
      title: "Ashtavinayak",
      badge: "Spiritual Trail of Lord Ganesha",
      description: "Ashtavinayak refers to a sacred pilgrimage of eight temples dedicated to Ganesha, all located in the Indian state of Maharashtra. The word comes from “Ashta” (eight) and “Vinayak” (a name of Ganesha).",
      image: "/assets/tours/astavinayak_final_lcm8iZIjgA.jpg",
      href: "/ashtavinayak"
    },
    {
      id: "jyotirlinga-maharashtra",
      title: "3 Jyotirlinga in Maharashtra",
      badge: "WHERE HILLS MEET DEVOTION",
      description: "3 Jyotirlinga in Maharashtra by Car",
      image: "/assets/tours/jtyotirling_qDvKgpsz20.jpg",
      href: "/3-jyotirlinga-in-maharashtra"
    },
    {
      id: "konkan-darshan",
      title: "Konkan Darshan",
      badge: "Beach, Forts & Hills",
      description: "Escape to the coastal charm of Konkan with our reliable and comfortable cab services. Perfect for weekend getaways, family trips, or a peaceful beachside retreat.",
      image: "/assets/tours/konkan_darshan_HkVaCpJLtu.jpg",
      href: "/konkan-darshan"
    }
  ];

  const displayTours = showMumbaiOnly
    ? tourCards.filter(t => t.id === 'mumbai-darshan')
    : tourCards;

  return (
    <section id="tours" className="py-16 md:py-24 bg-blue-50 text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Explore Mumbai & Beyond
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Discover our range of convenient and comfortable cab services tailored to your needs.
          </p>
        </div>

        {/* 10 Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Tour Card Image */}
                <a href={tour.href} className="block relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
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
                    <h3 className="font-display font-bold text-[18px] text-gray-900 mb-2">
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
          ))}
        </div>

      </div>
    </section>
  );
}
