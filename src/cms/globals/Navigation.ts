import { isCmsAdmin } from '@/cms/access';
import { CACHE_TAGS, triggerRevalidation } from '@/cms/hooks/revalidate';
import type { GlobalConfig } from 'payload';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true, update: isCmsAdmin },
  hooks: {
    afterChange: [
      ({ doc }) => {
        triggerRevalidation(undefined, [CACHE_TAGS.navigation]);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};
