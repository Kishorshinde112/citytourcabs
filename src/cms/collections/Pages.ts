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

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    group: 'CONTENT',
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'updatedAt'],
    components: {
      views: {
        edit: {
          root: {
            Component: '@/components/admin/editors/PageEditor#PageEditor',
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
        triggerRevalidation(doc?.slug === 'home' ? '' : doc?.slug, [CACHE_TAGS.pages]);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        triggerRevalidation(doc?.slug === 'home' ? '' : doc?.slug, [CACHE_TAGS.pages]);
        return doc;
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              name: 'title',
              label: 'Page Title',
              type: 'text',
              required: true,
            },
            {
              name: 'layout',
              label: 'Page Blocks',
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
  ],
};
