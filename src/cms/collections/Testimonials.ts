import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';
import { triggerRevalidation } from '@/cms/hooks/revalidate';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  admin: {
    group: 'CONTENT',
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'trip', 'date', 'updatedAt'],
    components: {
      afterListTable: ['@/components/admin/RecordDrawer#RecordDrawer'],
    },
  },
  access: { read: () => true, create: isCmsAdmin, update: isCmsAdmin, delete: isCmsAdmin },
  hooks: {
    afterChange: [({ doc }) => { triggerRevalidation(); return doc; }],
    afterDelete: [({ doc }) => { triggerRevalidation(); return doc; }],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Customer Name' },
    {
      name: 'rating',
      type: 'select',
      defaultValue: '5',
      label: 'Rating (1-5 Stars)',
      options: [
        { label: '★★★★★ (5 Stars - Excellent)', value: '5' },
        { label: '★★★★☆ (4 Stars - Very Good)', value: '4' },
        { label: '★★★☆☆ (3 Stars - Good)', value: '3' },
        { label: '★★☆☆☆ (2 Stars - Fair)', value: '2' },
        { label: '★☆☆☆☆ (1 Star - Poor)', value: '1' },
      ],
    },
    { name: 'trip', type: 'text', label: 'Trip Name (e.g. Mumbai Darshan (Full Day))' },
    { name: 'location', type: 'text', label: 'Customer Location (e.g. Bandra, Mumbai)' },
    { name: 'date', type: 'text', label: 'Date (e.g. August 2026)' },
    { name: 'avatar', type: 'text', label: 'Avatar URL' },
    { name: 'text', type: 'textarea', required: true, label: 'Review Text' },
    { name: 'comment', type: 'textarea', admin: { hidden: true } },
  ],
};
