import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';
import { CACHE_TAGS, triggerRevalidation } from '@/cms/hooks/revalidate';
import {
  HeroBlock,
  RichTextBlock,
  RateTableBlock,
  CTABlock,
  TourGridBlock,
  FleetBlock,
  GalleryBlock,
  TestimonialBlock,
  FAQBlock,
  BookingFormBlock,
  WhyChooseUsBlock,
  AboutBlock,
  BookingContactFormBlock,
  TourDetailsBlock,
} from '@/blocks';

export const Tours: CollectionConfig = {
  slug: 'tours',
  labels: {
    singular: 'Tour Package',
    plural: 'Tour Packages',
  },
  defaultSort: 'displayOrder',
  admin: {
    group: 'CONTENT',
    useAsTitle: 'title',
    defaultColumns: ['id', 'displayOrder', 'title', 'slug', 'updatedAt'],
    components: {
      views: {
        edit: {
          root: {
            Component: '@/components/admin/editors/TourEditor#TourEditor',
          },
        },
      },
    },
  },
  access: {
    read: () => true,
    update: isCmsAdmin,
    create: isCmsAdmin,
    delete: isCmsAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        triggerRevalidation(doc?.slug, [CACHE_TAGS.tours]);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        triggerRevalidation(doc?.slug, [CACHE_TAGS.tours]);
        return doc;
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content & Sections',
          fields: [
            {
              name: 'title',
              label: 'Tour Package Title',
              type: 'text',
              required: true,
            },
            {
              name: 'layout',
              label: 'Tour Sections & Rate Details',
              type: 'blocks',
              admin: {
                initCollapsed: true,
              },
              blocks: [
                HeroBlock,
                RichTextBlock,
                RateTableBlock,
                CTABlock,
                TourGridBlock,
                FleetBlock,
                GalleryBlock,
                TestimonialBlock,
                FAQBlock,
                BookingFormBlock,
                WhyChooseUsBlock,
                AboutBlock,
                BookingContactFormBlock,
                TourDetailsBlock,
              ],
            },
          ],
        },
        {
          label: 'SEO Metadata',
          fields: [
            {
              name: 'seo',
              label: 'Search Engine Optimization',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Meta Title' },
                { name: 'description', type: 'textarea', label: 'Meta Description' },
                { name: 'canonical', type: 'text', label: 'Canonical URL' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      required: true,
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startingPrice',
      label: 'Starting Price',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
