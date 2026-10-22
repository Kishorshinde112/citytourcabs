'use client';

import React from 'react';

export default function CTASection({ block = null }) {
  if (!block?.headline) return null;

  const isSecondary = block.style === 'secondary';
  const href = block.buttonLink || '/tours';

  return (
    <section className={`py-14 md:py-20 ${isSecondary ? 'bg-gray-900' : 'bg-[#1A96EB]'}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white md:text-4xl font-[Reddit_Sans]">
          {block.headline}
        </h2>
        {block.buttonText && (
          <a
            href={href}
            className={`mt-7 inline-flex items-center justify-center rounded-md px-7 py-3 text-sm font-semibold transition-colors ${
              isSecondary
                ? 'bg-white text-gray-900 hover:bg-orange-50'
                : 'bg-white text-[#1A96EB] hover:bg-blue-50'
            }`}
          >
            {block.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
