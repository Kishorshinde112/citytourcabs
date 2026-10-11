import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Page Sections & Content',
  },
  access: {
    read: () => true, // Publicly readable for website
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
      label: 'Page / Section Title (Internal Use)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Leave exactly as "home" or "about" to connect to website sections.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Slider / Banner',
          description: 'Top section images and headlines.',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              label: 'Hero Slides (Homepage Carousel or About Banner)',
              admin: {
                components: {
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headline',
                      type: 'text',
                      label: 'Main Headline',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'subheadline',
                      type: 'text',
                      label: 'Sub-headline / Tagline',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Upload Slide Image',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'imageUrl',
                      type: 'text',
                      label: 'Or Fallback Slide Image URL',
                      admin: { width: '50%' }
                    },
                  ]
                }
              ],
            },
          ]
        },
        {
          label: 'Why Choose Us / Features',
          description: 'Highlight cards that show below the hero section.',
          fields: [
            {
              name: 'whyChooseUs',
              type: 'array',
              label: 'Feature Cards',
              admin: {
                components: {
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Card Title',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'Clock / 24x7', value: 'Clock' },
                        { label: 'Shield / Safe', value: 'Shield' },
                        { label: 'Map Pin / Routes', value: 'MapPin' },
                        { label: 'Star / Ratings', value: 'Star' },
                        { label: 'Users / Family', value: 'Users' },
                        { label: 'Car / Fleet', value: 'Car' },
                      ],
                      defaultValue: 'Clock',
                      label: 'Select Icon',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Short Description',
                }
              ]
            }
          ]
        },
        {
          label: 'About Page Story & Stats',
          description: 'Content specifically for the About Us page.',
          fields: [
            {
              name: 'aboutStoryText',
              type: 'textarea',
              label: 'Company Story / About Text',
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Counters / Stats',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'number',
                      type: 'text',
                      label: 'Number (e.g. 50,000+)',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label (e.g. Happy Customers)',
                      admin: { width: '50%' }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
}
