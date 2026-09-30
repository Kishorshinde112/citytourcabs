import React from 'react';
import { Users, Luggage } from 'lucide-react';

export default function FleetSection({ onOpenBookModal }) {
  const fleet = [
    {
      id: "wagonr",
      name: "Wagon R",
      image: "/assets/wagonr-Ct1Y7D7H.jpg",
      seats: "4+1 seats",
      seatsDesc: "across multiple rows. 2 seats in the front row, 3 seats in the back row.",
      boot: "With all seats up, the Wagon R offers 341 liters of boot space, which is decent for luggage when all seats are in use. (For e.g., 4 medium size bags)"
    },
    {
      id: "dzire",
      name: "Swift Dzire / Hyundai Accent",
      image: "/assets/dzire-CAMjcjsT.jpg",
      seats: "4+1 seats",
      seatsDesc: "across multiple rows. 2 seats in the front row, 3 seats in the back row.",
      boot: "With all seats up, the Swift Dzire / Hyundai Accent offers 382 liters of boot space, which is decent for luggage when all seats are in use. (For e.g., 4 medium size bags)"
    },
    {
      id: "ertiga",
      name: "Maruti Ertiga",
      image: "/assets/ertiga-Bq9MdWD-.jpg",
      seats: "6+1 seats",
      seatsDesc: "across multiple rows. 2 seats in the front row, 3 seats in the middle row, and 2 seats in the third row.",
      boot: "With all seats up, the Maruti Ertiga offers 209 liters of boot space, which is decent for luggage when all seats are in use. (For e.g., 2 medium size bags)"
    },
    {
      id: "carens",
      name: "Kia Caren",
      image: "/assets/carens-CBBO8xCr.jpg",
      seats: "7 seats",
      seatsDesc: "across multiple rows. 2 seats in the front row, 3 seats in the middle row, and 2 seats in the third row.",
      boot: "With all seats up, the Kia Caren offers 216 liters of boot space, which is decent for luggage when all seats are in use. (For e.g., 2 medium size bags)"
    },
    {
      id: "innova",
      name: "Innova Crysta",
      image: "/assets/innova-B7xv-cs5.jpg",
      seats: "7+1 seats",
      seatsDesc: "across multiple rows. 2 seats in the front row, 3 seats in the middle row, and 3 seats in the third row (with more comfort and luxurious space).",
      boot: "With all seats up, the Innova Crysta offers 300 liters of boot space, which is quite spacious for luggage when all seats are in use. (For e.g., 3 medium size bags)"
    }
  ];

  const firstRow = fleet.slice(0, 3);
  const secondRow = fleet.slice(3, 5);

  const renderCard = (car) => (
    <div key={car.id} className="h-full">
      <div 
        onClick={() => onOpenBookModal && onOpenBookModal({ carType: car.name })}
        className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden group bg-white flex items-center justify-center p-2">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="mb-3 font-bold text-lg text-white font-display">
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
    </div>
  );

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-white font-display">
            Our Cabs Gallery
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            Take a look at our well-maintained fleet of comfortable and reliable vehicles.
          </p>
        </div>

        {/* Row 1: 3 Cabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {firstRow.map(renderCard)}
        </div>

        {/* Row 2: 2 Cabs Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {secondRow.map(renderCard)}
        </div>

      </div>
    </section>
  );
}
