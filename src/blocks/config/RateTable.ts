import type { Block } from 'payload';

export const RateTableBlockConfig: Block = {
  slug: 'rateTable',
  labels: {
    singular: 'Rate Table',
    plural: 'Rate Tables',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Table Heading',
    },
    {
      name: 'headers',
      type: 'array',
      label: 'Column Headers',
      fields: [
        { name: 'name', type: 'text', required: true },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Vehicle Price Rows',
      fields: [
        { name: 'vehicle', type: 'text', required: true },
        { name: 'h8', type: 'text', label: '8 Hrs / 80 Kms' },
        { name: 'h10', type: 'text', label: '10 Hrs / 100 Kms' },
        { name: 'h12', type: 'text', label: '12 Hrs / 120 Kms' },
        { name: 'extra', type: 'text', label: 'Extra Rate' },
      ],
    },
  ],
};
