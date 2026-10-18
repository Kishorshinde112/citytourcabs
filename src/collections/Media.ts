import { isCmsAdmin } from '@/lib/cmsAccess';
import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'MEDIA',
  },
  access: {
    read: () => true,
    create: isCmsAdmin,
    update: isCmsAdmin,
    delete: isCmsAdmin,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc && doc.filename) {
          doc.url = `/media/${doc.filename}`
        }
        return doc
      },
    ],
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (SEO & Accessibility)',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (Optional)',
    },
  ],
}
