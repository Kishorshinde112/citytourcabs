import type { Metadata } from 'next';
import { SEO_CONSTANTS } from './constants';

export interface MetadataOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description = SEO_CONSTANTS.defaultDescription,
  canonical,
  image = SEO_CONSTANTS.defaultOgImage,
  keywords,
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  // Strip redundant brand suffixes if passed directly to avoid double suffix with layout template
  const cleanTitle = (title || SEO_CONSTANTS.defaultTitle)
    .replace(/\s*\|\s*City Tour Cabs(?: Mumbai)?$/i, '')
    .trim();

  // Resolve canonical: only set when explicitly provided (absolute or relative)
  // NEVER fall back to root homepage URL, which tricks search engines into de-indexing subpages!
  let canonicalUrl: string | undefined = undefined;
  if (canonical) {
    canonicalUrl = canonical.startsWith('http')
      ? canonical
      : `${SEO_CONSTANTS.siteUrl}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
  }

  // Optimize Cloudinary image dimensions if not already transformed
  let ogImageUrl = image;
  if (ogImageUrl.includes('res.cloudinary.com') && !ogImageUrl.includes('w_1200')) {
    ogImageUrl = ogImageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1200,h_630,c_fill/');
  }

  return {
    title: cleanTitle,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: cleanTitle,
      description,
      url: canonicalUrl || SEO_CONSTANTS.siteUrl,
      siteName: SEO_CONSTANTS.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
  };
}
