import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';
import { triggerRevalidation } from '@/cms/hooks/revalidate';

export const Fleet: CollectionConfig = {
  slug: 'fleet',
  labels: {
    singular: 'Fleet Vehicle',
    plural: 'Fleet',
  },
  admin: {
    group: 'CONTENT',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'seats', 'ratePerKm', 'updatedAt'],
    components: {
      afterListTable: ['@/components/admin/RecordDrawer#RecordDrawer'],
    },
  },
  access: { read: () => true, create: isCmsAdmin, update: isCmsAdmin, delete: isCmsAdmin },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data?.image && req?.payload) {
          try {
            const mediaId = typeof data.image === 'object' ? data.image.id : data.image;
            const media: any = await req.payload.findByID({ collection: 'media', id: mediaId });
            if (media && (media.url || media.filename)) {
              data.imageUrl = media.url || `/media/${media.filename}`;
            }
          } catch {
            // Ignore if media record not found
          }
        }
        return data;
      },
    ],
    afterChange: [({ doc }) => { triggerRevalidation(); return doc; }],
    afterDelete: [({ doc }) => { triggerRevalidation(); return doc; }],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Vehicle Name' },
            { name: 'category', type: 'text', label: 'Category (e.g. Hatchback, Prime Sedan)' },
            { name: 'tag', type: 'text', label: 'Badge Tag (e.g. Budget Friendly, Most Popular)' },
          ],
        },
        {
          label: 'Specifications',
          fields: [
            { name: 'seats', type: 'text', label: 'Seating (e.g. 4 + 1 Passengers)' },
            { name: 'configuration', type: 'text', label: 'Seat Layout' },
            { name: 'bootSpace', type: 'text', label: 'Boot Space' },
            { name: 'luggage', type: 'text', label: 'Luggage Capacity' },
            { name: 'acType', type: 'text', label: 'AC Type' },
            { name: 'fuelType', type: 'text', label: 'Fuel Type' },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            { name: 'ratePerKm', type: 'text', label: 'Rate Per Km' },
            { name: 'localFullDay', type: 'text', label: 'Local Full Day Rate' },
          ],
        },
        {
          label: 'Image',
          fields: [
            { name: 'imageUrl', type: 'text', label: 'Image URL / Path' },
            { name: 'image', type: 'upload', relationTo: 'media', required: false },
          ],
        },
        {
          label: 'Content',
          fields: [
            { name: 'bestFor', type: 'textarea', label: 'Best Suited For' },
            {
              name: 'features',
              type: 'textarea',
              label: 'Key Vehicle Features',
              admin: {
                description: 'Vehicle features (e.g. Dual Air Conditioning, Pushback Seats - one per line)',
              },
            },
          ],
        },
      ],
    },
    { name: 'seating', type: 'text', admin: { hidden: true } },
    { name: 'ac', type: 'checkbox', defaultValue: true, admin: { hidden: true } },
    { name: 'baseRate', type: 'text', admin: { hidden: true } },
  ],
};
