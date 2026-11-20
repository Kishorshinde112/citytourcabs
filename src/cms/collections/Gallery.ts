import { isCmsAdmin } from '@/cms/access';
import type { CollectionConfig } from 'payload';
import { triggerRevalidation } from '@/cms/hooks/revalidate';

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery Photo',
    plural: 'Gallery',
  },
  admin: {
    group: 'CONTENT',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
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
            // Ignore
          }
        }
        return data;
      },
    ],
    afterChange: [({ doc }) => { triggerRevalidation(); return doc; }],
    afterDelete: [({ doc }) => { triggerRevalidation(); return doc; }],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Photo Title' },
    { name: 'category', type: 'text', label: 'Category (e.g. Mumbai, Hill Stations, Beaches, Spiritual)' },
    { name: 'imageUrl', type: 'text', label: 'Image URL / Path' },
    { name: 'image', type: 'upload', relationTo: 'media', required: false },
  ],
};
