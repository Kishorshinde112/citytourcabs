import React, { useEffect, useRef, useState } from 'react';
import { Users, Luggage } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import { FLEET_DATA } from '@/data/fleetData';

const FALLBACK_IMAGE =
  'https://res.cloudinary.com/o0mbamog/image/upload/v1792351893/citytourcabs/assets/dzire-CAMjcjsT.jpg';

const defaultFleet = FLEET_DATA.map((car) => ({
  id: car.id,
  name: car.name,
  image: car.image || FALLBACK_IMAGE,
  seats: car.seats,
  seatsDesc: car.configuration || '',
  boot: car.bootSpace
    ? `${car.bootSpace}${car.luggage ? ` (${car.luggage})` : ''}`
    : '',
}));

const normalize = (value) => String(value || '').trim().toLowerCase();

// The array in fleetData.js determines the card order.
const orderById = new Map(FLEET_DATA.map((car, index) => [normalize(car.id), index]));
const orderByName = new Map(FLEET_DATA.map((car, index) => [normalize(car.name), index]));

function getOrder(car) {
  return orderById.get(normalize(car.id)) ??
    orderByName.get(normalize(car.name)) ??
    999;
}

function FleetPlaceholder({ index }) {
  return (
    <div
      key={`fleet-placeholder-${index}`}
      aria-hidden="true"
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <div className="h-48 bg-gray-700" />
      <div className="p-6 flex-1 space-y-4">
        <div className="h-6 w-2/3 rounded bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-700" />
        <div className="h-4 w-4/5 rounded bg-gray-700" />
      </div>
    </div>
  );
}

export default function FleetSection({ onOpenBookModal }) {
  // No temporary local cards: only the final CMS cards are ever displayed.
  // Local data is used only if the CMS request fails or returns no vehicles.
  const [fleetList, setFleetList] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let started = false;
    let observer;
    const controller = new AbortController();

    async function loadFleet() {
      if (started) return; // Fetch once, even if observer fires repeatedly.
      started = true;

      try {
        const res = await fetch('/api/fleet?limit=100', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Fleet API returned ${res.status}`);

        const data = await res.json();
        const docs = Array.isArray(data.docs)
          ? data.docs
          : Array.isArray(data.fleet)
            ? data.fleet
            : [];

        const mapped = docs.map((car) => {
          const original = defaultFleet.find(
            (item) =>
              normalize(item.id) === normalize(car.id) ||
              normalize(item.name) === normalize(car.name)
          );
          const cmsImage =
            typeof car.image === 'object' && car.image !== null
              ? car.image.url
              : car.image;

          return {
            ...car,
            image: cmsImage || car.imageUrl || original?.image || FALLBACK_IMAGE,
            seatsDesc: car.configuration || car.seatsDesc || '',
            boot: car.bootSpace
              ? `${car.bootSpace}${car.luggage ? ` (${car.luggage})` : ''}`
              : car.boot || '',
          };
        });

        // Sort BEFORE displaying cards, so there is no order change later.
        const sorted = [...mapped].sort((a, b) => getOrder(a) - getOrder(b));
        if (isMounted) setFleetList(sorted.length ? sorted : defaultFleet);
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        console.error('Error fetching dynamic fleet:', error);
        setFleetList(defaultFleet);
      }
    }

    // Original scroll-triggered lazy API request: 300px before gallery appears.
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            loadFleet();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(sectionRef.current);
    } else {
      loadFleet(); // Fallback for browsers without IntersectionObserver.
    }

    return () => {
      isMounted = false;
      observer?.disconnect();
      controller.abort();
    };
  }, []);

  const isReady = fleetList !== null;
  // Placeholders reserve layout space; they do NOT fetch images or CMS data.
  const cards = isReady ? fleetList : Array.from({ length: 6 }, () => null);
  const firstRow = cards.slice(0, 3);
  const secondRow = cards.slice(3);

  const renderCard = (car, idx, rowOffset) => (
    <ScrollReveal key={car.id || car.name} delay={(rowOffset + idx) * 0.1} className="h-full">

      <div
        className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col cursor-default"
      >

        <div className="relative h-48 overflow-hidden group">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="mb-3 font-bold text-lg text-white font-[Reddit_Sans]">
            {car.name}
          </h3>
          <div className="space-y-2 text-gray-300 text-sm flex-1">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" />
              <span>
                <strong className="text-white">{car.seats}</strong> {car.seatsDesc}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Luggage className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" />
              <span>{car.boot}</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );

  const renderItem = (car, idx, rowOffset) =>
    car ? (
      renderCard(car, idx, rowOffset)
    ) : (
      <FleetPlaceholder key={`skeleton-${rowOffset + idx}`} index={rowOffset + idx} />
    );

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-16 md:py-24 bg-gray-900 text-white lazy-render-scroll"
      aria-busy={!isReady}
    >
      <div className="container mx-auto px-4">
        {/* Keep the original scroll reveal on the section heading. */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-white font-[Reddit_Sans]">
              Our Cabs Gallery
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
              Take a look at our well-maintained fleet of comfortable and reliable vehicles.
            </p>
          </div>
        </ScrollReveal>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {firstRow.map((car, idx) => renderItem(car, idx, 0))}
        </div>

        {/* Row 2 */}
        {secondRow.length > 0 && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${secondRow.length >= 3 ? 'lg:grid-cols-3' : 'max-w-4xl mx-auto'} gap-6`}
          >
            {secondRow.map((car, idx) => renderItem(car, idx, 3))}
          </div>
        )}
      </div>
    </section>
  );
}
