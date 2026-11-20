import type { Block } from 'payload';

export const HeroBlockConfig: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Banner',
    plural: 'Hero Banners',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Main Headline',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle / Tagline',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Background / Hero Image',
    },
  ],
};
