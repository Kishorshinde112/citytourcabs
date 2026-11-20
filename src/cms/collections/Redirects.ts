import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    group: 'SYSTEM',
    useAsTitle: 'source',
  },
  access: { read: () => true, create: isCmsAdmin, update: isCmsAdmin, delete: isCmsAdmin },
  fields: [
    { name: 'source', type: 'text', required: true, admin: { description: 'e.g. /mumbai-darshan-cab-service' } },
    { name: 'destination', type: 'text', required: true, admin: { description: 'e.g. /mumbai-darshan' } },
    { name: 'permanent', type: 'checkbox', defaultValue: true },
  ],
};
