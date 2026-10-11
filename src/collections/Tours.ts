import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'startingPrice', 'duration', 'popular'],
    group: 'Tour Packages & Pricing',
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
      type: 'tabs',
      tabs: [
        {
          label: 'General Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Tour Title (e.g. Mumbai Darshan Tour)',
                  admin: { width: '50%' }
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  index: true,
                  admin: {
                    width: '50%',
                    description: 'URL slug (e.g. "mumbai-darshan", "lonavala-trip")',
                  },
                },
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Short Tagline / Badge (e.g. Best Seller / Popular)',
                  admin: { width: '33%' }
                },
                {
                  name: 'duration',
                  type: 'text',
                  label: 'Duration (e.g. Full Day / 8-10 Hours)',
                  admin: { width: '33%' }
                },
                {
                  name: 'startingPrice',
                  type: 'text',
                  label: 'Starting Price (e.g. ₹2,499)',
                  admin: { width: '34%' }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroImageMedia',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Upload Hero Banner Image (Choose from Library)',
                  admin: { width: '50%' }
                },
                {
                  name: 'heroImage',
                  type: 'text',
                  label: 'Or Fallback Hero Image URL / Asset Path',
                  admin: { width: '50%' }
                },
              ]
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Brief Overview & Highlights',
            },
            {
              name: 'popular',
              type: 'checkbox',
              defaultValue: false,
              label: 'Feature on Homepage Tours section?',
            },
          ]
        },
        {
          label: 'Pricing & Cabs',
          description: 'Configure the vehicles and rates available for this specific tour.',
          fields: [
            {
              name: 'pricingTiers',
              type: 'array',
              label: 'Car Fleet Rates',
              admin: {
                components: {
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'vehicleName',
                      type: 'text',
                      required: true,
                      label: 'Vehicle Name (e.g. Maruti Dzire)',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'category',
                      type: 'select',
                      options: [
                        { label: 'Sedan (4 Seater)', value: 'Sedan' },
                        { label: 'SUV (6 Seater)', value: 'SUV' },
                        { label: 'Premium SUV (7 Seater)', value: 'Premium SUV' },
                        { label: 'Tempo Traveller (13-17 Seater)', value: 'Tempo Traveller' },
                      ],
                      defaultValue: 'Sedan',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'capacity',
                      type: 'text',
                      defaultValue: '4 Passengers + 1 Driver',
                      label: 'Seating Capacity',
                      admin: { width: '33%' }
                    },
                    {
                      name: 'rate',
                      type: 'text',
                      required: true,
                      label: 'Tour Package Rate (e.g. ₹2,499)',
                      admin: { width: '33%' }
                    },
                    {
                      name: 'extraKmRate',
                      type: 'text',
                      defaultValue: '₹13/km',
                      label: 'Extra KM Charge (e.g. ₹13/km)',
                      admin: { width: '34%' }
                    }
                  ]
                },
                {
                  name: 'features',
                  type: 'text',
                  defaultValue: 'AC • Sanitized • Professional Chauffeur',
                  label: 'Key Amenities',
                },
              ],
            },
          ]
        },
        {
          label: 'Sightseeing Points',
          fields: [
            {
              name: 'sightseeingPoints',
              type: 'array',
              label: 'Tourist Spots & Attractions',
              admin: {
                components: {
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Place / Landmark Name',
                      admin: { width: '60%' }
                    },
                    {
                      name: 'timing',
                      type: 'text',
                      label: 'Recommended Time (e.g. 45 Mins)',
                      admin: { width: '40%' }
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
                      label: 'Upload Landmark Photo',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'imageUrl',
                      type: 'text',
                      label: 'Or Fallback Landmark Photo URL',
                      admin: { width: '50%' }
                    },
                  ]
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Short Description & Highlights',
                },
              ],
            },
          ]
        },
        {
          label: 'Itinerary & Rules',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              label: 'Tour Timeline / Day-by-Day Schedule',
              admin: {
                components: {
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'timeOrDay',
                      type: 'text',
                      label: 'Time/Day (e.g. "08:30 AM" or "Day 1")',
                      admin: { width: '30%' }
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Activity Title',
                      admin: { width: '70%' }
                    }
                  ]
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Activity Details',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'inclusions',
                  type: 'array',
                  label: 'What is Included (Checklist)',
                  admin: { width: '50%' },
                  fields: [
                    {
                      name: 'item',
                      type: 'text',
                      label: 'Included Item',
                    },
                  ],
                },
                {
                  name: 'exclusions',
                  type: 'array',
                  label: 'What is Excluded (Checklist)',
                  admin: { width: '50%' },
                  fields: [
                    {
                      name: 'item',
                      type: 'text',
                      label: 'Excluded Item',
                    },
                  ],
                }
              ]
            },
            {
              name: 'tourFaqs',
              type: 'array',
              label: 'Frequently Asked Questions for this Tour',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Answer',
                },
              ],
            },
          ]
        },
        {
          label: 'Advanced HTML',
          description: 'Use these only if you want to completely override the default layout.',
          fields: [
            {
              name: 'rateTableHtml',
              type: 'textarea',
              label: 'Custom Rate Table HTML',
            },
            {
              name: 'itineraryHtml',
              type: 'textarea',
              label: 'Custom Itinerary HTML',
            },
          ]
        }
      ]
    }
  ],
}
