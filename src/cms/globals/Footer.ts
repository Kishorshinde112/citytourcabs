import { isCmsAdmin } from '@/cms/access';
import type { GlobalConfig } from 'payload';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true, update: isCmsAdmin },
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
