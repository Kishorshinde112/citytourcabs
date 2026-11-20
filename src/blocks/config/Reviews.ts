import type { Block } from 'payload';

export const ReviewsBlockConfig: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials / Reviews',
    plural: 'Testimonial Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'What Our Travellers Say',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
  ],
};
