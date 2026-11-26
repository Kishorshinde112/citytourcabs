import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';
import { CACHE_TAGS, triggerRevalidation } from '@/cms/hooks/revalidate';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    group: 'CONTENT',
    useAsTitle: 'question',
    defaultColumns: ['question', 'updatedAt'],
    components: {
      afterListTable: ['@/components/admin/RecordDrawer#RecordDrawer'],
    },
  },
  access: { read: () => true, create: isCmsAdmin, update: isCmsAdmin, delete: isCmsAdmin },
  hooks: {
    afterChange: [({ doc }) => { triggerRevalidation(undefined, [CACHE_TAGS.faqs]); return doc; }],
    afterDelete: [({ doc }) => { triggerRevalidation(undefined, [CACHE_TAGS.faqs]); return doc; }],
  },
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Question' },
    { name: 'answer', type: 'richText', required: true, label: 'Answer' },
  ],
};
