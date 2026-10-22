'use client';

import React from 'react';

export default function RateTableSection({ block = null }) {
  const rates = Array.isArray(block?.rates) ? block.rates : [];
  if (!rates.length) return null;

  return (
    <section className="py-14 md:py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        {block?.title && (
          <h2 className="mb-8 text-center text-3xl font-bold font-[Reddit_Sans] text-gray-900 md:text-4xl">
            {block.title}
          </h2>
        )}
        <div className="mx-auto max-w-5xl overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Seating</th>
                <th className="px-4 py-3 font-semibold">AC</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Extra / km</th>
                <th className="px-4 py-3 font-semibold">Toll & parking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rates.map((rate, index) => (
                <tr key={rate.id || index}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{rate.carType}</td>
                  <td className="px-4 py-3 text-gray-600">{rate.seating || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{rate.ac === false ? 'No' : 'Yes'}</td>
                  <td className="px-4 py-3 font-medium text-[#1A96EB]">{rate.rate}</td>
                  <td className="px-4 py-3 text-gray-600">{rate.perKm || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{rate.tollParking || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
