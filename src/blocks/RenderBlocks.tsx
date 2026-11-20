'use client';

import React from 'react';
import Hero from './HeroBlock';
import TourPackages from '@/modules/tours/components/TourGrid';
import WhyChooseUs from './WhyChooseUsBlock';
import FleetSection from '@/modules/fleet/components/FleetGrid';
import Testimonials from './ReviewsBlock';
import BookingContactForm from '@/modules/bookings/components/BookingContactForm';
import FAQSection from './FAQBlock';
import AboutSection from '@/components/sections/AboutSection';
import RichTextSection from '@/components/sections/RichTextSection';
import RateTableSection from './RateTableBlock';
import CTASection from '@/components/sections/CTASection';
import BookingFormSection from '@/components/sections/BookingFormSection';

/**
 * RenderBlocks: Master switch that maps Payload CMS block arrays to React UI components.
 */
export default function RenderBlocks({ blocks = [] }: { blocks?: any[] }) {
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

export { RenderBlocks as PageBlocks };
