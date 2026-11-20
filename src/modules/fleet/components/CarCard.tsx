import React from 'react';
import { Users, Luggage } from 'lucide-react';
import { Vehicle } from '../types';

interface CarCardProps {
  car: Vehicle;
  onBookClick?: (carName: string) => void;
}

export function CarCard({ car, onBookClick }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {car.tag && (
            <span className="absolute top-3 right-3 bg-[#1A96EB] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
              {car.tag}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold font-[Reddit_Sans] text-gray-900 mb-2">
            {car.name}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#1A96EB]" />
              {car.seats}
            </span>
            <span className="flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-[#1A96EB]" />
              {car.luggage}
            </span>
          </div>
          {car.features && car.features.length > 0 && (
            <ul className="text-xs text-gray-500 space-y-1 mb-4">
              {car.features.slice(0, 3).map((f, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-green-500 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="p-5 pt-0">
        <button
          onClick={() => onBookClick && onBookClick(car.name)}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1A96EB] hover:bg-[#1578BC] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          Book {car.name}
        </button>
      </div>
    </div>
  );
}
