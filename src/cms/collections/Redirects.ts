import { isCmsAdmin } from '@/cms/access';
import { CACHE_TAGS, triggerRevalidation } from '@/cms/hooks/revalidate';
import type { CollectionConfig } from 'payload';

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    group: 'SYSTEM',
    useAsTitle: 'source',
  },
  access: { read: () => true, create: isCmsAdmin, update: isCmsAdmin, delete: isCmsAdmin },
  hooks: {
    afterChange: [
      ({ doc }) => {
        triggerRevalidation(undefined, [CACHE_TAGS.redirects]);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        triggerRevalidation(undefined, [CACHE_TAGS.redirects]);
        return doc;
      },
    ],
  },
  fields: [
    { name: 'source', type: 'text', required: true, admin: { description: 'e.g. /mumbai-darshan-cab-service' } },
    { name: 'destination', type: 'text', required: true, admin: { description: 'e.g. /mumbai-darshan' } },
    { name: 'permanent', type: 'checkbox', defaultValue: true },
  ],
};
