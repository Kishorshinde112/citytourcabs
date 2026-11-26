import { isCmsAdmin } from '@/cms/access';
import { CACHE_TAGS, triggerRevalidation } from '@/cms/hooks/revalidate';
import type { GlobalConfig } from 'payload';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true, update: isCmsAdmin },
  hooks: {
    afterChange: [
      ({ doc }) => {
        triggerRevalidation(undefined, [CACHE_TAGS.footer]);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'copyright', type: 'text' },
  ],
};
