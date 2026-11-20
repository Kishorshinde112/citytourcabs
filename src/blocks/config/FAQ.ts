import type { Block } from 'payload';

export const FAQBlockConfig: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'Questions & Answers',
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Question' },
        { name: 'answer', type: 'textarea', required: true, label: 'Answer' },
      ],
    },
  ],
};
