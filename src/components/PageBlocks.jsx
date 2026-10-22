'use client';

import React from 'react';
import Hero from '@/components/sections/Hero';
import TourPackages from '@/components/sections/TourPackages';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import FleetSection from '@/components/sections/FleetSection';
import Testimonials from '@/components/sections/Testimonials';
import GallerySection from '@/components/sections/GallerySection';
import BookingContactForm from '@/components/sections/BookingContactForm';
import FAQSection from '@/components/sections/FAQSection';
import AboutSection from '@/components/sections/AboutSection';
import RichTextSection from '@/components/sections/RichTextSection';
import RateTableSection from '@/components/sections/RateTableSection';
import CTASection from '@/components/sections/CTASection';
import BookingFormSection from '@/components/sections/BookingFormSection';

/**
 * Render the Payload page layout blocks with the existing section components.
 * Unknown or tour-only blocks are ignored on generic marketing pages.
 */
export default function PageBlocks({ blocks = [] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        if (!block?.blockType) return null;
        const key = block.id || `${block.blockType}-${index}`;

        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} block={block} />;
          case 'tourGrid':
            return (
              <TourPackages
                key={key}
                title={block.title}
                tourIds={block.tours}
              />
            );
          case 'whyChooseUs':
            return <WhyChooseUs key={key} block={block} />;
          case 'fleet':
            return <FleetSection key={key} title={block.title} />;
          case 'testimonials':
            return <Testimonials key={key} title={block.title} />;
          case 'gallery':
            return <GallerySection key={key} title={block.title} />;
          case 'about':
            return <AboutSection key={key} block={block} />;
          case 'faq':
            return <FAQSection key={key} title={block.title} />;
          case 'bookingContactForm':
            return <BookingContactForm key={key} title={block.title} />;
          case 'bookingForm':
            return <BookingFormSection key={key} block={block} />;
          case 'richText':
            return <RichTextSection key={key} content={block.content} />;
          case 'rateTable':
            return <RateTableSection key={key} block={block} />;
          case 'cta':
            return <CTASection key={key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
