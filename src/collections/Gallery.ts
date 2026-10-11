import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'imageUrl', 'order'],
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Photo Title / Landmark',
    },
    {
      name: 'imageMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Upload Photo (Click to choose/upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Or Fallback Image URL / Asset Path',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location / City Tag (e.g. "Mumbai", "Lonavala", "Marine Drive")',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Short Caption (Optional)',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
    },
  ],
}
