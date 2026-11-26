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
import { getInitialTourCards } from '@/modules/tours/queries';
import { getActiveFleet } from '@/modules/fleet/queries';
import { getFaqs, getTestimonials } from '@/lib/cmsGlobals';
import { lexicalToHtml } from '@/lib/lexical';

/**
 * RenderBlocks: Server Component that maps Payload CMS block arrays to React UI components
 * and server-hydrates dynamic collections so client components render without API waterfalls.
 */
export default async function RenderBlocks({
  blocks = [],
  initialTours = null,
}: {
  blocks?: any[];
  initialTours?: any[] | null;
}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  const blockTypes = new Set(blocks.map((b) => b?.blockType).filter(Boolean));
  const needsTours = blockTypes.has('tourGrid') || blockTypes.has('bookingContactForm');

  const [resolvedTours, resolvedFleet, resolvedTestimonials, resolvedFaqs] = await Promise.all([
    needsTours
      ? initialTours && initialTours.length > 0
        ? Promise.resolve(initialTours)
        : getInitialTourCards()
      : Promise.resolve(null),
    blockTypes.has('fleet') ? getActiveFleet() : Promise.resolve(null),
    blockTypes.has('testimonials') ? getTestimonials() : Promise.resolve(null),
    blockTypes.has('faq') ? getFaqs() : Promise.resolve(null),
  ]);

  const initialDestinations = resolvedTours?.map((t: any) => t.title).filter(Boolean) || null;

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
                initialTours={resolvedTours}
              />
            );
          case 'whyChooseUs':
            return <WhyChooseUs key={key} block={block} />;
          case 'fleet':
            return (
              <FleetSection
                key={key}
                title={block.title}
                initialFleet={resolvedFleet}
              />
            );
          case 'testimonials':
            return (
              <Testimonials
                key={key}
                title={block.title}
                initialReviews={resolvedTestimonials}
              />
            );
          case 'about':
            return <AboutSection key={key} block={block} />;
          case 'faq':
            return (
              <FAQSection
                key={key}
                title={block.title}
                initialFaqs={resolvedFaqs}
              />
            );
          case 'bookingContactForm':
            return (
              <BookingContactForm
                key={key}
                title={block.title}
                initialDestinations={initialDestinations}
              />
            );
          case 'bookingForm':
            return <BookingFormSection key={key} block={block} />;
          case 'richText':
            return <RichTextSection key={key} contentHtml={lexicalToHtml(block.content)} />;
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
