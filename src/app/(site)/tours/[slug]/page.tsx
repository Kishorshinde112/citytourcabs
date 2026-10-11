import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import tourPagesData from '@/data/tourPagesData.json';
import TourDetailClient from './TourDetailClient';

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const data = tourPagesData as Record<string, any>;
  return Object.keys(data).map((slug) => ({
    slug,
  }));
}

async function getTourData(slug: string) {
  const fallback = (tourPagesData as Record<string, any>)[slug];

  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'tours',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (res.docs.length > 0) {
      const doc = res.docs[0] as any;
      const heroImageUrl =
        doc.heroImageMedia?.url ||
        (typeof doc.heroImageMedia === 'object' && doc.heroImageMedia?.filename
          ? `/media/${doc.heroImageMedia.filename}`
          : doc.heroImage || fallback?.heroImage || '/assets/about-banner.jpg');

      return {
        title: doc.title || fallback?.title,
        subtitle: doc.tagline || doc.description || fallback?.subtitle,
        heroImage: heroImageUrl,
        leftHtml: doc.itineraryHtml || fallback?.leftHtml || '',
        rightHtml: doc.rateTableHtml || fallback?.rightHtml || '',
        pricingTiers: doc.pricingTiers || [],
        sightseeingPoints: doc.sightseeingPoints || [],
        itinerary: doc.itinerary || [],
        inclusions: doc.inclusions || [],
        exclusions: doc.exclusions || [],
        tourFaqs: doc.tourFaqs || [],
      };
    }
  } catch (err) {
    console.warn(`[CMS Tour Fetch] Error fetching tour for ${slug}, falling back to static data:`, err);
  }

  return fallback || null;
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTourData(slug);

  if (!data) {
    return {
      title: 'Tour Details | City Tour Cabs',
    };
  }

  const title = `${data.title} | City Tour Cabs Mumbai`;
  const description =
    data.subtitle || `Book guided cab tour for ${data.title} with experienced drivers and sanitized cabs.`;
  const image = data.heroImage || '/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: data.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TourDetailPage({ params }: Args) {
  const { slug } = await params;
  const data = await getTourData(slug);

  if (!data) {
    notFound();
  }

  return <TourDetailClient slug={slug} data={data} />;
}
