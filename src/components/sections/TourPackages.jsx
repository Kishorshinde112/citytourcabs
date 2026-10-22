'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function TourPackages({
  showMumbaiOnly = false,
  onSelectTour = undefined,
  onOpenBookModal = undefined,
  headingAs: Heading = 'h2',
  title = 'Explore Mumbai & Beyond',
  subtitle = 'Discover our range of convenient and comfortable cab services tailored to your needs.',
  tourIds = null,
}) {
  const defaultTourCards = [
    {
      id: "mumbai-darshan",
      title: "Mumbai Darshan",
      badge: "Discover Mumbai's iconic landmarks",
      description: "Discover Mumbai's iconic landmarks with our Mumbai Sightseeing Tours",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352016/citytourcabs/assets/tours/bd08021da8c244de8eafa9a4f86c4e2a30099151_yk3fsq4Dd4.jpg",
      href: "/tours/mumbai-darshan"
    },
    {
      id: "lonavala-trip",
      title: "Lonavala Trip",
      badge: "A Perfect Weekend Gateway!",
      description: "Escape the hustle and bustle of the city with our Lonavala Trip Package.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352375/citytourcabs/assets/tours/panvel_upscaled_image_2_HOyyQs2JHJ.webp",
      href: "/tours/lonavala-trip"
    },
    {
      id: "alibaug-sightseeing",
      title: "Alibaug Sightseeing",
      badge: "Coastal Paradise Near Mumbai",
      description: "Escape to the coastal charm of Alibaug with our reliable and comfortable cab services. Perfect for weekend getaways, family trips, or a peaceful beachside retreat near Mumbai.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792351954/citytourcabs/assets/tours/alibag_rt4bWntlkB.webp",
      href: "/tours/alibaug-sightseeing"
    },
    {
      id: "matheran-sightseeing",
      title: "Matheran Sightseeing",
      badge: "India's Smallest Hill Station",
      description: "Experience the charm of India's smallest hill station with our reliable and comfortable cab services to Matheran. Enjoy a pollution-free escape surrounded by lush greenery, scenic viewpoints, and peaceful nature trails.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352290/citytourcabs/assets/tours/matheran_82596VAAMO.webp",
      href: "/tours/matheran-sightseeing"
    },
    {
      id: "shirdi-tour",
      title: "Shirdi Tour",
      badge: "Spiritual Journey to Sai Baba's Abode",
      description: "Plan your spiritual journey to Shirdi with our reliable and comfortable cab service.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352407/citytourcabs/assets/tours/shirdi_p7RAPbKB9X.jpg",
      href: "/tours/shirdi-tour"
    },
    {
      id: "mahabaleshwar-sightseeing",
      title: "Mahabaleshwar Sightseeing",
      badge: "The Queen of Hill Stations",
      description: "Experience the scenic beauty of Mahabaleshwar with our reliable and comfortable cab service. Perfect for families, friends, and couples looking to unwind amidst nature.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352318/citytourcabs/assets/tours/mhabaleshwar_9KMZyI1jrD.webp",
      href: "/tours/mahabaleshwar-sightseeing"
    },
    {
      id: "igatpuri-tour",
      title: "Igatpuri Tour",
      badge: "Hills, Waterfall & Dams",
      description: "Escape the hustle and bustle of the city with our Igatpuri Trip Package",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352096/citytourcabs/assets/tours/igatpuri_final_7NAxDp2jVq.jpg",
      href: "/tours/igatpuri-tour"
    },
    {
      id: "ashtavinayak",
      title: "Ashtavinayak",
      badge: "Spiritual Trail of Lord Ganesha",
      description: "Ashtavinayak refers to a sacred pilgrimage of eight temples dedicated to Ganesha, all located in the Indian state of Maharashtra. The word comes from “Ashta” (eight) and “Vinayak” (a name of Ganesha).",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792351996/citytourcabs/assets/tours/astavinayak_final_lcm8iZIjgA.jpg",
      href: "/tours/ashtavinayak"
    },
    {
      id: "jyotirlinga-maharashtra",
      title: "3 Jyotirlinga in Maharashtra",
      badge: "WHERE HILLS MEET DEVOTION",
      description: "3 Jyotirlinga in Maharashtra by Car",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352126/citytourcabs/assets/tours/jtyotirling_qDvKgpsz20.jpg",
      href: "/tours/3-jyotirlinga-in-maharashtra"
    },
    {
      id: "konkan-darshan",
      title: "Konkan Darshan",
      badge: "Beach, Forts & Hills",
      description: "Escape to the coastal charm of Konkan with our reliable and comfortable cab services. Perfect for weekend getaways, family trips, or a peaceful beachside retreat.",
      image: "https://res.cloudinary.com/o0mbamog/image/upload/v1792352186/citytourcabs/assets/tours/konkan_darshan_HkVaCpJLtu.jpg",
      href: "/tours/konkan-darshan"
    }
  ];

  const [tourCards, setTourCards] = useState(defaultTourCards);

  useEffect(() => {
    let isMounted = true;
    async function loadTours() {
      try {
        const res = await fetch('/api/tours?limit=100&depth=1');
        const data = await res.json();
        const docs = Array.isArray(data.docs)
          ? data.docs
          : (data.success && Array.isArray(data.tours) ? data.tours : []);

        if (isMounted && docs.length > 0) {
          const mapped = docs.map((doc) => {
            const staticTour = defaultTourCards.find((t) => t.id === doc.slug || t.href === `/${doc.slug}`) || {};
            const details = Array.isArray(doc.layout) ? doc.layout.find((b) => b.blockType === 'tourDetails') : null;
            const cmsImage = typeof details?.heroImage === 'string' && !details.heroImage.includes('unsplash.com')
              ? details.heroImage
              : null;
            const finalImage = cmsImage || (typeof doc.banner === 'string' ? doc.banner : null) || staticTour.image || 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351884/citytourcabs/assets/about-banner.jpg';
            return {
              id: doc.slug || staticTour.id,
              title: doc.title || staticTour.title,
              badge: details?.subtitle || doc.subtitle || staticTour.badge || '',
              description: details?.description || doc.shortDescription || staticTour.description || '',
              image: finalImage,
              href: `/tours/${doc.slug || staticTour.id}`,
            };
          });
          setTourCards(mapped);
        }
      } catch (err) {
        console.error('Error fetching dynamic tours:', err);
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedIds = Array.isArray(tourIds) && tourIds.length
    ? tourIds
        .map((tour) => (tour && typeof tour === 'object' ? tour.slug || tour.id : tour))
        .filter(Boolean)
        .map(String)
    : null;

  const displayTours = tourCards.filter((tour) => {
    if (showMumbaiOnly && tour.id !== 'mumbai-darshan') return false;
    if (!selectedIds) return true;
    return selectedIds.includes(String(tour.id)) || selectedIds.some((id) => tour.href?.endsWith(`/${id}`));
  });

  return (
    <section id="tours" className="py-16 md:py-24 bg-blue-50 text-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <Heading className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-[Reddit_Sans]">
              {title || 'Explore Mumbai & Beyond'}
            </Heading>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 10 Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTours.map((tour, idx) => (
            <ScrollReveal key={tour.id} delay={(idx % 3) * 0.1} className="h-full">
              <div
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  {/* Tour Card Image */}
                  <a href={tour.href} className="block relative h-48 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
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
                      <h3 className="font-[Reddit_Sans] font-bold text-[18px] text-gray-900 mb-2">
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
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
