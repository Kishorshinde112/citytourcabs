import type { Block } from 'payload';

export const WhyChooseUsBlockConfig: Block = {
  slug: 'whyChooseUs',
  labels: {
    singular: 'Why Choose Us',
    plural: 'Why Choose Us Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Why Choose City Tour Cabs?',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Key Features',
      fields: [
        { name: 'icon', type: 'text', label: 'Icon Name' },
        { name: 'title', type: 'text', required: true, label: 'Feature Title' },
        { name: 'description', type: 'textarea', required: true, label: 'Description' },
      ],
    },
  ],
};
