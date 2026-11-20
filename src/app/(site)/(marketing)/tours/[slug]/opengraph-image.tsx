import { ImageResponse } from 'next/og';
import { getTourBySlug } from '@/modules/tours/queries';

export const runtime = 'nodejs';
export const alt = 'City Tour Cabs Tour Package';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  const title = tour?.title || 'Tour Package Mumbai';
  const subtitle = tour?.tagline || 'Guided Sightseeing with City Tour Cabs';
  const price = tour?.startingPrice ? `Starting from ${tour.startingPrice}` : 'Affordable AC Cabs';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundImage: 'linear-gradient(to bottom right, #001f3f, #1A96EB)',
          padding: '60px 80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#ffffff',
              background: '#007cdb',
              padding: '8px 24px',
              borderRadius: '999px',
            }}
          >
            City Tour Cabs Mumbai
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 56, fontWeight: 'bold', lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: '#e0f2fe' }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid rgba(255,255,255,0.2)',
            paddingTop: '24px',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fef08a' }}>
            {price}
          </div>
          <div style={{ fontSize: 24, color: '#e0f2fe' }}>
            📞 +91 7021001921 • citytourcabs.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
