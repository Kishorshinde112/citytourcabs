import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import tourPagesData from '@/data/tourPagesData.json';
import TourDetailClient from './TourDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateLeftHtml(details: any, fallbackLeftHtml?: string): string {
  if (!details) return fallbackLeftHtml || '';
  const hasAttractions = Array.isArray(details.attractions) && details.attractions.length > 0;
  const hasRules = Array.isArray(details.rules) && details.rules.length > 0;
  const description = details.description || details.shortSummary || '';
  if (!hasAttractions && !hasRules && !description) return fallbackLeftHtml || '';

  const parts: string[] = [];
  const guideMessage = details.guideChauffeurMessage || 'Get drivers who act as a guide';

  parts.push(`
    <div style="margin-bottom: 2rem; text-align: left;">
      ${guideMessage ? `<p style="font-size: 1.125rem; line-height: 1.75rem; color: #374151;"><strong><span style="color: rgb(45, 194, 107);">${escapeHtml(guideMessage)}</span></strong></p>` : ''}
      ${description ? `<p style="font-size: 1.125rem; line-height: 1.75rem; color: #374151;">${escapeHtml(description)}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
    </div>
  `);

  if (hasRules) {
    const rulesList = details.rules
      .map((r: any) => {
        const text = typeof r === 'string' ? r : r.text || '';
        if (!text) return '';
        return `
          <li style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; color: #374151;">
            <span style="color: #ea580c; flex-shrink: 0; margin-top: 0.15rem; font-weight: bold;">✓</span>
            <span>${escapeHtml(text)}</span>
          </li>
        `;
      })
      .filter(Boolean)
      .join('\n');

    parts.push(`
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem; font-size: 20px; font-weight: bold; color: #1e293b;">Rules To be Noted</h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${rulesList}
        </ul>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
      </div>
    `);
  }

  if (hasAttractions) {
    const attractionTitle = details.attractionTitle || 'Tour Highlights points to visit';
    const attractionsList = details.attractions
      .map((att: any, idx: number) => {
        const emoji = att.emoji ? `${att.emoji} ` : '';
        const name = att.name || '';
        const desc = att.desc ? ` <span style="color: #64748b; font-size: 0.9em;">(${escapeHtml(att.desc)})</span>` : '';
        return `
          <li style="margin-bottom: 0.5rem;">
            <strong>${idx + 1}. ${emoji}${escapeHtml(name)}</strong>${desc}
          </li>
        `;
      })
      .join('\n');

    parts.push(`
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1.5rem; font-size: 26px; font-weight: bold; font-family: 'Reddit Sans', sans-serif; color: #1e293b;">${escapeHtml(attractionTitle)}</h2>
        <div style="background-color: #eff6ff; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #dbeafe;">
          <ol style="margin: 0; padding-left: 1.25rem; line-height: 1.8; color: #1e293b;">
            ${attractionsList}
          </ol>
        </div>
      </div>
    `);
  }

  return parts.join('\n');
}

function generateRightHtml(details: any, fallbackRightHtml?: string): string {
  if (!details) return fallbackRightHtml || '';
  const hasRates = Array.isArray(details.rates) && details.rates.length > 0;
  if (!hasRates && !details.coverageDetails && !details.tempoTraveller13Rate && !details.tempoTraveller17Rate) {
    return fallbackRightHtml || '';
  }

  const parts: string[] = [];
  if (hasRates) {
    const cols = Array.isArray(details.rateColumns) && details.rateColumns.length > 0
      ? details.rateColumns.map((c: any) => c.colName || '')
      : [];

    let columns: string[] = [];
    if (cols.length > 0) {
      columns = ['Vehicle', ...cols];
    } else {
      columns = ['Vehicle', '8 Hrs / 80 Kms', '10 Hrs / 100 Kms', '12 Hrs / 120 Kms', 'Extra Kms / Extra Hrs'];
    }

    const thead = `
      <thead>
        <tr style="background: rgb(243, 244, 246);">
          ${columns.map((c: string) => `<th>${escapeHtml(c)}</th>`).join('')}
        </tr>
      </thead>
    `;

    const tbodyRows = details.rates.map((r: any) => {
      const cells: string[] = [`<td><strong>${escapeHtml(r.vehicle || '')}</strong></td>`];

      if (cols.length === 2) {
        cells.push(`<td>${escapeHtml(r.col1 || r.h8 || '-')}</td>`);
        cells.push(`<td>${escapeHtml(r.col2 || r.h10 || '-')}</td>`);
      } else if (cols.length === 3) {
        cells.push(`<td>${escapeHtml(r.col1 || r.h8 || '-')}</td>`);
        cells.push(`<td>${escapeHtml(r.col2 || r.h10 || '-')}</td>`);
        cells.push(`<td>${escapeHtml(r.extra || r.h12 || '-')}</td>`);
      } else {
        const extraFormatted = r.extra ? escapeHtml(r.extra).replace(/\n/g, '<br/>') : '-';
        cells.push(`<td>${escapeHtml(r.h8 || r.col1 || '-')}</td>`);
        cells.push(`<td>${escapeHtml(r.h10 || r.col2 || '-')}</td>`);
        cells.push(`<td>${escapeHtml(r.h12 || '-')}</td>`);
        cells.push(`<td>${extraFormatted}</td>`);
      }

      return `<tr>${cells.join('')}</tr>`;
    });

    if (details.tempoTraveller13Rate) {
      tbodyRows.push(`
        <tr>
          <td><strong>13 Seater<br/>A/C Traveller</strong></td>
          <td colspan="${columns.length - 1}">
            <p>Full Day Tour</p>
            <p><strong>${escapeHtml(details.tempoTraveller13Rate)}</strong></p>
          </td>
        </tr>
      `);
    }

    if (details.tempoTraveller17Rate) {
      tbodyRows.push(`
        <tr>
          <td><strong>17 Seater<br/>A/C Traveller</strong></td>
          <td colspan="${columns.length - 1}">
            <p>Full Day Tour</p>
            <p><strong>${escapeHtml(details.tempoTraveller17Rate)}</strong></p>
          </td>
        </tr>
      `);
    }

    parts.push(`
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        ${thead}
        <tbody>
          ${tbodyRows.join('\n')}
        </tbody>
      </table>
    `);
  }

  if (details.coverageDetails) {
    const coverageFormatted = escapeHtml(details.coverageDetails).replace(/\n/g, '<br/>');
    parts.push(`
      <div style="margin-top: 1.5rem; font-size: 0.875rem; color: #4b5563; line-height: 1.6;">
        <p><strong>Package Coverage Details</strong><br/>${coverageFormatted}</p>
      </div>
    `);
  }

  return parts.join('\n');
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
      const detailsBlock =
        Array.isArray(doc.layout) && doc.layout.find((b: any) => b.blockType === 'tourDetails')
          ? doc.layout.find((b: any) => b.blockType === 'tourDetails')
          : doc.layout?.[0];

      const heroImageUrl =
        doc.heroImageMedia?.url ||
        (typeof doc.heroImageMedia === 'object' && doc.heroImageMedia?.filename
          ? `/media/${doc.heroImageMedia.filename}`
          : detailsBlock?.heroImage || doc.heroImage || fallback?.heroImage || '/assets/about-banner.jpg');

      const leftHtml = doc.itineraryHtml || generateLeftHtml(detailsBlock, fallback?.leftHtml);
      const rightHtml = doc.rateTableHtml || generateRightHtml(detailsBlock, fallback?.rightHtml);

      return {
        title: doc.title || detailsBlock?.tourName || fallback?.title,
        subtitle: detailsBlock?.subtitle || doc.tagline || doc.description || fallback?.subtitle,
        heroImage: heroImageUrl,
        leftHtml,
        rightHtml,
        pricingTiers: doc.pricingTiers || [],
        sightseeingPoints: doc.sightseeingPoints || [],
        itinerary: doc.itinerary || [],
        inclusions: doc.inclusions || [],
        exclusions: doc.exclusions || [],
        tourFaqs: doc.tourFaqs || [],
        seo: doc.seo || null,
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

  const title = data.seo?.title || `${data.title} | City Tour Cabs Mumbai`;
  const description =
    data.seo?.description ||
    data.subtitle ||
    `Book guided cab tour for ${data.title} with experienced drivers and sanitized cabs.`;
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
