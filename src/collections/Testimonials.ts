import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'rating', 'tourName', 'featured'],
    group: 'Page Sections & Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Customer City / Origin (e.g. "Delhi", "Bengaluru")',
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Star Rating (1-5)',
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Review / Testimonial Text',
    },
    {
      name: 'tourName',
      type: 'text',
      label: 'Tour or Cab Service Used (e.g. "Mumbai Sightseeing")',
    },
    {
      name: 'date',
      type: 'text',
      label: 'Date (e.g. "March 2026")',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Customer Photo URL (Optional)',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Display on Homepage?',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Sorting Order (lower number = higher priority)',
    },
  ],
}
