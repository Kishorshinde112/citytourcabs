import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { CACHE_TAGS } from '@/cms/hooks/revalidate';
import { Vehicle } from './types';
import { FLEET_DATA } from '@/data/fleetData';

const FALLBACK_IMAGE =
  'https://res.cloudinary.com/o0mbamog/image/upload/v1792351893/citytourcabs/assets/dzire-CAMjcjsT.jpg';

const normalizeKey = (value: unknown) => String(value || '').trim().toLowerCase();
const orderById = new Map(FLEET_DATA.map((car, index) => [normalizeKey(car.id), index]));
const orderByName = new Map(FLEET_DATA.map((car, index) => [normalizeKey(car.name), index]));

function getFleetOrder(car: { id?: string; name?: string }) {
  return (
    orderById.get(normalizeKey(car.id)) ??
    orderByName.get(normalizeKey(car.name)) ??
    999
  );
}

const DEFAULT_VEHICLES: Array<Vehicle & { seatsDesc?: string; boot?: string }> = FLEET_DATA.map((car) => ({
  ...car,
  image: car.image || FALLBACK_IMAGE,
  seatsDesc: car.configuration || '',
  boot: car.bootSpace ? `${car.bootSpace}${car.luggage ? ` (${car.luggage})` : ''}` : '',
}));

const fetchCachedFleet = unstable_cache(
  async (): Promise<Array<Vehicle & { seatsDesc?: string; boot?: string }>> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: 'fleet',
        limit: 100,
        depth: 1,
        overrideAccess: true,
      });

      const docs = Array.isArray(res.docs) ? res.docs : [];
      if (docs.length > 0) {
        const mapped = docs.map((doc: any) => {
          const fallback = DEFAULT_VEHICLES.find(
            (item) =>
              normalizeKey(item.id) === normalizeKey(doc.id) ||
              normalizeKey(item.name) === normalizeKey(doc.name)
          );
          const cmsImage =
            typeof doc.image === 'object' && doc.image !== null
              ? doc.image.url
              : doc.image;
          const featuresList = Array.isArray(doc.features)
            ? doc.features.map((f: any) => (typeof f === 'string' ? f : f?.feature)).filter(Boolean)
            : typeof doc.features === 'string'
              ? doc.features
                  .split(/\r?\n/)
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : fallback?.features || [];

          const bootSpace = doc.bootSpace || fallback?.bootSpace || '';
          const luggage = doc.luggage || fallback?.luggage || '2-3 Bags';
          const configuration = doc.configuration || doc.seatsDesc || fallback?.configuration || '';

          return {
            id: String(doc.id || doc.name?.toLowerCase().replace(/\s+/g, '-') || fallback?.id || 'cab'),
            name: doc.name || fallback?.name || 'City Tour Cab',
            category: doc.category || fallback?.category || 'Standard',
            tag: doc.tag || fallback?.tag,
            badgeColor: doc.badgeColor || fallback?.badgeColor,
            seats: doc.seating || doc.seats || fallback?.seats || '4 + 1 Passengers',
            configuration,
            seatsDesc: configuration,
            bootSpace,
            luggage,
            boot: bootSpace ? `${bootSpace}${luggage ? ` (${luggage})` : ''}` : fallback?.boot || luggage,
            acType: doc.acType || fallback?.acType,
            fuelType: doc.fuelType || fallback?.fuelType,
            ratePerKm: doc.rate_per_km || doc.ratePerKm || fallback?.ratePerKm || '₹12/km',
            localFullDay: doc.localFullDay || fallback?.localFullDay,
            image: cmsImage || doc.image_url || doc.imageUrl || fallback?.image || FALLBACK_IMAGE,
            features: featuresList,
            bestFor: doc.bestFor || fallback?.bestFor,
          };
        });

        return [...mapped].sort((a, b) => getFleetOrder(a) - getFleetOrder(b));
      }
    } catch (error) {
      console.warn('[Fleet Queries] Using static fallback fleet:', error instanceof Error ? error.message : error);
    }

    return DEFAULT_VEHICLES;
  },
  ['cms-fleet'],
  { revalidate: 300, tags: [CACHE_TAGS.fleet] }
);

export const getActiveFleet = cache(async () => fetchCachedFleet());
