import { Vehicle } from './types';
import { FLEET_DATA } from '@/data/fleetData';

export async function getActiveFleet(): Promise<Vehicle[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/fleet?limit=50&depth=1`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      if (docs.length > 0) {
        return docs.map((doc: any) => ({
          id: doc.id || doc.name?.toLowerCase().replace(/\s+/g, '-'),
          name: doc.name,
          category: doc.category || 'Standard',
          tag: doc.tag,
          seats: doc.seating || doc.seats || '4+1',
          luggage: doc.luggage || '2-3 Bags',
          ratePerKm: doc.rate_per_km || doc.ratePerKm || '₹12/km',
          image: doc.image_url || doc.image || 'https://res.cloudinary.com/o0mbamog/image/upload/v1792351893/citytourcabs/assets/dzire-CAMjcjsT.jpg',
          features: Array.isArray(doc.features) ? doc.features.map((f: any) => (typeof f === 'string' ? f : f.feature)) : [],
          bestFor: doc.bestFor,
        }));
      }
    }
  } catch {
    // Graceful fallback to static data
  }
  return FLEET_DATA as unknown as Vehicle[];
}
