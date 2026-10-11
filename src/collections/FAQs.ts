import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
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
      name: 'question',
      type: 'text',
      required: true,
      label: 'Frequently Asked Question',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Answer',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General & Booking', value: 'general' },
        { label: 'Mumbai Darshan', value: 'mumbai-darshan' },
        { label: 'Outstation & Weekend Tours', value: 'outstation' },
        { label: 'Pricing & Cancellation', value: 'pricing' },
      ],
      defaultValue: 'general',
      label: 'Category',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order (lower number = appears first)',
    },
  ],
}
